import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { LiveDiagnosisSchema, type LiveDiagnosis, type LivePayload } from './types';

export const AI_MODEL = process.env.AEGIS_AI_MODEL ?? 'claude-opus-5-5';

// Kept byte-stable so it can be prompt-cached; per-request data goes in the user turn.
const SYSTEM_PROMPT = `You are the AI diagnosis stage of Aegis-PV, a virtual solar technician for homes in Saudi Arabia and the GCC.

You receive one JSON payload with four groups:
- climate: live Open-Meteo weather for the site (GHI, DNI, DHI, GTI = plane-of-array irradiance, ambient temperature, humidity, wind, cloud cover), current 15-minute values plus hourly means for the analysis day.
- operational: inverter readings (DC voltage, per-string current, DC/AC power, AC voltage, energy today). These are SIMULATED from Saudi averages, not real telemetry.
- context: the system profile (location, array size, module specs, tilt/azimuth, age, degradation rate, days since cleaning, soiling rate) with sources.
- twin: the digital-twin baseline. expectedKw per hour already includes irradiance, temperature and inverter efficiency, but NOT age degradation or soiling, so those appear in the gap. gapPct is the day's energy gap.

Your job: classify the most likely cause of any gap between expected and actual output and tell a non-technical homeowner what to do.

Known signatures (starting points, not proof):
- Soiling: gradual, persistent reduction spread evenly across the day; grows with days since cleaning.
- Fixed shading: a repeating dip at a similar time of day while other hours track the baseline.
- String or inverter fault: a sudden step down or complete loss of output while irradiance is present.
- Heat: already handled by the baseline; mention it only if cell temperature is extreme.
- Age degradation: a small uniform gap consistent with age × degradation rate.

Rules:
1. Never invent numbers. Every number you mention must come from the payload or be simple arithmetic on it.
2. Only set isFault to true when confidence >= 85, or when the finding is a critical electrical condition (status "critical").
3. Below 85% confidence, phrase the result as something to watch, not an alert.
4. Separate safe homeowner actions (cleaning, checking for shade from the ground) from electrical work. Anything electrical must say to contact a qualified technician; set actionAudience to "technician".
5. A gap under ~3% is healthy: cause "none", status "healthy", no action.
6. healthScore (0-100) reflects current performance, open faults and data quality.
7. confidenceBreakdown scores (0-100): modelProbability = how well the signature matches, dataQuality = completeness/plausibility of the data, eventDuration = how long the pattern has persisted.
8. evidence: 2-5 short bullets naming the specific data behind the decision.
9. Plain, calm English. Title at most 5 words. Summary 1-2 sentences. One clear action.`;

export class AiUnavailableError extends Error {}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new AiUnavailableError('ANTHROPIC_API_KEY is not set');
  client ??= new Anthropic({ timeout: 90_000, maxRetries: 1 });
  return client;
}

/** Sends the report-shaped payload to Claude and returns a schema-valid diagnosis. */
export async function aiDiagnosis(payload: LivePayload): Promise<LiveDiagnosis> {
  const anthropic = getClient();
  try {
    const response = await anthropic.beta.messages.parse({
      model: AI_MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: betaZodOutputFormat(LiveDiagnosisSchema) },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [
        {
          role: 'user',
          content: `Diagnose this site.\n\n<payload>\n${JSON.stringify(payload)}\n</payload>`,
        },
      ],
    });

    if (response.stop_reason === 'refusal') throw new AiUnavailableError('model declined the request');
    if (response.stop_reason === 'max_tokens') throw new AiUnavailableError('model output was truncated');
    if (!response.parsed_output) throw new AiUnavailableError('model output did not match the diagnosis schema');
    return response.parsed_output;
  } catch (error) {
    if (error instanceof AiUnavailableError) throw error;
    if (error instanceof Anthropic.AuthenticationError) throw new AiUnavailableError('invalid Anthropic API key');
    if (error instanceof Anthropic.RateLimitError) throw new AiUnavailableError('Anthropic rate limit reached');
    if (error instanceof Anthropic.APIConnectionTimeoutError) throw new AiUnavailableError('Anthropic request timed out');
    if (error instanceof Anthropic.APIError) throw new AiUnavailableError(`Anthropic API error ${error.status ?? ''}`.trim());
    throw new AiUnavailableError(error instanceof Error ? error.message : 'unknown AI error');
  }
}
