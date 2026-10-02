import { State, ScenarioPreset, SCENARIO_PRESETS } from '../../state/types';
import { t } from '../../i18n';

export interface InputsCallbacks {
  onStateUpdate: (updates: Partial<State>) => void;
}

export function renderInputs(
  container: HTMLElement,
  state: State,
  callbacks: InputsCallbacks
): void {
  const {
    language,
    age,
    modelType,
    scenarioPreset,
    normalParams,
    gompertzParams,
    overlayScenarios,
    sleepHours,
    workHours,
    commuteHours,
    screenHours,
    mealsPerDay,
    booksPerYear,
    memoryStartAge,
    baselineAge,
    uiMode,
    peakFocusHours,
    aiLeverageFactor,
  } = state;

  const totalAllocated = sleepHours + workHours + commuteHours + screenHours;
  const isOverAllocated = totalAllocated > 24;

  const isDetailed = uiMode === 'detailed';

  container.innerHTML = `
    <div class="inputs-layout">
      <!-- Lifespan Script Group -->
      <div class="inputs-group">
        <h3 class="inputs-group-title">${t(language, 'section_script')}</h3>

        <!-- Age -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-age">${t(language, 'label_current_age')}</label>
            <span class="input-val-display">${age} ${t(language, 'years_suffix')}</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-age" class="input-range" min="0" max="115" step="1" value="${age}" />
            <input type="number" id="num-age" class="input-number" min="0" max="115" step="1" value="${age}" />
          </div>
        </div>

        ${
          modelType === 'normal'
            ? `
          <!-- Scenario Presets -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="select-preset">${t(language, 'label_scenario_preset')}</label>
            </div>
            <select id="select-preset" class="input-number" style="width: 100%; text-align: left; padding: 0.4rem;">
              <option value="status_quo" ${scenarioPreset === 'status_quo' ? 'selected' : ''}>${t(language, 'preset_status_quo')}</option>
              <option value="worst" ${scenarioPreset === 'worst' ? 'selected' : ''}>${t(language, 'preset_worst')}</option>
              <option value="best" ${scenarioPreset === 'best' ? 'selected' : ''}>${t(language, 'preset_best')}</option>
              <option value="custom" ${scenarioPreset === 'custom' ? 'selected' : ''}>${t(language, 'preset_custom')}</option>
            </select>
          </div>

          <!-- Mu and Sigma -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="input-mu">${t(language, 'label_mean_lifespan')}</label>
              <span>${normalParams.mu}</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-mu" class="input-range" min="40" max="115" step="1" value="${normalParams.mu}" />
              <input type="number" id="num-mu" class="input-number" min="40" max="115" step="1" value="${normalParams.mu}" />
            </div>
          </div>

          <div class="input-row">
            <div class="input-label-row">
              <label for="input-sigma">${t(language, 'label_std_dev')}</label>
              <span>${normalParams.sigma}</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-sigma" class="input-range" min="1" max="25" step="0.5" value="${normalParams.sigma}" />
              <input type="number" id="num-sigma" class="input-number" min="1" max="25" step="0.5" value="${normalParams.sigma}" />
            </div>
          </div>

          <!-- Overlays -->
          <div class="input-row">
            <div class="input-label-row">
              <label>${t(language, 'label_overlays')}</label>
            </div>
            <div class="input-checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" id="chk-overlay-worst" ${overlayScenarios.worst ? 'checked' : ''} />
                ${t(language, 'overlay_worst')}
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="chk-overlay-status" ${overlayScenarios.status_quo ? 'checked' : ''} />
                ${t(language, 'overlay_status_quo')}
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="chk-overlay-best" ${overlayScenarios.best ? 'checked' : ''} />
                ${t(language, 'overlay_best')}
              </label>
            </div>
          </div>
        `
            : modelType === 'gompertz'
            ? `
          <!-- Gompertz Parameters -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="input-gm">${t(language, 'label_gompertz_modal')}</label>
              <span>${gompertzParams.M}</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-gm" class="input-range" min="50" max="110" step="1" value="${gompertzParams.M}" />
              <input type="number" id="num-gm" class="input-number" min="50" max="110" step="1" value="${gompertzParams.M}" />
            </div>
          </div>

          <div class="input-row">
            <div class="input-label-row">
              <label for="input-gbeta">${t(language, 'label_gompertz_beta')}</label>
              <span>${gompertzParams.beta}</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-gbeta" class="input-range" min="3" max="20" step="0.5" value="${gompertzParams.beta}" />
              <input type="number" id="num-gbeta" class="input-number" min="3" max="20" step="0.5" value="${gompertzParams.beta}" />
            </div>
          </div>
        `
            : `
          <!-- LEV info notice in place of normal params -->
          <div class="input-row">
            <p style="font-size: 0.85rem; color: var(--accent-purple);">
              ${t(language, 'lev_desc')}
            </p>
          </div>
        `
        }
      </div>

      <!-- Daily Rhythm & Allocation -->
      <div class="inputs-group">
        <h3 class="inputs-group-title">Daily Hours & Rhythm</h3>

        <!-- Sleep -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-sleep">${t(language, 'label_sleep_hours')}</label>
            <span>${sleepHours} h</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-sleep" class="input-range" min="0" max="16" step="0.5" value="${sleepHours}" />
            <input type="number" id="num-sleep" class="input-number" min="0" max="16" step="0.5" value="${sleepHours}" />
          </div>
        </div>

        <!-- Work -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-work">${t(language, 'label_work_hours')}</label>
            <span>${workHours} h</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-work" class="input-range" min="0" max="16" step="0.5" value="${workHours}" />
            <input type="number" id="num-work" class="input-number" min="0" max="16" step="0.5" value="${workHours}" />
          </div>
        </div>

        <!-- Commute -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-commute">${t(language, 'label_commute_hours')}</label>
            <span>${commuteHours} h</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-commute" class="input-range" min="0" max="8" step="0.5" value="${commuteHours}" />
            <input type="number" id="num-commute" class="input-number" min="0" max="8" step="0.5" value="${commuteHours}" />
          </div>
        </div>

        <!-- Screen Time -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-screen">${t(language, 'label_screen_hours')}</label>
            <span>${screenHours} h</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-screen" class="input-range" min="0" max="16" step="0.5" value="${screenHours}" />
            <input type="number" id="num-screen" class="input-number" min="0" max="16" step="0.5" value="${screenHours}" />
          </div>
        </div>

        ${
          isOverAllocated
            ? `<div class="warning-box">⚠️ ${t(language, 'warning_overallocated')}</div>`
            : ''
        }
      </div>

      <!-- Lifestyle & Subjective Model -->
      <div class="inputs-group">
        <h3 class="inputs-group-title">Lifestyle & Time Perception</h3>

        <!-- Meals per day -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-meals">${t(language, 'label_meals_per_day')}</label>
            <span>${mealsPerDay}</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-meals" class="input-range" min="1" max="6" step="1" value="${mealsPerDay}" />
            <input type="number" id="num-meals" class="input-number" min="1" max="6" step="1" value="${mealsPerDay}" />
          </div>
        </div>

        <!-- Books per year -->
        <div class="input-row">
          <div class="input-label-row">
            <label for="input-books">${t(language, 'label_books_per_year')}</label>
            <span>${booksPerYear}</span>
          </div>
          <div class="input-controls-row">
            <input type="range" id="input-books" class="input-range" min="0" max="60" step="1" value="${booksPerYear}" />
            <input type="number" id="num-books" class="input-number" min="0" max="60" step="1" value="${booksPerYear}" />
          </div>
        </div>

        ${
          isDetailed
            ? `
          <!-- Memory Start Age -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="input-mstart">${t(language, 'label_memory_start')}</label>
              <span>${memoryStartAge}</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-mstart" class="input-range" min="1" max="10" step="1" value="${memoryStartAge}" />
              <input type="number" id="num-mstart" class="input-number" min="1" max="10" step="1" value="${memoryStartAge}" />
            </div>
          </div>

          <!-- Baseline Age -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="input-base">${t(language, 'label_baseline_age')}</label>
              <span>${baselineAge}</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-base" class="input-range" min="1" max="100" step="1" value="${baselineAge}" />
              <input type="number" id="num-base" class="input-number" min="1" max="100" step="1" value="${baselineAge}" />
            </div>
          </div>

          <!-- Peak Creative Focus -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="input-focus">${t(language, 'label_daily_focus')}</label>
              <span>${peakFocusHours} h</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-focus" class="input-range" min="1" max="8" step="0.5" value="${peakFocusHours}" />
              <input type="number" id="num-focus" class="input-number" min="1" max="8" step="0.5" value="${peakFocusHours}" />
            </div>
          </div>

          <!-- AI & Tool Leverage Factor -->
          <div class="input-row">
            <div class="input-label-row">
              <label for="input-ai">${t(language, 'label_ai_factor')}</label>
              <span>${aiLeverageFactor.toFixed(1)}×</span>
            </div>
            <div class="input-controls-row">
              <input type="range" id="input-ai" class="input-range" min="1.0" max="4.0" step="0.25" value="${aiLeverageFactor}" />
              <input type="number" id="num-ai" class="input-number" min="1.0" max="4.0" step="0.25" value="${aiLeverageFactor}" />
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;

  // Helper to bind paired slider and number input
  const bindPair = (
    sliderId: string,
    numId: string,
    onValue: (val: number) => void
  ) => {
    const slider = container.querySelector(`#${sliderId}`) as HTMLInputElement;
    const num = container.querySelector(`#${numId}`) as HTMLInputElement;
    if (!slider || !num) return;

    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      num.value = slider.value;
      onValue(val);
    });

    num.addEventListener('input', () => {
      const val = parseFloat(num.value);
      if (!Number.isNaN(val)) {
        slider.value = num.value;
        onValue(val);
      }
    });
  };

  bindPair('input-age', 'num-age', (age) => callbacks.onStateUpdate({ age }));
  bindPair('input-sleep', 'num-sleep', (sleepHours) => callbacks.onStateUpdate({ sleepHours }));
  bindPair('input-work', 'num-work', (workHours) => callbacks.onStateUpdate({ workHours }));
  bindPair('input-commute', 'num-commute', (commuteHours) => callbacks.onStateUpdate({ commuteHours }));
  bindPair('input-screen', 'num-screen', (screenHours) => callbacks.onStateUpdate({ screenHours }));
  bindPair('input-meals', 'num-meals', (mealsPerDay) => callbacks.onStateUpdate({ mealsPerDay }));
  bindPair('input-books', 'num-books', (booksPerYear) => callbacks.onStateUpdate({ booksPerYear }));
  bindPair('input-mstart', 'num-mstart', (memoryStartAge) => callbacks.onStateUpdate({ memoryStartAge }));
  bindPair('input-base', 'num-base', (baselineAge) => callbacks.onStateUpdate({ baselineAge }));
  bindPair('input-focus', 'num-focus', (peakFocusHours) => callbacks.onStateUpdate({ peakFocusHours }));
  bindPair('input-ai', 'num-ai', (aiLeverageFactor) => callbacks.onStateUpdate({ aiLeverageFactor }));

  if (modelType === 'normal') {
    const presetSelect = container.querySelector('#select-preset') as HTMLSelectElement;
    presetSelect?.addEventListener('change', () => {
      const sp = presetSelect.value as ScenarioPreset;
      if (sp !== 'custom') {
        callbacks.onStateUpdate({
          scenarioPreset: sp,
          normalParams: { ...SCENARIO_PRESETS[sp] },
        });
      } else {
        callbacks.onStateUpdate({ scenarioPreset: 'custom' });
      }
    });

    bindPair('input-mu', 'num-mu', (mu) =>
      callbacks.onStateUpdate({
        scenarioPreset: 'custom',
        normalParams: { mu, sigma: state.normalParams.sigma },
      })
    );

    bindPair('input-sigma', 'num-sigma', (sigma) =>
      callbacks.onStateUpdate({
        scenarioPreset: 'custom',
        normalParams: { mu: state.normalParams.mu, sigma },
      })
    );

    const chkWorst = container.querySelector('#chk-overlay-worst') as HTMLInputElement;
    const chkStatus = container.querySelector('#chk-overlay-status') as HTMLInputElement;
    const chkBest = container.querySelector('#chk-overlay-best') as HTMLInputElement;

    const updateOverlays = () => {
      callbacks.onStateUpdate({
        overlayScenarios: {
          worst: chkWorst.checked,
          status_quo: chkStatus.checked,
          best: chkBest.checked,
        },
      });
    };

    chkWorst?.addEventListener('change', updateOverlays);
    chkStatus?.addEventListener('change', updateOverlays);
    chkBest?.addEventListener('change', updateOverlays);
  } else if (modelType === 'gompertz') {
    bindPair('input-gm', 'num-gm', (M) =>
      callbacks.onStateUpdate({
        gompertzParams: { M, beta: state.gompertzParams.beta },
      })
    );
    bindPair('input-gbeta', 'num-gbeta', (beta) =>
      callbacks.onStateUpdate({
        gompertzParams: { M: state.gompertzParams.M, beta },
      })
    );
  }
}
