# Rules · API and AI

Scope: `src/app/api/**`, `src/lib/live/**`. Format: `id · rule · why`.

- **A1 · Official SDK, structured output.** Claude is called with `@anthropic-ai/sdk` using `messages.parse` + `zodOutputFormat(LiveDiagnosisSchema)`. No hand-rolled `fetch`, no JSON-from-text parsing. *Why:* claude-api skill.
- **A2 · Model from env.** `process.env.AEGIS_AI_MODEL ?? 'claude-opus-5-5'`, `output_config.effort: 'low'`. Do not pass `thinking: {type:'disabled'}` or `budget_tokens` (400 on current models). *Why:* claude-api skill defaults.
- **A3 · The AI reasons, the twin computes.** Expected output, gap % and energy are computed in TypeScript and sent to Claude; Claude classifies, scores confidence and writes the action. Claude never invents a number that is in the payload. *Why:* report — baseline model is a separate stage from AI diagnosis.
- **A4 · Always a result.** Any Claude error (auth, rate limit, timeout, refusal, schema mismatch) → `rules.ts` diagnosis with `source: 'rules'`. Any weather error → last cached result with `stale: true`; with no cache → HTTP 503 with a message the UI shows. *Why:* agreed fallback.
- **A5 · Cache per site, 15 min.** Key = site id. `?refresh=1` bypasses. Open-Meteo updates every 15 min, so a tighter loop only costs money. *Why:* agreed refresh policy.
- **A6 · 85 % alert threshold.** `isFault` alerts with confidence < 85 are shown as "watch" (status `warning`, no alert wording). `critical` electrical findings bypass the threshold and direct to a technician. *Why:* report §Alert design.
- **A7 · Typed errors.** Catch `Anthropic.APIError` subclasses, not message strings. Log status + type, never the key or full payload. *Why:* claude-api skill.
- **A8 · Validate site ids.** Only ids in `SITE_PROFILES` are accepted; anything else → 404. *Why:* no open proxy to Open-Meteo/Claude.
