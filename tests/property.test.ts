import { describe, it, expect } from 'vitest';
import { computeNormalLifespan } from '../src/model/normal';
import { computeGompertzLifespan } from '../src/model/gompertz';
import { calculateSubjectiveTime, calculateFreeHours } from '../src/model/time';

describe('Property Tests', () => {
  it('Remaining time is strictly positive for all ages from 0 to 120 (Normal)', () => {
    for (let age = 0; age <= 120; age += 5) {
      const res = computeNormalLifespan(age, 79, 9);
      expect(res.remainingCalendarYears).toBeGreaterThan(0);
      expect(res.expectedEndAge).toBeGreaterThan(age);
      expect(res.p90RemainingYears).toBeGreaterThanOrEqual(res.p10RemainingYears);
    }
  });

  it('Remaining time is strictly positive for all ages from 0 to 120 (Gompertz)', () => {
    for (let age = 0; age <= 120; age += 5) {
      const res = computeGompertzLifespan(age, 82, 9.5);
      expect(res.remainingCalendarYears).toBeGreaterThan(0);
      expect(res.expectedEndAge).toBeGreaterThan(age);
      expect(res.p90RemainingYears).toBeGreaterThanOrEqual(res.p10RemainingYears);
    }
  });

  it('Increasing sigma widens the 10th-90th percentile range', () => {
    const narrow = computeNormalLifespan(30, 80, 5);
    const wide = computeNormalLifespan(30, 80, 12);
    const narrowRange = narrow.p90RemainingYears - narrow.p10RemainingYears;
    const wideRange = wide.p90RemainingYears - wide.p10RemainingYears;
    expect(wideRange).toBeGreaterThan(narrowRange);
  });

  it('Feels-half age always lies strictly between memory start m and expected end E', () => {
    for (let m = 2; m <= 10; m++) {
      for (let E = 60; E <= 100; E += 5) {
        const subj = calculateSubjectiveTime(20, E, m, 20);
        expect(subj.feelsHalfAge).toBeGreaterThan(m);
        expect(subj.feelsHalfAge).toBeLessThan(E);
      }
    }
  });

  it('Free hours never drops below zero even when over-allocated', () => {
    const overAllocated = calculateFreeHours(50, {
      sleepHours: 10,
      workHours: 10,
      commuteHours: 4,
      screenHours: 5,
    });
    expect(overAllocated.isOverAllocated).toBe(true);
    expect(overAllocated.freeHoursPerDay).toBe(0);
    expect(overAllocated.totalFreeHours).toBe(0);
  });
});
