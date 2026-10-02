import { State, DEFAULT_STATE, SCENARIO_PRESETS } from './types';

function clamp(value: unknown, min: number, max: number, defaultVal: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return defaultVal;
  return Math.max(min, Math.min(max, value));
}

export function validateState(input?: Partial<State> | null): State {
  if (!input) return { ...DEFAULT_STATE };

  const age = clamp(input.age, 0, 120, DEFAULT_STATE.age);

  const modelType =
    input.modelType === 'normal' || input.modelType === 'gompertz' || input.modelType === 'lev'
      ? input.modelType
      : DEFAULT_STATE.modelType;

  const scenarioPreset =
    input.scenarioPreset === 'worst' ||
    input.scenarioPreset === 'status_quo' ||
    input.scenarioPreset === 'best' ||
    input.scenarioPreset === 'custom'
      ? input.scenarioPreset
      : DEFAULT_STATE.scenarioPreset;

  const presetDefault =
    scenarioPreset !== 'custom'
      ? SCENARIO_PRESETS[scenarioPreset]
      : DEFAULT_STATE.normalParams;

  const mu = clamp(input.normalParams?.mu, 30, 130, presetDefault.mu);
  const sigma = clamp(input.normalParams?.sigma, 1, 30, presetDefault.sigma);

  const M = clamp(input.gompertzParams?.M, 50, 120, DEFAULT_STATE.gompertzParams.M);
  const beta = clamp(input.gompertzParams?.beta, 2, 25, DEFAULT_STATE.gompertzParams.beta);

  const overlayScenarios = {
    worst: Boolean(input.overlayScenarios?.worst ?? DEFAULT_STATE.overlayScenarios.worst),
    status_quo: Boolean(
      input.overlayScenarios?.status_quo ?? DEFAULT_STATE.overlayScenarios.status_quo
    ),
    best: Boolean(input.overlayScenarios?.best ?? DEFAULT_STATE.overlayScenarios.best),
  };

  const sleepHours = clamp(input.sleepHours, 0, 24, DEFAULT_STATE.sleepHours);
  const workHours = clamp(input.workHours, 0, 24, DEFAULT_STATE.workHours);
  const commuteHours = clamp(input.commuteHours, 0, 24, DEFAULT_STATE.commuteHours);
  const screenHours = clamp(input.screenHours, 0, 24, DEFAULT_STATE.screenHours);
  const mealsPerDay = clamp(input.mealsPerDay, 0, 10, DEFAULT_STATE.mealsPerDay);
  const booksPerYear = clamp(input.booksPerYear, 0, 500, DEFAULT_STATE.booksPerYear);
  const memoryStartAge = clamp(input.memoryStartAge, 1, 20, DEFAULT_STATE.memoryStartAge);
  const baselineAge = clamp(input.baselineAge, 1, 120, DEFAULT_STATE.baselineAge);

  const language = input.language === 'vi' ? 'vi' : 'en';
  const uiMode = input.uiMode === 'simple' ? 'simple' : 'detailed';
  const hideCountdown = Boolean(input.hideCountdown);

  return {
    age,
    modelType,
    scenarioPreset,
    normalParams: { mu, sigma },
    gompertzParams: { M, beta },
    overlayScenarios,
    sleepHours,
    workHours,
    commuteHours,
    screenHours,
    mealsPerDay,
    booksPerYear,
    memoryStartAge,
    baselineAge,
    hideCountdown,
    language,
    uiMode,
  };
}
