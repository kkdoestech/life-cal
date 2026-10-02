import { State, DEFAULT_STATE } from './types';
import { validateState } from './validate';

/**
 * Encodes the State object into a URL hash string.
 * Uses compact and readable query-style key-value pairs.
 */
export function encodeStateToHash(state: State): string {
  const params = new URLSearchParams();

  params.set('a', (state.age ?? DEFAULT_STATE.age).toString());
  params.set('mt', state.modelType ?? DEFAULT_STATE.modelType);
  params.set('sp', state.scenarioPreset ?? DEFAULT_STATE.scenarioPreset);
  params.set('mu', (state.normalParams?.mu ?? DEFAULT_STATE.normalParams.mu).toString());
  params.set('sig', (state.normalParams?.sigma ?? DEFAULT_STATE.normalParams.sigma).toString());
  params.set('gM', (state.gompertzParams?.M ?? DEFAULT_STATE.gompertzParams.M).toString());
  params.set('gB', (state.gompertzParams?.beta ?? DEFAULT_STATE.gompertzParams.beta).toString());

  params.set('s', (state.sleepHours ?? DEFAULT_STATE.sleepHours).toString());
  params.set('w', (state.workHours ?? DEFAULT_STATE.workHours).toString());
  params.set('c', (state.commuteHours ?? DEFAULT_STATE.commuteHours).toString());
  params.set('sc', (state.screenHours ?? DEFAULT_STATE.screenHours).toString());

  params.set('meals', (state.mealsPerDay ?? DEFAULT_STATE.mealsPerDay).toString());
  params.set('books', (state.booksPerYear ?? DEFAULT_STATE.booksPerYear).toString());
  params.set('mstart', (state.memoryStartAge ?? DEFAULT_STATE.memoryStartAge).toString());
  params.set('base', (state.baselineAge ?? DEFAULT_STATE.baselineAge).toString());

  params.set('cd', state.hideCountdown ? '0' : '1');
  params.set('lang', state.language ?? DEFAULT_STATE.language);
  params.set('ui', state.uiMode ?? DEFAULT_STATE.uiMode);

  params.set('ow', state.overlayScenarios?.worst ? '1' : '0');
  params.set('os', state.overlayScenarios?.status_quo ? '1' : '0');
  params.set('ob', state.overlayScenarios?.best ? '1' : '0');

  // Human Infra parameters with safe fallbacks
  params.set('pf', (state.peakFocusHours ?? DEFAULT_STATE.peakFocusHours).toString());
  params.set('ai', (state.aiLeverageFactor ?? DEFAULT_STATE.aiLeverageFactor).toString());
  params.set('hr', (state.healthyRatio ?? DEFAULT_STATE.healthyRatio).toString());
  params.set('sec', state.activeSection ?? DEFAULT_STATE.activeSection);

  return '#' + params.toString();
}

/**
 * Decodes state from a URL hash or search string.
 * Falls back safely to defaults for any missing or invalid values.
 */
export function decodeStateFromUrl(urlFragmentOrSearch: string): State {
  if (!urlFragmentOrSearch) return { ...DEFAULT_STATE };

  let raw = urlFragmentOrSearch;
  if (raw.startsWith('#') || raw.startsWith('?')) {
    raw = raw.substring(1);
  }

  const params = new URLSearchParams(raw);
  const partial: Partial<State> = {};

  if (params.has('a')) partial.age = Number(params.get('a'));
  if (params.has('mt')) partial.modelType = params.get('mt') as State['modelType'];
  if (params.has('sp')) partial.scenarioPreset = params.get('sp') as State['scenarioPreset'];

  const mu = params.has('mu') ? Number(params.get('mu')) : undefined;
  const sig = params.has('sig') ? Number(params.get('sig')) : undefined;
  if (mu !== undefined || sig !== undefined) {
    partial.normalParams = {
      mu: mu ?? DEFAULT_STATE.normalParams.mu,
      sigma: sig ?? DEFAULT_STATE.normalParams.sigma,
    };
  }

  const gM = params.has('gM') ? Number(params.get('gM')) : undefined;
  const gB = params.has('gB') ? Number(params.get('gB')) : undefined;
  if (gM !== undefined || gB !== undefined) {
    partial.gompertzParams = {
      M: gM ?? DEFAULT_STATE.gompertzParams.M,
      beta: gB ?? DEFAULT_STATE.gompertzParams.beta,
    };
  }

  if (params.has('s')) partial.sleepHours = Number(params.get('s'));
  if (params.has('w')) partial.workHours = Number(params.get('w'));
  if (params.has('c')) partial.commuteHours = Number(params.get('c'));
  if (params.has('sc')) partial.screenHours = Number(params.get('sc'));

  if (params.has('meals')) partial.mealsPerDay = Number(params.get('meals'));
  if (params.has('books')) partial.booksPerYear = Number(params.get('books'));
  if (params.has('mstart')) partial.memoryStartAge = Number(params.get('mstart'));
  if (params.has('base')) partial.baselineAge = Number(params.get('base'));

  if (params.has('cd')) partial.hideCountdown = params.get('cd') === '0';
  if (params.has('lang')) partial.language = params.get('lang') as State['language'];
  if (params.has('ui')) partial.uiMode = params.get('ui') as State['uiMode'];

  if (params.has('ow') || params.has('os') || params.has('ob')) {
    partial.overlayScenarios = {
      worst: params.get('ow') === '1',
      status_quo: params.get('os') === '1',
      best: params.get('ob') === '1',
    };
  }

  // Human Infra parameters
  if (params.has('pf')) partial.peakFocusHours = Number(params.get('pf'));
  if (params.has('ai')) partial.aiLeverageFactor = Number(params.get('ai'));
  if (params.has('hr')) partial.healthyRatio = Number(params.get('hr'));
  if (params.has('sec')) partial.activeSection = params.get('sec') as State['activeSection'];

  return validateState(partial);
}
