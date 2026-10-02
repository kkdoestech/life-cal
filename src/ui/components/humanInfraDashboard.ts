import { State } from '../../state/types';
import {
  HealthspanMetrics,
  DeepFocusMetrics,
  FlywheelMetrics,
  CalendarBridgeMetrics,
  AiLeverageMetrics,
  BoundaryBalanceMetrics,
} from '../../model/humanInfra';
import { t } from '../../i18n';

export interface HumanInfraCallbacks {
  onUpdateState: (updates: Partial<State>) => void;
}

export function renderHumanInfraDashboard(
  container: HTMLElement,
  state: State,
  healthspan: HealthspanMetrics,
  focus: DeepFocusMetrics,
  flywheel: FlywheelMetrics,
  bridge: CalendarBridgeMetrics,
  ai: AiLeverageMetrics,
  boundary: BoundaryBalanceMetrics,
  callbacks: HumanInfraCallbacks
): void {
  const { language, age, peakFocusHours, aiLeverageFactor } = state;

  // Dual-band bar calculations (0 to 120 scale)
  const livedPct = (Math.min(age, 120) / 120) * 100;
  const goldenPct = (Math.min(healthspan.goldenWindowYears, 120 - age) / 120) * 100;
  const fragilityPct =
    (Math.min(healthspan.fragilityYears, 120 - (age + healthspan.goldenWindowYears)) / 120) * 100;

  // Milestones HTML
  const milestonesHtml = bridge.milestones
    .map((m) => {
      const isReached = m.reached;
      return `
        <div class="milestone-item ${isReached ? 'reached' : 'unreached'}">
          <div class="milestone-badge ${isReached ? 'badge-reached' : 'badge-unreached'}">
            ${isReached ? '✓ ' + t(language, 'milestone_reached') : '⏳ ' + t(language, 'milestone_beyond')}
          </div>
          <div class="milestone-title">${t(language, m.titleKey as any)}</div>
          <div class="milestone-desc">${t(language, m.descKey as any)}</div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="section-header">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.5rem;">🧬</span>
        <h2>${t(language, 'section_human_infra_title')}</h2>
      </div>
      <p>${t(language, 'section_human_infra_desc')}</p>
    </div>

    <!-- 1. Healthspan & Golden Window Dual-Band Bar -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <div class="card-label" style="color: var(--accent-green);">${t(language, 'card_healthspan_title')}</div>
          <div class="card-val-big" style="color: var(--accent-green);">
            ${healthspan.goldenWindowYears.toFixed(1)} <span class="card-val-unit">${t(language, 'years_suffix')}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">
            ${t(language, 'hale_age_format', { age: healthspan.haleEndAge.toFixed(0) })}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            ${t(language, 'fragility_era_format', { years: healthspan.fragilityYears.toFixed(1) })}
          </div>
        </div>
      </div>

      <!-- Visual Dual-Band Spectrum Bar -->
      <div class="healthspan-bar-container" title="Lived vs Golden Window vs Fragility Horizon">
        <div class="bar-segment bar-lived" style="left: 0; width: ${livedPct}%;" title="Lived: Age 0-${age}"></div>
        <div class="bar-segment bar-golden" style="left: ${livedPct}%; width: ${goldenPct}%;" title="Golden Window: Age ${age}-${healthspan.haleEndAge.toFixed(0)}"></div>
        <div class="bar-segment bar-fragility" style="left: ${livedPct + goldenPct}%; width: ${fragilityPct}%;" title="Fragility Era: Age ${healthspan.haleEndAge.toFixed(0)}+"></div>
      </div>

      <div class="healthspan-legend">
        <span class="legend-item"><span class="legend-dot dot-lived"></span> Lived (0–${age})</span>
        <span class="legend-item"><span class="legend-dot dot-golden"></span> ${t(language, 'label_golden_window')} (${healthspan.goldenWindowYears.toFixed(1)} yrs)</span>
        <span class="legend-item"><span class="legend-dot dot-fragility"></span> ${t(language, 'label_fragility_era')} (~${healthspan.fragilityYears.toFixed(1)} yrs)</span>
      </div>

      <div class="card-footer">
        ${t(language, 'card_healthspan_desc')}
      </div>
    </div>

    <!-- 2x2 Grid for Flywheel, Deep Focus, Calendar Bridge & AI Leverage -->
    <div class="cards-grid">
      <!-- 2. Accelerated Returns Flywheel & Failure Runway -->
      <div class="card">
        <div>
          <div class="card-label" style="color: var(--accent-gold);">⚡ ${t(language, 'card_flywheel_title')}</div>
          
          <div style="margin: 0.75rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-size: 0.85rem; color: var(--text-secondary);">${t(language, 'flywheel_3yr_eras')}</span>
              <span style="font-size: 1.6rem; font-weight: 700; color: var(--accent-gold); font-family: monospace;">
                ${flywheel.threeYearEras}
              </span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              ${t(language, 'flywheel_3yr_desc', { count: flywheel.threeYearEras })}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem;">
              <span style="font-size: 0.85rem; color: var(--text-secondary);">${t(language, 'flywheel_failure_runway')}</span>
              <span style="font-size: 1.6rem; font-weight: 700; color: var(--accent-blue); font-family: monospace;">
                ${flywheel.failureRunway}
              </span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              ${t(language, 'flywheel_failure_desc', { count: flywheel.failureRunway })}
            </p>
          </div>
        </div>
        <div class="card-footer">
          ${t(language, 'card_flywheel_desc')}
        </div>
      </div>

      <!-- 3. Peak Deep Focus Engine -->
      <div class="card">
        <div>
          <div class="card-label" style="color: var(--accent-blue);">🎯 ${t(language, 'card_focus_title')}</div>
          
          <div class="card-value-group">
            <span class="card-val-big" style="color: var(--accent-blue);">${Math.round(focus.totalFocusHours).toLocaleString()}</span>
            <span class="card-val-unit">${t(language, 'hours_suffix')}</span>
          </div>
          
          <div style="margin: 0.75rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.85rem; color: var(--text-secondary);">${t(language, 'label_daily_focus')}:</span>
              <span style="font-weight: 600; color: var(--text-primary);">${peakFocusHours} h/day</span>
            </div>
            <input type="range" id="input-peak-focus" class="input-range" style="width: 100%;" min="1" max="8" step="0.5" value="${peakFocusHours}" />
            
            <div style="margin-top: 0.75rem; padding: 0.6rem; background: var(--bg-card-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-gold);">
                🏆 ${focus.masteryQuotas10k} ${t(language, 'label_mastery_quotas')}
              </span>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                ${t(language, 'mastery_quotas_desc', { count: focus.masteryQuotas10k })}
              </p>
            </div>
          </div>
        </div>
        <div class="card-footer">
          ${t(language, 'card_focus_desc', { hours: focus.effectiveDailyFocusHours.toFixed(1) })}
        </div>
      </div>

      <!-- 4. The Calendar Bridge to Year 20XX -->
      <div class="card">
        <div>
          <div class="card-label" style="color: var(--accent-purple);">🌉 ${t(language, 'card_calendar_bridge_title')}</div>
          
          <div class="card-value-group">
            <span class="card-val-big" style="color: var(--accent-purple); font-family: monospace;">
              ${bridge.targetCalendarYear}
            </span>
            <span class="card-val-unit">A.D.</span>
          </div>
          <div class="card-val-sub">
            ${t(language, 'bridge_target_year_format', { year: bridge.targetCalendarYear })}
          </div>

          <div class="milestones-container">
            ${milestonesHtml}
          </div>
        </div>
        <div class="card-footer">
          ${t(language, 'bridge_golden_year_format', { year: bridge.goldenCalendarYear })}
        </div>
      </div>

      <!-- 5. AI Leverage & Tool Multiplier -->
      <div class="card">
        <div>
          <div class="card-label" style="color: var(--accent-gold);">🤖 ${t(language, 'card_ai_leverage_title')}</div>
          
          <div style="margin: 0.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.85rem; color: var(--text-secondary);">${t(language, 'label_ai_factor')}:</span>
              <span style="font-weight: 700; color: var(--accent-gold); font-size: 1.1rem;">${aiLeverageFactor.toFixed(1)}×</span>
            </div>
            <input type="range" id="input-ai-leverage" class="input-range" style="width: 100%;" min="1.0" max="4.0" step="0.25" value="${aiLeverageFactor}" />

            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="padding: 0.5rem; background: var(--bg-card-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); font-family: monospace;">
                  ${ai.amplifiedAwakeYears.toFixed(0)} <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-secondary);">amplified years</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  ${t(language, 'ai_amplified_years', { years: ai.amplifiedAwakeYears.toFixed(0) })}
                </div>
              </div>

              <div style="padding: 0.5rem; background: var(--bg-card-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-gold); font-family: monospace;">
                  ~${ai.historicalCareerEquivalents.toFixed(1)} <span style="font-size: 0.85rem; font-weight: 400; color: var(--text-secondary);">careers</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  ${t(language, 'ai_career_equivalents', { careers: ai.historicalCareerEquivalents.toFixed(1) })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          ${t(language, 'card_ai_leverage_desc')}
        </div>
      </div>
    </div>

    <!-- 6. Boundary-Condition vs. Boundary-Within Diagnostic -->
    <div class="card" style="margin-top: 1.5rem;">
      <div class="card-label">⚖️ ${t(language, 'card_boundary_diagnostic_title')}</div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
        ${t(language, 'card_boundary_diagnostic_desc')}
      </p>

      <div class="boundary-meter-container">
        <div class="boundary-meter-condition" style="width: ${boundary.continuityRatio}%;" title="Boundary-Condition: ${boundary.boundaryConditionHours.toFixed(1)}h/day"></div>
        <div class="boundary-meter-within" style="width: ${100 - boundary.continuityRatio}%;" title="Boundary-Within: ${boundary.boundaryWithinHours.toFixed(1)}h/day"></div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
        <span>🛡️ ${t(language, 'label_boundary_condition')}: <strong>${boundary.boundaryConditionHours.toFixed(1)} h/day</strong> (${boundary.continuityRatio.toFixed(0)}%)</span>
        <span>⚙️ ${t(language, 'label_boundary_within')}: <strong>${boundary.boundaryWithinHours.toFixed(1)} h/day</strong> (${(100 - boundary.continuityRatio).toFixed(0)}%)</span>
      </div>

      <div class="card-footer" style="color: ${boundary.continuityRatio >= 38 ? 'var(--accent-green)' : 'var(--accent-amber)'};">
        💡 ${boundary.continuityRatio >= 38 ? t(language, 'boundary_insight_good') : t(language, 'boundary_insight_low')}
      </div>
    </div>
  `;

  // Attach sliders event listeners
  const inputFocus = container.querySelector('#input-peak-focus') as HTMLInputElement;
  inputFocus?.addEventListener('input', () => {
    callbacks.onUpdateState({ peakFocusHours: parseFloat(inputFocus.value) });
  });

  const inputAi = container.querySelector('#input-ai-leverage') as HTMLInputElement;
  inputAi?.addEventListener('input', () => {
    callbacks.onUpdateState({ aiLeverageFactor: parseFloat(inputAi.value) });
  });
}
