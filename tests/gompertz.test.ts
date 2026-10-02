import { describe, it, expect } from 'vitest';
import {
  computeGompertzLifespan,
  gompertzPdf,
  gompertzCumulativeHazard,
} from '../src/model/gompertz';

describe('Gompertz Mortality Model (FR-13)', () => {
  it('PDF mode occurs near M=82', () => {
    const M = 82;
    const beta = 9.5;
    const modeDensity = gompertzPdf(M, M, beta);
    const leftDensity = gompertzPdf(70, M, beta);
    const rightDensity = gompertzPdf(96, M, beta);

    expect(modeDensity).toBeGreaterThan(leftDensity);
    expect(modeDensity).toBeGreaterThan(rightDensity);
  });

  it('Cumulative hazard increases monotonically with age', () => {
    const M = 82;
    const beta = 9.5;
    const h20 = gompertzCumulativeHazard(20, M, beta);
    const h50 = gompertzCumulativeHazard(50, M, beta);
    const h80 = gompertzCumulativeHazard(80, M, beta);

    expect(h50).toBeGreaterThan(h20);
    expect(h80).toBeGreaterThan(h50);
  });

  it('Calculates realistic conditional remaining lifespan', () => {
    const young = computeGompertzLifespan(20, 82, 9.5);
    expect(young.expectedEndAge).toBeGreaterThan(75);
    expect(young.expectedEndAge).toBeLessThan(85);
    expect(young.remainingCalendarYears).toBeCloseTo(young.expectedEndAge - 20, 1);

    const elderly = computeGompertzLifespan(85, 82, 9.5);
    expect(elderly.expectedEndAge).toBeGreaterThan(85);
    expect(elderly.remainingCalendarYears).toBeGreaterThan(0);
  });

  it('Conditional percentiles satisfy p10 < p90 and remain above current age', () => {
    const res = computeGompertzLifespan(65, 82, 9.5);
    expect(res.p10EndAge).toBeGreaterThanOrEqual(65);
    expect(res.p90EndAge).toBeGreaterThan(res.p10EndAge);
    expect(res.p10RemainingYears).toBeGreaterThan(0);
    expect(res.p90RemainingYears).toBeGreaterThan(res.p10RemainingYears);
  });
});
