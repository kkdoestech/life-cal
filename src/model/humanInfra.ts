/**
 * Human Infra: Subject Continuity & Human Operating Engine.
 * Models Healthspan (HALE), Peak Deep Focus, the Accelerated Returns Flywheel,
 * Calendar Horizon Bridge, AI Output Leverage, and Boundary Condition Diagnostics.
 * Inspired by tradecatlabs/human_infra.
 */

export interface HealthspanMetrics {
  haleEndAge: number;
  goldenWindowYears: number;
  fragilityYears: number;
  goldenPercentOfRemaining: number;
}

export interface DeepFocusMetrics {
  effectiveDailyFocusHours: number;
  totalFocusHours: number;
  masteryQuotas10k: number; // 10,000-hour mastery cycles
}

export interface FlywheelMetrics {
  threeYearEras: number;       // Major 3-year life/career chapters
  fiveYearArcs: number;        // 5-year transformation epochs
  failureRunway: number;       // Number of 2-year ambitious failures you can comfortably absorb
}

export interface BiotechMilestone {
  id: string;
  year: number;
  titleKey: string;
  descKey: string;
  reached: boolean;
}

export interface CalendarBridgeMetrics {
  targetCalendarYear: number;
  goldenCalendarYear: number;
  milestones: BiotechMilestone[];
}

export interface AiLeverageMetrics {
  leverageFactor: number;
  amplifiedAwakeYears: number;
  historicalCareerEquivalents: number;
}

export interface BoundaryBalanceMetrics {
  boundaryConditionHours: number; // Maintenance of the subject (sleep, recovery, health)
  boundaryWithinHours: number;    // Consumption/spending (work, commute, screen, leisure)
  continuityRatio: number;        // Percentage invested in boundary conditions
}

const DAYS_PER_YEAR = 365.25;

/**
 * Computes Healthy Life Expectancy (HALE) and the Golden Window.
 * Default healthy ratio is 0.88 (~88% of total lifespan in full functional health, per WHO).
 */
export function computeHealthspanMetrics(
  age: number,
  expectedEndAge: number,
  healthyRatio: number = 0.88
): HealthspanMetrics {
  const safeEndAge = Math.max(age + 0.1, expectedEndAge);
  const safeRatio = Math.max(0.7, Math.min(0.95, healthyRatio));
  const haleEndAge = safeEndAge * safeRatio;

  const goldenWindowYears = Math.max(0, haleEndAge - age);
  const totalRemaining = safeEndAge - age;
  const fragilityYears = Math.max(0, totalRemaining - goldenWindowYears);

  const goldenPercentOfRemaining =
    totalRemaining > 0 ? (goldenWindowYears / totalRemaining) * 100 : 0;

  return {
    haleEndAge,
    goldenWindowYears,
    fragilityYears,
    goldenPercentOfRemaining,
  };
}

/**
 * Computes deep cognitive focus hours and 10,000-hour mastery quotas.
 * Focus hours are naturally bounded by available unallocated free hours.
 */
export function computeDeepFocusMetrics(
  calendarYears: number,
  freeHoursPerDay: number,
  peakFocusHours: number
): DeepFocusMetrics {
  const effectiveDailyFocusHours = Math.min(freeHoursPerDay, Math.max(0, peakFocusHours));
  const totalFocusHours = calendarYears * DAYS_PER_YEAR * effectiveDailyFocusHours;
  const masteryQuotas10k = Math.floor(totalFocusHours / 10000);

  return {
    effectiveDailyFocusHours,
    totalFocusHours,
    masteryQuotas10k,
  };
}

/**
 * Computes the Accelerated Returns Flywheel & Failure Runway.
 * "More time lowers the cost of failing long-term goals."
 */
export function computeFlywheelMetrics(
  calendarYears: number,
  goldenWindowYears: number
): FlywheelMetrics {
  const threeYearEras = Math.floor(calendarYears / 3);
  const fiveYearArcs = Math.floor(calendarYears / 5);
  // How many 2-year ambitious project failures can you absorb during the golden window?
  const failureRunway = Math.max(0, Math.floor(goldenWindowYears / 2));

  return {
    threeYearEras,
    fiveYearArcs,
    failureRunway,
  };
}

/**
 * Computes the Calendar Bridge and reaches into the future biotechnology roadmap.
 */
export function computeCalendarBridge(
  calendarYears: number,
  goldenWindowYears: number,
  baseYear: number = 2026
): CalendarBridgeMetrics {
  const targetCalendarYear = baseYear + Math.floor(calendarYears);
  const goldenCalendarYear = baseYear + Math.floor(goldenWindowYears);

  const rawMilestones = [
    {
      id: 'senolytics',
      year: 2035,
      titleKey: 'milestone_2035_title',
      descKey: 'milestone_2035_desc',
    },
    {
      id: 'lev',
      year: 2040,
      titleKey: 'milestone_2040_title',
      descKey: 'milestone_2040_desc',
    },
    {
      id: 'organs',
      year: 2045,
      titleKey: 'milestone_2045_title',
      descKey: 'milestone_2045_desc',
    },
    {
      id: 'reprogramming',
      year: 2055,
      titleKey: 'milestone_2055_title',
      descKey: 'milestone_2055_desc',
    },
  ];

  const milestones: BiotechMilestone[] = rawMilestones.map((m) => ({
    ...m,
    reached: targetCalendarYear >= m.year,
  }));

  return {
    targetCalendarYear,
    goldenCalendarYear,
    milestones,
  };
}

/**
 * Computes AI and technological tool leverage multiplier on cognitive output.
 */
export function computeAiLeverageMetrics(
  awakeYears: number,
  totalFreeHours: number,
  leverageFactor: number
): AiLeverageMetrics {
  const factor = Math.max(1.0, Math.min(5.0, leverageFactor));
  const amplifiedAwakeYears = awakeYears * factor;
  // A standard full-time career working year is approximately 2,000 hours
  const historicalCareerEquivalents = (totalFreeHours * factor) / 2000;

  return {
    leverageFactor: factor,
    amplifiedAwakeYears,
    historicalCareerEquivalents,
  };
}

/**
 * Computes Boundary-Condition vs Boundary-Within investment balance.
 * Boundary-condition: sleep + regenerative physical maintenance (~2.5h/day).
 * Boundary-within: work + commute + screen + remaining hours.
 */
export function computeBoundaryBalance(
  sleepHours: number,
  freeHoursPerDay: number,
  workHours: number,
  commuteHours: number,
  screenHours: number
): BoundaryBalanceMetrics {
  const restorativeMaintenance = Math.min(freeHoursPerDay, 2.0);
  const boundaryConditionHours = sleepHours + restorativeMaintenance;
  const directWithin = workHours + commuteHours + screenHours;
  const remainingFree = Math.max(0, freeHoursPerDay - 2.0);
  const boundaryWithinHours = Math.max(0, directWithin + remainingFree);
  const continuityRatio = (boundaryConditionHours / 24) * 100;

  return {
    boundaryConditionHours,
    boundaryWithinHours,
    continuityRatio,
  };
}
