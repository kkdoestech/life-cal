import { State } from '../../state/types';
import { t } from '../../i18n';

export function renderDisclaimer(container: HTMLElement, state: State): void {
  const { language } = state;

  container.innerHTML = `
    <div class="disclaimer-card">
      <h3>🏛️ ${t(language, 'disclaimer_title')}</h3>
      <p>${t(language, 'disclaimer_body')}</p>
    </div>
  `;
}
