import { State } from '../../state/types';
import { calculateEquivalents, EquivalentResult } from '../../model/equivalents';
import { t } from '../../i18n';

export class EquivalentsExchange {
  private container: HTMLElement;
  private activeCategory: 'all' | 'seconds' | 'days' | 'years' = 'all';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(
    state: State,
    remainingCalendarYears: number
  ): void {
    const { language, mealsPerDay, booksPerYear } = state;

    const items: EquivalentResult[] = calculateEquivalents(remainingCalendarYears, {
      mealsPerDay,
      booksPerYear,
    });

    const filtered = items.filter((item) => {
      if (this.activeCategory === 'all') return true;
      if (this.activeCategory === 'seconds') {
        return item.category === 'seconds' || item.category === 'hours';
      }
      if (this.activeCategory === 'days') {
        return item.category === 'days' || item.category === 'weeks' || item.category === 'seasons';
      }
      if (this.activeCategory === 'years') {
        return item.category === 'years';
      }
      return true;
    });

    const formatCount = (count: number): string => {
      if (count >= 1e9) {
        return (count / 1e9).toFixed(2) + ' B';
      }
      if (count >= 1e6) {
        return (count / 1e6).toFixed(1) + ' M';
      }
      if (count >= 1e4) {
        return Math.round(count).toLocaleString();
      }
      if (count >= 100) {
        return Math.round(count).toLocaleString();
      }
      return count.toFixed(1);
    };

    const cardsHtml = filtered
      .map((item) => {
        const unitName = t(language, item.unitKey as any);
        const rateLabel = t(language, item.rateLabelKey as any, {
          meals: mealsPerDay,
          books: booksPerYear,
        });

        return `
          <div class="equiv-card">
            <div class="equiv-top">
              <span class="equiv-icon">${item.icon}</span>
              <span class="equiv-category">${item.category}</span>
            </div>
            <div>
              <div class="equiv-count">${formatCount(item.count)}</div>
              <div class="equiv-unit">${unitName}</div>
            </div>
            <div class="equiv-rate">${rateLabel}</div>
          </div>
        `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="section-header">
        <h2>${t(language, 'section_equivalents')}</h2>
        <p>${t(language, 'section_equivalents_desc')}</p>
      </div>

      <div class="equivalents-filter-bar">
        <button class="filter-tab ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
          ${t(language, 'filter_all')}
        </button>
        <button class="filter-tab ${this.activeCategory === 'seconds' ? 'active' : ''}" data-cat="seconds">
          ${t(language, 'filter_seconds')}
        </button>
        <button class="filter-tab ${this.activeCategory === 'days' ? 'active' : ''}" data-cat="days">
          ${t(language, 'filter_days')}
        </button>
        <button class="filter-tab ${this.activeCategory === 'years' ? 'active' : ''}" data-cat="years">
          ${t(language, 'filter_years')}
        </button>
      </div>

      <div class="equivalents-grid">
        ${cardsHtml}
      </div>
    `;

    // Bind tab clicks
    const tabs = this.container.querySelectorAll('.filter-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') as any;
        if (cat) {
          this.activeCategory = cat;
          this.render(state, remainingCalendarYears);
        }
      });
    });
  }
}
