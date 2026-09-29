import 'server-only';
import { z } from 'zod';
import { SITE_TIMEZONE } from './sites';
import type { ClimatePoint, SiteProfile, WeatherSnapshot } from './types';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10_000;

const VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'wind_speed_10m',
  'cloud_cover',
  'shortwave_radiation',
  'direct_normal_irradiance',
  'diffuse_radiation',
  'global_tilted_irradiance',
] as const;

const num = z.number().nullable();
const series = z.array(num);

const OpenMeteoSchema = z.object({
  current: z.object({
    time: z.string(),
    is_day: z.number(),
    temperature_2m: num,
    relative_humidity_2m: num,
    wind_speed_10m: num,
    cloud_cover: num,
    shortwave_radiation: num,
    direct_normal_irradiance: num,
    diffuse_radiation: num,
    global_tilted_irradiance: num,
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: series,
    relative_humidity_2m: series,
    wind_speed_10m: series,
    cloud_cover: series,
    shortwave_radiation: series,
    direct_normal_irradiance: series,
    diffuse_radiation: series,
    global_tilted_irradiance: series,
  }),
});

export class WeatherError extends Error {}

const r1 = (v: number | null | undefined) => Math.round((v ?? 0) * 10) / 10;

/** Fetches current + yesterday/today hourly climate for a site's plane of array. */
export async function fetchWeather(site: SiteProfile): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(site.lat),
    longitude: String(site.lon),
    current: ['is_day', ...VARS].join(','),
    hourly: VARS.join(','),
    tilt: String(site.tiltDeg),
    // Open-Meteo azimuth: 0 = south, -90 = east, 90 = west
    azimuth: String(site.azimuthDeg - 180),
    timezone: SITE_TIMEZONE,
    past_days: '1',
    forecast_days: '1',
  });

  let json: unknown;
  try {
    const res = await fetch(`${OPEN_METEO_URL}?${params}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!res.ok) throw new WeatherError(`Open-Meteo HTTP ${res.status}`);
    json = await res.json();
  } catch (e) {
    if (e instanceof WeatherError) throw e;
    throw new WeatherError(`Open-Meteo unreachable: ${e instanceof Error ? e.message : String(e)}`);
  }

  const parsed = OpenMeteoSchema.safeParse(json);
  if (!parsed.success) throw new WeatherError('Open-Meteo response did not match the expected shape');
  const { current, hourly } = parsed.data;

  const points: ClimatePoint[] = hourly.time.map((time, i) => ({
    time,
    ghi: r1(hourly.shortwave_radiation[i]),
    dni: r1(hourly.direct_normal_irradiance[i]),
    dhi: r1(hourly.diffuse_radiation[i]),
    gti: r1(hourly.global_tilted_irradiance[i]),
    ambientTempC: r1(hourly.temperature_2m[i]),
    humidityPct: r1(hourly.relative_humidity_2m[i]),
    windKmh: r1(hourly.wind_speed_10m[i]),
    cloudCoverPct: r1(hourly.cloud_cover[i]),
  }));

  // Analysis day: today once the sun has produced something, else yesterday (rule D7).
  const today = current.time.slice(0, 10);
  const todayPoints = points.filter((p) => p.time.startsWith(today) && p.time <= current.time);
  const todayHasSun = todayPoints.some((p) => p.gti > 50);
  const analysisDate = todayHasSun ? today : points[0].time.slice(0, 10);
  const dayPoints = todayHasSun ? todayPoints : points.filter((p) => p.time.startsWith(analysisDate));

  return {
    current: {
      time: current.time,
      isDay: current.is_day === 1,
      ghi: r1(current.shortwave_radiation),
      dni: r1(current.direct_normal_irradiance),
      dhi: r1(current.diffuse_radiation),
      gti: r1(current.global_tilted_irradiance),
      ambientTempC: r1(current.temperature_2m),
      humidityPct: r1(current.relative_humidity_2m),
      windKmh: r1(current.wind_speed_10m),
      cloudCoverPct: r1(current.cloud_cover),
    },
    hourly: dayPoints,
    analysisDate,
  };
}
