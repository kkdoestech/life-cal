/**
 * Longevity Escape Velocity (LEV) Model.
 * Represents an unbounded biological lifespan where aging is decoupled from time,
 * bounded only by the cosmological Stellar Era (the lifespan of the longest-lived red dwarfs,
 * approx 10^14 years minus current cosmic age 1.38 x 10^10 years).
 */

export const COSMOLOGICAL_STELLAR_ERA_YEARS = 1e14;
export const UNIVERSE_CURRENT_AGE_YEARS = 1.38e10;
export const LEV_COSMOLOGICAL_BOUND_YEARS =
  COSMOLOGICAL_STELLAR_ERA_YEARS - UNIVERSE_CURRENT_AGE_YEARS;

export interface LevMetrics {
  isLev: boolean;
  orderOfMagnitudeText: string;
  scientificNotation: string;
  descriptionKey: string;
}

export function getLevMetrics(): LevMetrics {
  return {
    isLev: true,
    orderOfMagnitudeText: '~100,000,000,000,000 (~10¹⁴)',
    scientificNotation: '9.9986 × 10¹³',
    descriptionKey: 'lev_cosmic_horizon_desc',
  };
}
