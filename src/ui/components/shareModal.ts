import { State } from '../../state/types';
import { ConditionalLifespanResult } from '../../model/normal';
import { RemainingTimeMetrics, SubjectiveTimeMetrics } from '../../model/time';
import { calculateEquivalents } from '../../model/equivalents';
import { encodeStateToHash } from '../../state/url';
import { t } from '../../i18n';

export interface ShareModalCallbacks {
  onClose: () => void;
}

export class ShareModal {
  private container: HTMLElement;
  private callbacks: ShareModalCallbacks;

  constructor(container: HTMLElement, callbacks: ShareModalCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public render(
    state: State,
    lifespan: ConditionalLifespanResult,
    timeMetrics: RemainingTimeMetrics,
    subjective: SubjectiveTimeMetrics
  ): void {
    const { language } = state;
    const shareUrl =
      window.location.origin + window.location.pathname + encodeStateToHash(state);

    this.container.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>🔗 ${t(language, 'share_modal_title')}</h3>
            <button id="btn-close-modal" class="modal-close">&times;</button>
          </div>

          <div>
            <label style="font-size: 0.85rem; color: var(--text-secondary); display: block; margin-bottom: 0.4rem;">
              ${t(language, 'share_link_label')}
            </label>
            <div class="share-url-box">
              <input type="text" id="share-url-input" class="share-url-input" readonly value="${shareUrl}" />
              <button id="btn-copy-url" class="btn btn-primary">
                ${t(language, 'btn_copy_link')}
              </button>
            </div>
            <div id="copy-status" style="font-size: 0.8rem; color: var(--accent-green); margin-top: 0.4rem; display: none;">
              ✓ ${t(language, 'copied_success')}
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
              <h4 style="font-size: 1rem; color: var(--text-primary);">${t(language, 'share_image_title')}</h4>
              <button id="btn-download-image" class="btn btn-primary">
                🖼️ ${t(language, 'btn_download_png')}
              </button>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              ${t(language, 'share_image_desc')}
            </p>
            <div class="canvas-preview-container">
              <canvas id="share-canvas" width="1200" height="630"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Close
    this.container
      .querySelector('#btn-close-modal')
      ?.addEventListener('click', this.callbacks.onClose);
    this.container.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.callbacks.onClose();
      }
    });

    // Bind Copy URL
    const btnCopy = this.container.querySelector('#btn-copy-url');
    const inputUrl = this.container.querySelector('#share-url-input') as HTMLInputElement;
    const copyStatus = this.container.querySelector('#copy-status') as HTMLElement;

    btnCopy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(inputUrl.value);
        copyStatus.style.display = 'block';
        setTimeout(() => {
          copyStatus.style.display = 'none';
        }, 2500);
      } catch {
        inputUrl.select();
        document.execCommand('copy');
        copyStatus.style.display = 'block';
        setTimeout(() => {
          copyStatus.style.display = 'none';
        }, 2500);
      }
    });

    // Render 1200x630 Canvas Image
    const canvas = this.container.querySelector('#share-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.drawShareCard(canvas, state, lifespan, timeMetrics, subjective);
    }

    // Bind Download PNG
    const btnDownload = this.container.querySelector('#btn-download-image');
    btnDownload?.addEventListener('click', () => {
      if (!canvas) return;
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lifespan-purchasing-power-age-${state.age}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
  }

  private drawShareCard(
    canvas: HTMLCanvasElement,
    state: State,
    lifespan: ConditionalLifespanResult,
    timeMetrics: RemainingTimeMetrics,
    subjective: SubjectiveTimeMetrics
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1200;
    const H = 630;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0a0d13');
    grad.addColorStop(0.5, '#121721');
    grad.addColorStop(1, '#0e1219');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Decorative subtle border
    ctx.strokeStyle = '#283548';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Header branding
    ctx.fillStyle = '#e5b869';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('LIFESPAN PURCHASING POWER', 60, 95);

    ctx.fillStyle = '#8b949e';
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(
      `Current Age: ${state.age}  |  Expected End Age: ${lifespan.expectedEndAge.toFixed(1)}  |  Awake Days/Yr: ${timeMetrics.awakeDaysPerYear.toFixed(1)}`,
      60,
      135
    );

    // Top Headline Metric Cards
    const cardBg = '#18202c';
    const borderSubtle = '#303d52';

    const drawCard = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      mainVal: string,
      unit: string,
      sub: string
    ) => {
      ctx.fillStyle = cardBg;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = borderSubtle;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = '#8b949e';
      ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(label.toUpperCase(), x + 20, y + 35);

      ctx.fillStyle = '#e5b869';
      ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      ctx.fillText(mainVal, x + 20, y + 90);

      const valW = ctx.measureText(mainVal).width;
      ctx.fillStyle = '#8b949e';
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(unit, x + 20 + valW + 10, y + 90);

      ctx.fillStyle = '#6e7681';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(sub, x + 20, y + 125);
    };

    // 3 Main Metric Cards across the top
    const cardW = 340;
    const cardH = 150;
    const cardY = 170;

    drawCard(
      60,
      cardY,
      cardW,
      cardH,
      'Effective Awake Life',
      timeMetrics.awakeYears.toFixed(1),
      'years',
      `Sleep: ${state.sleepHours}h/day deducted`
    );

    drawCard(
      430,
      cardY,
      cardW,
      cardH,
      'Total Free Time Left',
      Math.round(timeMetrics.totalFreeHours).toLocaleString(),
      'hours',
      `${timeMetrics.freeHoursPerDay.toFixed(1)} free hours remaining per day`
    );

    drawCard(
      800,
      cardY,
      cardW,
      cardH,
      '80% Probability Interval',
      `${lifespan.p10RemainingYears.toFixed(0)}–${lifespan.p90RemainingYears.toFixed(0)}`,
      'years',
      `Reaching age ${lifespan.p10EndAge.toFixed(0)} to ${lifespan.p90EndAge.toFixed(0)}`
    );

    // Subjective Weber-Fechner Strip
    ctx.fillStyle = '#141b24';
    ctx.fillRect(60, 345, 1080, 75);
    ctx.strokeStyle = '#2d3a4e';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 345, 1080, 75);

    ctx.fillStyle = '#58a6ff';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SUBJECTIVE TIME (WEBER-FECHNER):', 85, 385);

    ctx.fillStyle = '#f0f6fc';
    ctx.font = '17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(
      `Perceived Life Spent: ${(subjective.perceivedProgress * 100).toFixed(1)}%  |  Feels Half Over At Age: ${subjective.feelsHalfAge.toFixed(1)}  |  Time Inflation: ${lifespan.remainingCalendarYears.toFixed(1)} yrs feel like ${subjective.subjectiveYearsRemaining.toFixed(1)} yrs of age ${state.baselineAge}`,
      440,
      385
    );

    // Equivalents Preview Strip
    const equivs = calculateEquivalents(lifespan.remainingCalendarYears, {
      mealsPerDay: state.mealsPerDay,
      booksPerYear: state.booksPerYear,
    });

    const fullMoons = equivs.find((e) => e.id === 'full_moons')?.count || 0;
    const books = equivs.find((e) => e.id === 'books')?.count || 0;
    const weekends = equivs.find((e) => e.id === 'weekends')?.count || 0;
    const lunarNewYears = equivs.find((e) => e.id === 'lunar_new_years')?.count || 0;

    const drawPill = (x: number, y: number, icon: string, val: string, label: string) => {
      ctx.fillStyle = '#192230';
      ctx.fillRect(x, y, 250, 60);
      ctx.strokeStyle = '#2f3e55';
      ctx.strokeRect(x, y, 250, 60);

      ctx.font = '26px sans-serif';
      ctx.fillText(icon, x + 15, y + 42);

      ctx.fillStyle = '#e5b869';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(val, x + 60, y + 32);

      ctx.fillStyle = '#8b949e';
      ctx.font = '13px sans-serif';
      ctx.fillText(label, x + 60, y + 50);
    };

    drawPill(60, 440, '🌕', Math.round(fullMoons).toLocaleString(), 'Full Moons Left');
    drawPill(335, 440, '📚', Math.round(books).toLocaleString(), 'Books to Read');
    drawPill(610, 440, '🏖️', Math.round(weekends).toLocaleString(), 'Golden Weekends');
    drawPill(885, 440, '🧧', Math.round(lunarNewYears).toLocaleString(), 'Lunar New Years');

    // Bottom Quote
    ctx.fillStyle = '#6e7681';
    ctx.font = 'italic 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(
      '“Remaining life is the one asset you are guaranteed to spend and can never earn more of.”',
      60,
      565
    );

    ctx.fillStyle = '#8b949e';
    ctx.font = '14px monospace';
    ctx.fillText('lifespan.clone · 100% private client-side evaluation', 810, 565);
  }
}
