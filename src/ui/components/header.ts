import { State } from '../../state/types';
import { t } from '../../i18n';

export interface HeaderCallbacks {
  onLanguageChange: (lang: State['language']) => void;
  onModelChange: (model: State['modelType']) => void;
  onUiModeChange: (mode: State['uiMode']) => void;
  onOpenShareModal: () => void;
  onResetDefaults: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

export function renderHeader(
  container: HTMLElement,
  state: State,
  callbacks: HeaderCallbacks
): void {
  const { language, modelType, uiMode } = state;

  container.innerHTML = `
    <div class="header-top">
      <div class="header-title-group">
        <h1>${t(language, 'title')}</h1>
        <p>${t(language, 'subtitle')}</p>
      </div>

      <div class="header-actions">
        <!-- Language Switcher -->
        <div class="btn-group" role="group" aria-label="Language selection">
          <button id="lang-en" class="btn ${language === 'en' ? 'active' : ''}">EN</button>
          <button id="lang-vi" class="btn ${language === 'vi' ? 'active' : ''}">VI</button>
        </div>

        <!-- Mode Simple/Detailed -->
        <div class="btn-group" role="group" aria-label="UI Mode selection">
          <button id="mode-simple" class="btn ${uiMode === 'simple' ? 'active' : ''}">
            ${t(language, 'mode_simple')}
          </button>
          <button id="mode-detailed" class="btn ${uiMode === 'detailed' ? 'active' : ''}">
            ${t(language, 'mode_detailed')}
          </button>
        </div>

        <!-- Action Buttons -->
        <button id="btn-share" class="btn btn-primary">
          <span>🔗</span> ${t(language, 'btn_share')}
        </button>
        <button id="btn-export-json" class="btn" title="Export state as JSON">
          <span>💾</span> ${t(language, 'btn_export_json')}
        </button>
        <button id="btn-import-json" class="btn" title="Import state from JSON">
          <span>📂</span> ${t(language, 'btn_import_json')}
        </button>
        <button id="btn-reset" class="btn" title="Reset all to defaults">
          <span>↺</span> ${t(language, 'btn_reset')}
        </button>
        <input type="file" id="json-file-input" accept=".json,application/json" style="display: none;" />
      </div>
    </div>

    <!-- Lifespan Model Selector Pills -->
    <div class="model-bar">
      <button id="model-normal" class="model-pill ${modelType === 'normal' ? 'active' : ''}">
        ${t(language, 'model_normal')}
      </button>
      <button id="model-gompertz" class="model-pill ${modelType === 'gompertz' ? 'active' : ''}">
        ${t(language, 'model_gompertz')}
      </button>
      <button id="model-lev" class="model-pill ${modelType === 'lev' ? 'active' : ''}">
        🚀 ${t(language, 'model_lev')}
      </button>
    </div>
  `;

  // Attach event listeners
  container.querySelector('#lang-en')?.addEventListener('click', () => callbacks.onLanguageChange('en'));
  container.querySelector('#lang-vi')?.addEventListener('click', () => callbacks.onLanguageChange('vi'));
  container.querySelector('#mode-simple')?.addEventListener('click', () => callbacks.onUiModeChange('simple'));
  container.querySelector('#mode-detailed')?.addEventListener('click', () => callbacks.onUiModeChange('detailed'));

  container.querySelector('#model-normal')?.addEventListener('click', () => callbacks.onModelChange('normal'));
  container.querySelector('#model-gompertz')?.addEventListener('click', () => callbacks.onModelChange('gompertz'));
  container.querySelector('#model-lev')?.addEventListener('click', () => callbacks.onModelChange('lev'));

  container.querySelector('#btn-share')?.addEventListener('click', callbacks.onOpenShareModal);
  container.querySelector('#btn-reset')?.addEventListener('click', callbacks.onResetDefaults);
  container.querySelector('#btn-export-json')?.addEventListener('click', callbacks.onExportJson);

  const fileInput = container.querySelector('#json-file-input') as HTMLInputElement;
  container.querySelector('#btn-import-json')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', callbacks.onImportJson);
}
