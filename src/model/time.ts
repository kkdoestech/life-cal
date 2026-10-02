/**
 * Calculations for awake time, free hours, and Weber-Fechner subjective time perception.
 */

export interface TimeBreakdown {
  sleepHours: number;
  workHours: number;
  commuteHours: number;
  screenHours: number;
}

export interface SubjectiveTimeMetrics {
  perceivedProgress: number; // Ratio 0.0 to 1.0 (e.g. 0.522 = 52.2%)
  feelsHalfAge: number;     // Age at which life feels half over (sqrt(m * E))
  subjectiveYearsRemaining: number; // In "years as they felt at age b": b * ln(E / a)
}

export interface RemainingTimeMetrics {
  calendarYears: number;
  awakeYears: number;
  awakeDaysPerYear: number;
  freeHoursPerDay: number;
  totalFreeHours: number;
  isOverAllocated: boolean;
  totalAllocatedHours: number;
}

const DAYS_PER_YEAR = 365.25;

/**
 * Calculates awake days per year given daily sleep hours.
 * For s = 8: 365.25 * (16 / 24) = 243.5 awake days.
 */
export function calculateAwakeDaysPerYear(sleepHours: number): number {
  const awakeHours = Math.max(0, Math.min(24, 24 - sleepHours));
  return DAYS_PER_YEAR * (awakeHours / 24);
}

/**
 * Calculates awake years remaining.
 */
export function calculateAwakeYears(calendarYears: number, sleepHours: number): number {
  const awakeFraction = Math.max(0, Math.min(1, (24 - sleepHours) / 24));
  return calendarYears * awakeFraction;
}

/**
 * Calculates free hours per day and total remaining free hours.
 */
export function calculateFreeHours(
  calendarYears: number,
  breakdown: TimeBreakdown
): {
  freeHoursPerDay: number;
  totalFreeHours: number;
  isOverAllocated: boolean;
  totalAllocatedHours: number;
} {
  const totalAllocated =
    breakdown.sleepHours +
    breakdown.workHours +
    breakdown.commuteHours +
    breakdown.screenHours;

  const isOverAllocated = totalAllocated > 24;
  const freeHoursPerDay = Math.max(0, 24 - totalAllocated);
  const totalFreeHours = calendarYears * DAYS_PER_YEAR * freeHoursPerDay;

  return {
    freeHoursPerDay,
    totalFreeHours,
    isOverAllocated,
    totalAllocatedHours: totalAllocated,
  };
}

/**
 * Subjective time perception based on the Weber-Fechner logarithmic model:
 * You perceive a duration relative to total remembered experience since memory origin `m`.
 *
 * 1. Perceived progress: P_used = ln(a / m) / ln(E / m)
 * 2. Feels-half age: a_half = sqrt(m * E)
 * 3. Time inflation: R_subj(b) = b * ln(E / a)
 */
export function calculateSubjectiveTime(
  age: number,
  expectedEndAge: number,
  memoryStartAge: number,
  baselineAge: number
): SubjectiveTimeMetrics {
  const safeAge = Math.max(0.1, age);
  const safeEndAge = Math.max(safeAge + 0.001, expectedEndAge);
  const safeM = Math.max(0.1, memoryStartAge);
  const safeB = Math.max(0.1, baselineAge);

  // Feels-half age: sqrt(m * E)
  const feelsHalfAge = Math.sqrt(safeM * safeEndAge);

  // Perceived progress:
  // If age < m, 0% used. If age >= E, 100% used.
  let perceivedProgress: number;
  if (safeAge <= safeM) {
    perceivedProgress = 0;
  } else if (safeEndAge <= safeM) {
    perceivedProgress = 1;
  } else {
    const lnNumerator = Math.log(safeAge / safeM);
    const lnDenominator = Math.log(safeEndAge / safeM);
    perceivedProgress = lnDenominator > 0 ? lnNumerator / lnDenominator : 1;
  }
  perceivedProgress = Math.min(1.0, Math.max(0.0, perceivedProgress));

  // Time inflation: R_subj(b) = b * ln(E / a)
  const subjectiveYearsRemaining = safeB * Math.log(safeEndAge / safeAge);

  return {
    perceivedProgress,
    feelsHalfAge,
    subjectiveYearsRemaining: Math.max(0, subjectiveYearsRemaining),
  };
}
