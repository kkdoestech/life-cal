import { State } from '../../state/types';
import { ConditionalLifespanResult } from '../../model/normal';
import {
  RemainingTimeMetrics,
  SubjectiveTimeMetrics,
} from '../../model/time';
import { t } from '../../i18n';

export function renderCards(
  container: HTMLElement,
  state: State,
  lifespan: ConditionalLifespanResult,
  timeMetrics: RemainingTimeMetrics,
  subjective: SubjectiveTimeMetrics
): void {
  const { language, modelType, baselineAge } = state;

  const isLev = modelType === 'lev';

  const levHtml = isLev
    ? `
    <div class="lev-banner">
      <span class="lev-badge">${t(language, 'lev_badge')}</span>
      <h3>${t(language, 'lev_title')}</h3>
      <p>${t(language, 'lev_desc')}</p>
      <div class="lev-horizon-box">
        <span class="card-label">${t(language, 'lev_bound_label')}:</span>
        <span class="lev-horizon-num">${t(language, 'lev_bound_val')}</span>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
        ${t(language, 'lev_cosmic_horizon_desc')}
      </p>
    </div>
  `
    : '';

  const percentProgress = (subjective.perceivedProgress * 100).toFixed(1);

  container.innerHTML = `
    ${levHtml}

    <div class="cards-grid">
      <!-- 1. Effective Awake Life -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_effective_awake')}</div>
          <div class="card-value-group">
            <span class="card-val-big">${timeMetrics.awakeYears.toFixed(1)}</span>
            <span class="card-val-unit">${t(language, 'years_suffix')}</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'card_effective_awake_desc', {
              days: timeMetrics.awakeDaysPerYear.toFixed(1),
            })}
          </div>
        </div>
        <div class="card-footer">
          ${((timeMetrics.awakeYears / Math.max(0.1, lifespan.remainingCalendarYears)) * 100).toFixed(0)}% of calendar time spent awake
        </div>
      </div>

      <!-- 2. Expected Calendar Life -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_calendar_years')}</div>
          <div class="card-value-group">
            <span class="card-val-big">${lifespan.remainingCalendarYears.toFixed(1)}</span>
            <span class="card-val-unit">${t(language, 'years_suffix')}</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'end_age_format', {
              age: lifespan.expectedEndAge.toFixed(1),
            })}
          </div>
        </div>
        <div class="card-footer">
          ${t(language, 'card_calendar_years_desc')}
        </div>
      </div>

      <!-- 3. Unallocated Free Time -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_free_time')}</div>
          <div class="card-value-group">
            <span class="card-val-big">${Math.round(timeMetrics.totalFreeHours).toLocaleString()}</span>
            <span class="card-val-unit">${t(language, 'hours_suffix')}</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'card_free_time_desc', {
              hours: timeMetrics.freeHoursPerDay.toFixed(1),
            })}
          </div>
        </div>
        <div class="card-footer">
          ${(timeMetrics.freeHoursPerDay * 365.25).toFixed(0)} free hours/year
        </div>
      </div>

      <!-- 4. 10th - 90th Percentile Range -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_percentile_range')}</div>
          <div class="card-value-group">
            <span class="card-val-big" style="font-size: 1.5rem; color: var(--accent-blue);">
              ${lifespan.p10RemainingYears.toFixed(1)} – ${lifespan.p90RemainingYears.toFixed(1)}
            </span>
            <span class="card-val-unit">${t(language, 'years_suffix')}</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'card_percentile_desc')}
          </div>
        </div>
        <div class="card-footer">
          Reaching ages ${lifespan.p10EndAge.toFixed(0)} to ${lifespan.p90EndAge.toFixed(0)}
        </div>
      </div>

      <!-- 5. Perceived Progress (Weber-Fechner) -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_subjective_progress')}</div>
          <div class="card-value-group">
            <span class="card-val-big">${percentProgress}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${percentProgress}%;"></div>
          </div>
          <div class="card-val-sub">
            ${t(language, 'card_subjective_progress_desc')}
          </div>
        </div>
        <div class="card-footer">
          ${(100 - parseFloat(percentProgress)).toFixed(1)}% subjective experience left
        </div>
      </div>

      <!-- 6. Feels-half age -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_feels_half')}</div>
          <div class="card-value-group">
            <span class="card-val-big">${subjective.feelsHalfAge.toFixed(1)}</span>
            <span class="card-val-unit">${t(language, 'years_suffix')}</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'card_feels_half_desc', {
              age: subjective.feelsHalfAge.toFixed(1),
            })}
          </div>
        </div>
        <div class="card-footer">
          ${t(language, 'subjective_disclaimer')}
        </div>
      </div>

      <!-- 7. Time Inflation -->
      <div class="card">
        <div>
          <div class="card-label">${t(language, 'card_time_inflation')}</div>
          <div class="card-value-group">
            <span class="card-val-big">${subjective.subjectiveYearsRemaining.toFixed(1)}</span>
            <span class="card-val-unit">feel-years</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'card_time_inflation_desc', {
              remaining: lifespan.remainingCalendarYears.toFixed(1),
              subj: subjective.subjectiveYearsRemaining.toFixed(1),
              b: baselineAge,
            })}
          </div>
        </div>
        <div class="card-footer">
          Relative to baseline age ${baselineAge}
        </div>
      </div>
    </div>
  `;
}
