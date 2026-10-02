import { describe, it, expect } from 'vitest';
import { computeNormalLifespan } from '../src/model/normal';
import {
  calculateAwakeDaysPerYear,
  calculateSubjectiveTime,
  calculateFreeHours,
} from '../src/model/time';
import { calculateEquivalents } from '../src/model/equivalents';

describe('Golden Value Tests (from spec)', () => {
  it('Conditional end age, young: a=19, mu=79, sigma=9 -> E=79.00, remaining=60.00', () => {
    const res = computeNormalLifespan(19, 79, 9);
    expect(res.expectedEndAge).toBeCloseTo(79.0, 1);
    expect(res.remainingCalendarYears).toBeCloseTo(60.0, 1);
  });

  it('Conditional end age, older: a=70, mu=79, sigma=9 -> E=81.59, remaining=11.59', () => {
    const res = computeNormalLifespan(70, 79, 9);
    expect(res.expectedEndAge).toBeCloseTo(81.59, 1);
    expect(res.remainingCalendarYears).toBeCloseTo(11.59, 1);
  });

  it('Conditional end age, past the mean: a=85, mu=79, sigma=9 -> E=90.39, remaining=5.39 (never negative)', () => {
    const res = computeNormalLifespan(85, 79, 9);
    expect(res.expectedEndAge).toBeCloseTo(90.39, 1);
    expect(res.remainingCalendarYears).toBeCloseTo(5.39, 1);
    expect(res.remainingCalendarYears).toBeGreaterThan(0);
  });

  it('Awake days per year: s=8 -> 243.5 days', () => {
    const awakeDays = calculateAwakeDaysPerYear(8);
    expect(awakeDays).toBeCloseTo(243.5, 1);
  });

  it('Feels-half age (original page example): m=4, E=80 -> 17.89', () => {
    const subj = calculateSubjectiveTime(19, 80, 4, 19);
    expect(subj.feelsHalfAge).toBeCloseTo(17.89, 2);
  });

  it('Perceived progress: a=19, m=4, E=79 -> 52.2%', () => {
    const subj = calculateSubjectiveTime(19, 79, 4, 19);
    expect(subj.perceivedProgress * 100).toBeCloseTo(52.2, 1);
  });

  it('Time inflation: a=19, E=79, b=19 -> 27.08 "years of today"', () => {
    const subj = calculateSubjectiveTime(19, 79, 4, 19);
    expect(subj.subjectiveYearsRemaining).toBeCloseTo(27.08, 1);
  });

  it('Free hours remaining: 60 years, s=8, work=8, commute=1, screen=3 -> 87,660 hours', () => {
    const free = calculateFreeHours(60, {
      sleepHours: 8,
      workHours: 8,
      commuteHours: 1,
      screenHours: 3,
    });
    expect(free.freeHoursPerDay).toBe(4);
    expect(free.totalFreeHours).toBeCloseTo(87660, 0);
  });

  it('Full moons: 60 years -> 742.1', () => {
    const equivs = calculateEquivalents(60, { mealsPerDay: 3, booksPerYear: 12 });
    const fullMoons = equivs.find((e) => e.id === 'full_moons');
    expect(fullMoons).toBeDefined();
    expect(fullMoons!.count).toBeCloseTo(742.1, 1);
  });
});
