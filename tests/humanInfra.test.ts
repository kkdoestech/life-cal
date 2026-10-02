import { describe, it, expect } from 'vitest';
import {
  computeHealthspanMetrics,
  computeDeepFocusMetrics,
  computeFlywheelMetrics,
  computeCalendarBridge,
  computeAiLeverageMetrics,
  computeBoundaryBalance,
} from '../src/model/humanInfra';
import { encodeStateToHash, decodeStateFromUrl } from '../src/state/url';
import { DEFAULT_STATE, State } from '../src/state/types';

describe('Human Infra Model Tests', () => {
  it('Calculates Healthspan (HALE) and Golden Window accurately', () => {
    const res = computeHealthspanMetrics(20, 80, 0.88);
    expect(res.haleEndAge).toBeCloseTo(70.4, 1);
    expect(res.goldenWindowYears).toBeCloseTo(50.4, 1);
    expect(res.fragilityYears).toBeCloseTo(9.6, 1);
    expect(res.goldenPercentOfRemaining).toBeCloseTo(84.0, 1);
  });

  it('Handles older age exceeding HALE gracefully (Golden Window clamps to 0)', () => {
    const res = computeHealthspanMetrics(75, 85, 0.88);
    expect(res.goldenWindowYears).toBe(0);
    expect(res.fragilityYears).toBeCloseTo(10, 1);
    expect(res.goldenPercentOfRemaining).toBe(0);
  });

  it('Bounds peak focus hours by available daily free time', () => {
    // User requested 4h focus, but only has 2.5h free time
    const bounded = computeDeepFocusMetrics(50, 2.5, 4);
    expect(bounded.effectiveDailyFocusHours).toBe(2.5);

    // User requested 4h focus and has 6h free time
    const normal = computeDeepFocusMetrics(60, 6, 4);
    expect(normal.effectiveDailyFocusHours).toBe(4);
    expect(normal.totalFocusHours).toBeCloseTo(60 * 365.25 * 4, 0);
    expect(normal.masteryQuotas10k).toBe(8); // 87,660 / 10,000 = 8
  });

  it('Computes Flywheel chapters and Failure Runway correctly', () => {
    const flywheel = computeFlywheelMetrics(60, 50);
    expect(flywheel.threeYearEras).toBe(20);
    expect(flywheel.fiveYearArcs).toBe(12);
    expect(flywheel.failureRunway).toBe(25); // 50 / 2 = 25 ambitious 2-year failures
  });

  it('Computes Calendar Bridge and biotech milestones reached', () => {
    const bridge = computeCalendarBridge(60, 45, 2026);
    expect(bridge.targetCalendarYear).toBe(2086);
    expect(bridge.goldenCalendarYear).toBe(2071);

    // All milestones (2035, 2040, 2045, 2055) should be reached for someone living to 2086
    expect(bridge.milestones.every((m) => m.reached)).toBe(true);

    // Someone with only 10 years left (reaching 2036) only reaches 2035
    const shortBridge = computeCalendarBridge(10, 8, 2026);
    expect(shortBridge.targetCalendarYear).toBe(2036);
    const reachedIds = shortBridge.milestones.filter((m) => m.reached).map((m) => m.id);
    expect(reachedIds).toEqual(['senolytics']);
  });

  it('Calculates AI output leverage and career equivalents', () => {
    const ai = computeAiLeverageMetrics(30, 60000, 2.0);
    expect(ai.leverageFactor).toBe(2.0);
    expect(ai.amplifiedAwakeYears).toBe(60);
    expect(ai.historicalCareerEquivalents).toBe(60); // (60000 * 2) / 2000 = 60
  });

  it('Calculates Boundary-Condition vs Boundary-Within investment balance', () => {
    const balance = computeBoundaryBalance(8, 4, 8, 1, 3);
    // Boundary condition: 8h sleep + 2.0h self-care = 10h
    expect(balance.boundaryConditionHours).toBe(10);
    expect(balance.boundaryWithinHours).toBe(14);
    expect(balance.continuityRatio).toBeCloseTo((10 / 24) * 100, 1);
  });

  it('Preserves Human Infra state fields across URL round-trip', () => {
    const custom: State = {
      ...DEFAULT_STATE,
      peakFocusHours: 5,
      aiLeverageFactor: 2.5,
      healthyRatio: 0.85,
      activeSection: 'human_infra',
    };

    const hash = encodeStateToHash(custom);
    const restored = decodeStateFromUrl(hash);

    expect(restored.peakFocusHours).toBe(5);
    expect(restored.aiLeverageFactor).toBe(2.5);
    expect(restored.healthyRatio).toBe(0.85);
    expect(restored.activeSection).toBe('human_infra');
  });
});
