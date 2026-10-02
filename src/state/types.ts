/**
 * State definitions and preset constants for the Lifespan Calculator.
 */

export type ModelType = 'normal' | 'gompertz' | 'lev';
export type ScenarioPreset = 'worst' | 'status_quo' | 'best' | 'custom';
export type Language = 'en' | 'vi';
export type UiMode = 'simple' | 'detailed';
export type ActiveSection = 'all' | 'purchasing_power' | 'human_infra';

export interface NormalParams {
  mu: number;
  sigma: number;
}

export interface GompertzParams {
  M: number;
  beta: number;
}

export interface ScenarioOverlays {
  worst: boolean;
  status_quo: boolean;
  best: boolean;
}

export interface State {
  age: number;
  modelType: ModelType;
  scenarioPreset: ScenarioPreset;
  normalParams: NormalParams;
  gompertzParams: GompertzParams;
  overlayScenarios: ScenarioOverlays;
  sleepHours: number;
  workHours: number;
  commuteHours: number;
  screenHours: number;
  mealsPerDay: number;
  booksPerYear: number;
  memoryStartAge: number;
  baselineAge: number;
  hideCountdown: boolean;
  language: Language;
  uiMode: UiMode;

  // Human Infra extension fields
  peakFocusHours: number;
  aiLeverageFactor: number;
  healthyRatio: number;
  activeSection: ActiveSection;
}

export const SCENARIO_PRESETS: Record<'worst' | 'status_quo' | 'best', NormalParams> = {
  worst: { mu: 68, sigma: 7 },
  status_quo: { mu: 79, sigma: 9 },
  best: { mu: 93, sigma: 6 },
};

export const DEFAULT_STATE: State = {
  age: 25,
  modelType: 'normal',
  scenarioPreset: 'status_quo',
  normalParams: { ...SCENARIO_PRESETS.status_quo },
  gompertzParams: { M: 82, beta: 9.5 },
  overlayScenarios: {
    worst: true,
    status_quo: false,
    best: true,
  },
  sleepHours: 8,
  workHours: 8,
  commuteHours: 1,
  screenHours: 3,
  mealsPerDay: 3,
  booksPerYear: 12,
  memoryStartAge: 4,
  baselineAge: 19,
  hideCountdown: false,
  language: 'en',
  uiMode: 'detailed',

  // Human Infra defaults
  peakFocusHours: 4,
  aiLeverageFactor: 1.5,
  healthyRatio: 0.88,
  activeSection: 'all',
};
