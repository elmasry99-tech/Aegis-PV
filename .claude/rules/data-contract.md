# Rules · data contract (what is sent to the AI)

Scope: the payload built in `src/lib/live/payload.ts`. It must match the report's
**Data ingestion layer**: *Climate* (irradiance, ambient temperature, humidity), *Operational*
(DC and AC voltage, string current, inverter power, energy), *Context* (tilt, azimuth, array
size, location, manufacturer specifications). Schema: `schemas/live-analysis-response.schema.json` → `payload`.

- **D1 · Three groups, report names.** The payload has exactly `climate`, `operational`, `context` (+ `twin` for the computed baseline and gap). Field names use the report's terms. *Why:* agreed — "the data sent should match what is found in the report".
- **D2 · Climate from Open-Meteo only.** `ghi`, `dni`, `dhi`, `gti` (plane of array), `ambientTempC`, `humidityPct`, `windKmh`, `cloudCoverPct` — current 15-min values + today's hourly series, `source: 'open-meteo'`. *Why:* agreed weather source.
- **D3 · Operational is simulated from Saudi averages.** `dcVoltageV`, `stringCurrentA[]`, `dcPowerKw`, `acPowerKw`, `acVoltageV`, `energyTodayKwh`, hourly `acPowerKw`, `source: 'simulated'`. Derived as: twin expected × (1 − age degradation) × (1 − soiling) × small deterministic noise. *Why:* agreed panel model.
- **D4 · Context = site profile.** Location (name, lat, lon), `arrayKwp`, `moduleEfficiencyPct`, `tempCoeffPctPerC`, `tiltDeg`, `azimuthDeg`, `ageYears`, `degradationPctPerYear`, `daysSinceCleaning`, `soilingRatePctPerDay`, `inverterEfficiencyPct`, module/string layout. *Why:* report context data.
- **D5 · Twin is physics, not AI.** Expected AC kW = kWp × GTI/1000 × (1 + γ·(Tcell − 25)) × η_inv, with Tcell = Tamb + GTI/800 × (NOCT − 20). NOCT 45 °C. *Why:* report §Digital twin: "uses available sunlight, panel area, efficiency, orientation, temperature effects".
- **D6 · Saudi constants with sources.** Degradation 0.8 %/yr (hot-desert c-Si field average — assumption, cite in code); Dhahran soiling 0.28 %/day (ref [3]: >50 % in 6 months); Riyadh soiling 0.25 %/day (assumption — ref [3] notes central region is less affected); temp coeff −0.35 %/°C (mono-PERC datasheet typical). *Why:* G6.
- **D7 · Night uses today's daylight.** When `is_day = 0`, current operational values are 0 and `isDaylight: false`; the analysis uses today's (or, before sunrise, yesterday's) daylight hours. *Why:* agreed night mode.
