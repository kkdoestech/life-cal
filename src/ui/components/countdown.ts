import { State } from '../../state/types';
import { t } from '../../i18n';

export interface CountdownCallbacks {
  onToggleHide: (hide: boolean) => void;
}

export class LiveCountdown {
  private container: HTMLElement;
  private callbacks: CountdownCallbacks;
  private intervalId: number | null = null;
  private remainingSeconds: number = 0;
  private lastUpdateTimestamp: number = Date.now();
  private currentState: State | null = null;

  constructor(container: HTMLElement, callbacks: CountdownCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.startTimer();
  }

  private startTimer(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }
    this.intervalId = window.setInterval(() => {
      const now = Date.now();
      const elapsedSec = (now - this.lastUpdateTimestamp) / 1000;
      this.lastUpdateTimestamp = now;

      if (this.remainingSeconds > 0) {
        this.remainingSeconds = Math.max(0, this.remainingSeconds - elapsedSec);
        this.updateDigitsOnly();
      }
    }, 1000);
  }

  public destroy(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public render(
    state: State,
    remainingCalendarYears: number
  ): void {
    this.currentState = state;
    // Set base remaining seconds: R_cal * 365.25 * 86400
    this.remainingSeconds = remainingCalendarYears * 365.25 * 86400;
    this.lastUpdateTimestamp = Date.now();

    const { language, hideCountdown, modelType } = state;

    if (modelType === 'lev') {
      this.container.innerHTML = '';
      return;
    }

    if (hideCountdown) {
      this.container.innerHTML = `
        <div style="text-align: right; margin-bottom: 1rem;">
          <button id="btn-toggle-countdown" class="btn" style="font-size: 0.8rem;">
            ⏱️ ${t(language, 'btn_show_countdown')}
          </button>
        </div>
      `;
      this.container
        .querySelector('#btn-toggle-countdown')
        ?.addEventListener('click', () => this.callbacks.onToggleHide(false));
      return;
    }

    const { years, days, hours, minutes, seconds } = this.breakdownSeconds(this.remainingSeconds);

    this.container.innerHTML = `
      <div class="countdown-box">
        <div class="countdown-header">
          <div>
            <span class="card-label" style="color: var(--accent-gold);">⏳ ${t(language, 'section_countdown')}</span>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${t(language, 'section_countdown_hint')}</p>
          </div>
          <button id="btn-toggle-countdown" class="btn" style="font-size: 0.8rem;">
            ${t(language, 'btn_hide_countdown')}
          </button>
        </div>

        <div class="countdown-digits">
          <div class="countdown-segment">
            <span id="cd-years" class="countdown-num">${years}</span>
            <span class="countdown-unit">${t(language, 'countdown_years')}</span>
          </div>
          <div class="countdown-segment">
            <span id="cd-days" class="countdown-num">${days}</span>
            <span class="countdown-unit">${t(language, 'countdown_days')}</span>
          </div>
          <div class="countdown-segment">
            <span id="cd-hours" class="countdown-num">${hours.toString().padStart(2, '0')}</span>
            <span class="countdown-unit">${t(language, 'countdown_hours')}</span>
          </div>
          <div class="countdown-segment">
            <span id="cd-minutes" class="countdown-num">${minutes.toString().padStart(2, '0')}</span>
            <span class="countdown-unit">${t(language, 'countdown_minutes')}</span>
          </div>
          <div class="countdown-segment">
            <span id="cd-seconds" class="countdown-num">${seconds.toString().padStart(2, '0')}</span>
            <span class="countdown-unit">${t(language, 'countdown_seconds')}</span>
          </div>
        </div>
      </div>
    `;

    this.container
      .querySelector('#btn-toggle-countdown')
      ?.addEventListener('click', () => this.callbacks.onToggleHide(true));
  }

  private breakdownSeconds(totalSec: number) {
    const secPerYear = 365.25 * 86400;
    const years = Math.floor(totalSec / secPerYear);
    const remAfterYears = totalSec % secPerYear;

    const days = Math.floor(remAfterYears / 86400);
    const remAfterDays = remAfterYears % 86400;

    const hours = Math.floor(remAfterDays / 3600);
    const remAfterHours = remAfterDays % 3600;

    const minutes = Math.floor(remAfterHours / 60);
    const seconds = Math.floor(remAfterHours % 60);

    return { years, days, hours, minutes, seconds };
  }

  private updateDigitsOnly(): void {
    if (!this.currentState || this.currentState.hideCountdown || this.currentState.modelType === 'lev') {
      return;
    }
    const { years, days, hours, minutes, seconds } = this.breakdownSeconds(this.remainingSeconds);

    const elYears = this.container.querySelector('#cd-years');
    const elDays = this.container.querySelector('#cd-days');
    const elHours = this.container.querySelector('#cd-hours');
    const elMin = this.container.querySelector('#cd-minutes');
    const elSec = this.container.querySelector('#cd-seconds');

    if (elYears) elYears.textContent = years.toString();
    if (elDays) elDays.textContent = days.toString();
    if (elHours) elHours.textContent = hours.toString().padStart(2, '0');
    if (elMin) elMin.textContent = minutes.toString().padStart(2, '0');
    if (elSec) elSec.textContent = seconds.toString().padStart(2, '0');
  }
}
