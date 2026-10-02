/**
 * Normal distribution mathematical functions and truncated normal calculations.
 * Implements standard PDF, CDF, quantile (Acklam's algorithm),
 * and truncated normal expectation and percentiles.
 */

const SQRT_2PI = Math.sqrt(2 * Math.PI);
const SQRT_2 = Math.SQRT2;

/**
 * Standard normal probability density function: phi(x)
 */
export function normalPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / SQRT_2PI;
}

/**
 * Normal PDF with mean mu and std dev sigma
 */
export function normalPdfWithParams(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const z = (x - mu) / sigma;
  return normalPdf(z) / sigma;
}

/**
 * Error function approximation using Abramowitz & Stegun 7.1.26
 * Maximum error is 1.5e-7 across all real inputs.
 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  // Abramowitz and Stegun formula 7.1.26 constants
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * absX);
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  const y = 1.0 - poly * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Standard normal cumulative distribution function: Phi(x)
 */
export function normalCdf(x: number): number {
  return 0.5 * (1.0 + erf(x / SQRT_2));
}

/**
 * Standard normal quantile / inverse CDF: Phi^-1(p)
 * Uses Peter J. Acklam's rational approximation (precision ~ 1.15e-9).
 */
export function normalInvCdf(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Coefficients for lower region
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.383577518672690e2,
    -3.066479806614716e1,
    2.506628277459239e0,
  ];

  // Coefficients for central region
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];

  // Coefficients for upper region
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838e0,
    -2.549732539343734e0,
    4.374664141464968e0,
    2.938163982698783e0,
  ];

  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;
  let r: number;

  if (p < pLow) {
    // Rational approximation for lower tail
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (
      (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }

  // Rational approximation for upper tail
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

/**
 * Inverse Mills ratio / hazard rate: phi(alpha) / (1 - Phi(alpha))
 * Handles numerical stability for large positive alpha using asymptotic expansion.
 */
export function inverseMillsRatio(alpha: number): number {
  if (alpha > 8.0) {
    // Asymptotic expansion: 1/x * (1 - 1/x^2 + 3/x^4 - ...)
    const a2 = alpha * alpha;
    return alpha + 1.0 / alpha - 1.0 / (alpha * a2);
  }
  const phi = normalPdf(alpha);
  const oneMinusPhi = 1.0 - normalCdf(alpha);
  if (oneMinusPhi <= 0) {
    return alpha;
  }
  return phi / oneMinusPhi;
}

export interface ConditionalLifespanResult {
  expectedEndAge: number;
  remainingCalendarYears: number;
  p10RemainingYears: number;
  p90RemainingYears: number;
  p10EndAge: number;
  p90EndAge: number;
}

/**
 * Compute expected end age and remaining time for a person alive at age `a`,
 * assuming lifespan follows Normal(mu, sigma^2) truncated below `a`.
 */
export function computeNormalLifespan(
  age: number,
  mu: number,
  sigma: number
): ConditionalLifespanResult {
  const safeSigma = Math.max(0.1, sigma);
  const alpha = (age - mu) / safeSigma;
  const lambda = inverseMillsRatio(alpha);

  const expectedEndAge = mu + safeSigma * lambda;
  const remainingCalendarYears = Math.max(0.01, expectedEndAge - age);

  // Percentiles for truncated normal:
  // F(t | T > a) = (Phi((t - mu)/sigma) - Phi(alpha)) / (1 - Phi(alpha)) = p
  // => Phi((t - mu)/sigma) = Phi(alpha) + p * (1 - Phi(alpha))
  const phiAlpha = normalCdf(alpha);
  const oneMinusPhiAlpha = Math.max(1e-15, 1.0 - phiAlpha);

  const u10 = phiAlpha + 0.1 * oneMinusPhiAlpha;
  const u90 = phiAlpha + 0.9 * oneMinusPhiAlpha;

  const z10 = normalInvCdf(Math.min(0.99999999, Math.max(1e-8, u10)));
  const z90 = normalInvCdf(Math.min(0.99999999, Math.max(1e-8, u90)));

  const p10EndAge = Math.max(age, mu + safeSigma * z10);
  const p90EndAge = Math.max(p10EndAge, mu + safeSigma * z90);

  const p10RemainingYears = Math.max(0.01, p10EndAge - age);
  const p90RemainingYears = Math.max(p10RemainingYears, p90EndAge - age);

  return {
    expectedEndAge,
    remainingCalendarYears,
    p10RemainingYears,
    p90RemainingYears,
    p10EndAge,
    p90EndAge,
  };
}
