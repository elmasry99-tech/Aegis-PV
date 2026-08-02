export type ClimatePoint = {
  time: string;
  irradiance: number; // W/m²
  temperature: number; // °C
  humidity: number; // %
};

// 24 data points from 06:00 to 18:00 (every 30 min)
// Realistic for Riyadh, Saudi Arabia in summer (July)
// Irradiance peaks around 12:00-13:00 (~950 W/m²)
// Temperature rises from ~28°C at dawn to ~42°C at 15:00, then drops
// Humidity drops from ~65% in early morning to ~28% at midday
export const CLIMATE_DATA: ClimatePoint[] = [
  { time: '06:00', irradiance: 85,  temperature: 28.2, humidity: 64 },
  { time: '06:30', irradiance: 165, temperature: 29.0, humidity: 62 },
  { time: '07:00', irradiance: 290, temperature: 30.1, humidity: 59 },
  { time: '07:30', irradiance: 420, temperature: 31.4, humidity: 56 },
  { time: '08:00', irradiance: 545, temperature: 32.8, humidity: 53 },
  { time: '08:30', irradiance: 655, temperature: 34.1, humidity: 50 },
  { time: '09:00', irradiance: 750, temperature: 35.5, humidity: 47 },
  { time: '09:30', irradiance: 820, temperature: 36.7, humidity: 44 },
  { time: '10:00', irradiance: 870, temperature: 37.9, humidity: 41 },
  { time: '10:30', irradiance: 910, temperature: 38.8, humidity: 38 },
  { time: '11:00', irradiance: 935, temperature: 39.6, humidity: 35 },
  { time: '11:30', irradiance: 948, temperature: 40.3, humidity: 33 },
  { time: '12:00', irradiance: 952, temperature: 41.0, humidity: 31 },
  { time: '12:30', irradiance: 950, temperature: 41.6, humidity: 29 },
  { time: '13:00', irradiance: 945, temperature: 42.1, humidity: 28 },
  { time: '13:30', irradiance: 928, temperature: 42.3, humidity: 28 },
  { time: '14:00', irradiance: 900, temperature: 42.0, humidity: 29 },
  { time: '14:30', irradiance: 855, temperature: 41.5, humidity: 30 },
  { time: '15:00', irradiance: 790, temperature: 40.8, humidity: 32 },
  { time: '15:30', irradiance: 710, temperature: 39.9, humidity: 34 },
  { time: '16:00', irradiance: 610, temperature: 38.7, humidity: 37 },
  { time: '16:30', irradiance: 490, temperature: 37.3, humidity: 40 },
  { time: '17:00', irradiance: 355, temperature: 35.8, humidity: 44 },
  { time: '17:30', irradiance: 210, temperature: 34.1, humidity: 48 },
  { time: '18:00', irradiance: 75,  temperature: 32.5, humidity: 52 },
];
