/**
 * Gompertz mortality model (actuarial demographic formulation).
 * Hazard rate: h(t) = (1 / beta) * exp((t - M) / beta)
 * where M is the modal age at death and beta is the dispersion/scale parameter.
 */

export interface GompertzLifespanResult {
  expectedEndAge: number;
  remainingCalendarYears: number;
  p10RemainingYears: number;
  p90RemainingYears: number;
  p10EndAge: number;
  p90EndAge: number;
}

/**
 * Gompertz probability density function: f(t) = h(t) * S(t)
 */
export function gompertzPdf(t: number, M: number, beta: number): number {
  if (beta <= 0) return 0;
  const z = (t - M) / beta;
  const H = Math.exp(z);
  return (1 / beta) * H * Math.exp(-H);
}

/**
 * Gompertz cumulative hazard function: H(t) = exp((t - M) / beta)
 */
export function gompertzCumulativeHazard(t: number, M: number, beta: number): number {
  return Math.exp((t - M) / beta);
}

/**
 * Conditional survival given alive at age a: S(t | T > a) = exp(-(H(t) - H(a)))
 */
export function gompertzConditionalSurvival(
  t: number,
  age: number,
  M: number,
  beta: number
): number {
  if (t < age) return 1;
  const Ha = gompertzCumulativeHazard(age, M, beta);
  const Ht = gompertzCumulativeHazard(t, M, beta);
  return Math.exp(-(Ht - Ha));
}

/**
 * Compute conditional expected remaining life and end age using numerical integration
 * (Simpson's composite rule on S(t | T > a)).
 */
export function computeGompertzLifespan(
  age: number,
  M: number = 82,
  beta: number = 9.5
): GompertzLifespanResult {
  const safeBeta = Math.max(0.5, beta);
  const Ha = gompertzCumulativeHazard(age, M, safeBeta);

  // Closed form conditional percentiles:
  // H(t_p) - H(a) = -ln(1 - p)
  // exp((t_p - M)/beta) = Ha - ln(1 - p)
  // t_p = M + beta * ln(Ha - ln(1 - p))
  const p10EndAge = M + safeBeta * Math.log(Ha - Math.log(1 - 0.1));
  const p90EndAge = M + safeBeta * Math.log(Ha - Math.log(1 - 0.9));

  const p10RemainingYears = Math.max(0.01, p10EndAge - age);
  const p90RemainingYears = Math.max(p10RemainingYears, p90EndAge - age);

  // Numerical integration for conditional expected remaining years:
  // E[T - a | T > a] = \int_a^{a_max} S(t | T > a) dt
  const upperLimit = Math.max(age + 45, 125);
  const steps = 200;
  const h = (upperLimit - age) / steps;

  let integral = 0;
  for (let i = 0; i <= steps; i++) {
    const t = age + i * h;
    const St = Math.exp(-(gompertzCumulativeHazard(t, M, safeBeta) - Ha));
    const weight = i === 0 || i === steps ? 1 : i % 2 === 1 ? 4 : 2;
    integral += weight * St;
  }
  const remainingCalendarYears = Math.max(0.01, (h / 3) * integral);
  const expectedEndAge = age + remainingCalendarYears;

  return {
    expectedEndAge,
    remainingCalendarYears,
    p10RemainingYears,
    p90RemainingYears,
    p10EndAge,
    p90EndAge,
  };
}
