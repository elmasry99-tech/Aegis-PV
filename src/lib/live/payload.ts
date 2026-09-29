import { SITE_TIMEZONE } from './sites';
import { cellTemperature, expectedPowerKw, simulateInverter, TWIN_METHOD } from './twin';
import type { ChartPoint, LiveMetrics, LivePayload, SiteProfile, WeatherSnapshot } from './types';

const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

/** Builds the report-shaped payload (climate · operational · context · twin) — rules/data-contract.md. */
export function buildPayload(site: SiteProfile, weather: WeatherSnapshot): LivePayload {
  const operationalHourly = weather.hourly.map((p) => simulateInverter(site, p));
  const twinHourly = weather.hourly.map((p, i) => ({
    time: p.time,
    cellTempC: cellTemperature(site, p),
    expectedKw: expectedPowerKw(site, p),
    actualKw: operationalHourly[i].acPowerKw,
  }));

  // Hourly values are 1-hour means, so kW summed over hours = kWh.
  const expectedEnergyKwh = round(twinHourly.reduce((s, p) => s + p.expectedKw, 0), 1);
  const actualEnergyKwh = round(twinHourly.reduce((s, p) => s + p.actualKw, 0), 1);
  const gapPct = expectedEnergyKwh > 0 ? round(((expectedEnergyKwh - actualEnergyKwh) / expectedEnergyKwh) * 100, 1) : 0;

  const isDaylight = weather.current.isDay && weather.current.gti > 20;
  const currentOp = isDaylight
    ? simulateInverter(site, weather.current)
    : { time: weather.current.time, dcVoltageV: 0, stringCurrentA: Array(site.strings).fill(0), dcPowerKw: 0, acPowerKw: 0, acVoltageV: 0 };

  const { id: _id, name, city, lat, lon, sources, ...system } = site;
  void _id;

  return {
    climate: { source: 'open-meteo', current: weather.current, hourly: weather.hourly },
    operational: {
      source: 'simulated',
      note: 'Simulated inverter: digital-twin output reduced by Saudi-average age degradation and soiling since last cleaning, plus ±1.5 % noise. Not real telemetry.',
      current: { ...currentOp, energyTodayKwh: actualEnergyKwh },
      hourly: operationalHourly,
    },
    context: {
      location: { name, city, lat, lon, timezone: SITE_TIMEZONE },
      system,
      sources,
    },
    twin: {
      method: TWIN_METHOD,
      analysisDate: weather.analysisDate,
      localTime: weather.current.time,
      isDaylight,
      hourly: twinHourly,
      expectedEnergyKwh,
      actualEnergyKwh,
      gapPct,
    },
  };
}

export function metricsFrom(site: SiteProfile, weather: WeatherSnapshot, payload: LivePayload): LiveMetrics {
  const isDay = payload.twin.isDaylight;
  return {
    currentOutputKw: payload.operational.current.acPowerKw,
    expectedOutputKw: isDay ? expectedPowerKw(site, weather.current) : 0,
    energyTodayKwh: payload.twin.actualEnergyKwh,
    expectedEnergyTodayKwh: payload.twin.expectedEnergyKwh,
    gapPct: payload.twin.gapPct,
    ghi: weather.current.ghi,
    gti: weather.current.gti,
    ambientTempC: weather.current.ambientTempC,
    cellTempC: isDay ? cellTemperature(site, weather.current) : weather.current.ambientTempC,
    humidityPct: weather.current.humidityPct,
  };
}

/** Daylight hours only, labelled HH:00, for the gap chart. */
export function chartFrom(payload: LivePayload): ChartPoint[] {
  const pts = payload.twin.hourly;
  const first = pts.findIndex((p) => p.expectedKw > 0);
  let last = -1;
  pts.forEach((p, i) => { if (p.expectedKw > 0) last = i; });
  const slice = first === -1 ? pts : pts.slice(Math.max(0, first - 1), last + 2);
  return slice.map((p) => ({ time: p.time.slice(11, 16), expected: p.expectedKw, actual: p.actualKw }));
}
