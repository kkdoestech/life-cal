import { State, SCENARIO_PRESETS } from '../../state/types';
import { computeNormalLifespan } from '../../model/normal';
import { calculateAwakeYears, calculateFreeHours } from '../../model/time';
import { t } from '../../i18n';

export function renderComparison(
  container: HTMLElement,
  state: State
): void {
  const { language, age, sleepHours, workHours, commuteHours, screenHours } = state;

  const scenarios: Array<{
    id: 'worst' | 'status_quo' | 'best';
    nameKey: string;
    mu: number;
    sigma: number;
    color: string;
  }> = [
    {
      id: 'worst',
      nameKey: 'preset_worst',
      mu: SCENARIO_PRESETS.worst.mu,
      sigma: SCENARIO_PRESETS.worst.sigma,
      color: '#f85149',
    },
    {
      id: 'status_quo',
      nameKey: 'preset_status_quo',
      mu: SCENARIO_PRESETS.status_quo.mu,
      sigma: SCENARIO_PRESETS.status_quo.sigma,
      color: '#58a6ff',
    },
    {
      id: 'best',
      nameKey: 'preset_best',
      mu: SCENARIO_PRESETS.best.mu,
      sigma: SCENARIO_PRESETS.best.sigma,
      color: '#3fb950',
    },
  ];

  const breakdown = { sleepHours, workHours, commuteHours, screenHours };

  const cardsHtml = scenarios
    .map((sc) => {
      const res = computeNormalLifespan(age, sc.mu, sc.sigma);
      const awakeYrs = calculateAwakeYears(res.remainingCalendarYears, sleepHours);
      const free = calculateFreeHours(res.remainingCalendarYears, breakdown);

      const isSelected =
        state.scenarioPreset === sc.id ||
        (state.normalParams.mu === sc.mu && state.normalParams.sigma === sc.sigma);

      // Shared axis calculation (0 to 120 scale)
      const livedPercent = (Math.min(age, 120) / 120) * 100;
      const remainingPercent =
        (Math.min(res.remainingCalendarYears, 120 - Math.min(age, 120)) / 120) * 100;

      return `
        <div class="comparison-card ${isSelected ? 'current' : ''}">
          <div class="comparison-title" style="color: ${sc.color};">
            <span>${t(language, sc.nameKey as any)}</span>
            <span>μ${sc.mu} σ${sc.sigma}</span>
          </div>

          <div class="comparison-metrics">
            <div class="comparison-metric-row">
              <span>Expected End:</span>
              <span>${res.expectedEndAge.toFixed(1)} yrs</span>
            </div>
            <div class="comparison-metric-row">
              <span>Remaining Calendar:</span>
              <span>+${res.remainingCalendarYears.toFixed(1)} yrs</span>
            </div>
            <div class="comparison-metric-row">
              <span>Effective Awake:</span>
              <span>${awakeYrs.toFixed(1)} yrs</span>
            </div>
            <div class="comparison-metric-row">
              <span>Free Time Left:</span>
              <span>${Math.round(free.totalFreeHours).toLocaleString()} hrs</span>
            </div>
          </div>

          <!-- Shared Age Axis Bar (0 to 120) -->
          <div class="shared-axis-bar-container" title="Age 0 to 120 scale">
            <div class="shared-axis-bar-alive" style="left: 0; width: ${livedPercent}%;"></div>
            <div class="shared-axis-bar-remaining" style="left: ${livedPercent}%; width: ${remainingPercent}%; background: ${sc.color};"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
            <span>0</span>
            <span>Age ${age}</span>
            <span>${res.expectedEndAge.toFixed(0)}</span>
            <span>120</span>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header">
      <h2>${t(language, 'section_comparison')}</h2>
      <p>${t(language, 'section_comparison_desc')}</p>
    </div>
    <div class="comparison-grid">
      ${cardsHtml}
    </div>
  `;
}
