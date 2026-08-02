export interface DashboardState {
  scenario: import('@/shared/types').ScenarioKey;
}

export interface DashboardData {
  currentOutput: number;
  expectedOutput: number;
  waterSaved: number;
  co2Reduction: number;
}
