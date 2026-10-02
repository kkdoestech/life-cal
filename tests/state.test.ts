import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE, State } from '../src/state/types';
import { validateState } from '../src/state/validate';
import { encodeStateToHash, decodeStateFromUrl } from '../src/state/url';
import { exportStateToJson, importStateFromJson } from '../src/state/storage';

describe('State & URL Persistence Tests', () => {
  it('URL encode and decode preserves identical state (Round-trip)', () => {
    const customState: State = {
      age: 32,
      modelType: 'normal',
      scenarioPreset: 'custom',
      normalParams: { mu: 84, sigma: 8 },
      gompertzParams: { M: 85, beta: 10 },
      overlayScenarios: { worst: false, status_quo: true, best: false },
      sleepHours: 7.5,
      workHours: 9,
      commuteHours: 1.5,
      screenHours: 4,
      mealsPerDay: 2,
      booksPerYear: 24,
      memoryStartAge: 5,
      baselineAge: 20,
      hideCountdown: true,
      language: 'vi',
      uiMode: 'detailed',
    };

    const hash = encodeStateToHash(customState);
    const restored = decodeStateFromUrl(hash);

    expect(restored).toEqual(customState);
  });

  it('Falls back safely to defaults for malformed or empty URL hash', () => {
    const restoredEmpty = decodeStateFromUrl('');
    expect(restoredEmpty).toEqual(DEFAULT_STATE);

    const restoredCorrupted = decodeStateFromUrl('#a=notanumber&mu=-9999&s=999');
    expect(restoredCorrupted.age).toBe(DEFAULT_STATE.age);
    expect(restoredCorrupted.normalParams.mu).toBe(30); // clamped to min
    expect(restoredCorrupted.sleepHours).toBe(24); // clamped to max
  });

  it('JSON export and import preserves identical state (Round-trip)', () => {
    const customState: State = {
      ...DEFAULT_STATE,
      age: 45,
      sleepHours: 7,
      workHours: 7.5,
      booksPerYear: 18,
    };

    const json = exportStateToJson(customState);
    const restored = importStateFromJson(json);

    expect(restored).toEqual(customState);
  });

  it('validateState clamps out-of-range inputs correctly', () => {
    const outOfBounds = validateState({
      age: 200,
      sleepHours: -5,
      workHours: 50,
      memoryStartAge: 0,
      mealsPerDay: 50,
    });

    expect(outOfBounds.age).toBe(120);
    expect(outOfBounds.sleepHours).toBe(0);
    expect(outOfBounds.workHours).toBe(24);
    expect(outOfBounds.memoryStartAge).toBe(1);
    expect(outOfBounds.mealsPerDay).toBe(10);
  });
});
