# Rules · global

Scope: every change in this repo. Format: `id · rule · why`. Status `active` unless marked superseded.

- **G1 · Report is the source of truth.** Features, inputs, thresholds and wording about what Aegis-PV does come from `Aegis-PV.docx`. When the code and the report disagree, raise it; do not silently pick one. *Why:* the dashboard is the report's demo.
- **G2 · Say "proposed", show confidence.** UI copy never claims a trained model, field accuracy, certainty or real telemetry. Every diagnosis shows its confidence and the evidence behind it. *Why:* report §Proposed solution: "should not claim that every diagnosis is certain".
- **G3 · Simulated means labelled.** Any simulated number (inverter readings, soiling, degradation) is labelled as simulated where a user could mistake it for measured data (the evidence page at minimum). *Why:* honesty with judges and users.
- **G4 · Safe vs technician.** Actions a homeowner can do safely (cleaning, visual shade check) are separated from electrical work, which always says "qualified technician". *Why:* report §Main risks — unsafe user action.
- **G5 · Secrets never committed.** API keys live in `.env.local` (git-ignored via `.env*`); `.env.example` documents names only. Never log a key. *Why:* security §Cybersecurity.
- **G6 · Cite numbers.** A physical constant or rate in code (soiling %/day, degradation %/yr, temp. coefficient) carries a comment naming its source or saying "assumption". *Why:* LEARNINGS 2026-09-29 soiling.
- **G7 · Evidence before done.** No agent reports a step done without the command output that proves it (gate reports, screenshots). *Why:* `verification-before-completion`.
