import { State, SCENARIO_PRESETS } from '../state/types';
import { normalPdfWithParams } from '../model/normal';
import { gompertzPdf } from '../model/gompertz';
import { t } from '../i18n';

export interface ChartCallbacks {
  onUpdateExpectedEnd: (newMu: number) => void;
}

const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 300;
const MARGIN = { top: 30, right: 35, bottom: 45, left: 45 };
const PLOT_WIDTH = VIEW_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = VIEW_HEIGHT - MARGIN.top - MARGIN.bottom;
const MIN_AGE = 0;
const MAX_AGE = 120;

function ageToX(age: number): number {
  const clamped = Math.max(MIN_AGE, Math.min(MAX_AGE, age));
  return MARGIN.left + ((clamped - MIN_AGE) / (MAX_AGE - MIN_AGE)) * PLOT_WIDTH;
}

function xToAge(x: number): number {
  const clampedX = Math.max(MARGIN.left, Math.min(MARGIN.left + PLOT_WIDTH, x));
  return MIN_AGE + ((clampedX - MARGIN.left) / PLOT_WIDTH) * (MAX_AGE - MIN_AGE);
}

function densityToY(density: number, maxDensity: number): number {
  const norm = Math.max(0, Math.min(1, density / (maxDensity || 0.05)));
  return MARGIN.top + (1 - norm) * PLOT_HEIGHT;
}

export class LifespanChart {
  private container: HTMLElement;
  private callbacks: ChartCallbacks;
  private isDragging = false;
  private currentExpectedEnd: number = 79;

  constructor(container: HTMLElement, callbacks: ChartCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.initEvents();
  }

  private initEvents(): void {
    const handlePointerDown = (e: PointerEvent) => {
      const handle = (e.target as Element).closest('#chart-drag-handle');
      if (!handle) return;
      this.isDragging = true;
      (e.target as Element).setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      const svg = this.container.querySelector('svg');
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const scaleX = VIEW_WIDTH / rect.width;
      const svgX = (e.clientX - rect.left) * scaleX;
      const targetAge = Math.round(xToAge(svgX));

      // Calculate corresponding mu that gives this targetAge as expected end
      this.callbacks.onUpdateExpectedEnd(targetAge);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (this.isDragging) {
        this.isDragging = false;
        try {
          (e.target as Element).releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    this.container.addEventListener('pointerdown', handlePointerDown);
    this.container.addEventListener('pointermove', handlePointerMove);
    this.container.addEventListener('pointerup', handlePointerUp);
    this.container.addEventListener('pointercancel', handlePointerUp);

    // Keyboard support for accessibility
    this.container.addEventListener('keydown', (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.id === 'chart-drag-handle' &&
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
      ) {
        e.preventDefault();
        const delta = e.key === 'ArrowLeft' ? -1 : 1;
        const newAge = Math.max(30, Math.min(115, Math.round(this.currentExpectedEnd + delta)));
        this.callbacks.onUpdateExpectedEnd(newAge);
      }
    });
  }

  public render(
    state: State,
    expectedEndAge: number,
    p10EndAge: number,
    p90EndAge: number
  ): void {
    this.currentExpectedEnd = expectedEndAge;

    const { age, modelType, normalParams, gompertzParams, overlayScenarios, language } = state;

    // Density function for current scenario
    const currentPdf = (tAge: number) => {
      if (modelType === 'gompertz') {
        return gompertzPdf(tAge, gompertzParams.M, gompertzParams.beta);
      }
      return normalPdfWithParams(tAge, normalParams.mu, normalParams.sigma);
    };

    // Calculate maximum density for scale
    let maxDensity = 0.04;
    for (let a = 0; a <= 120; a += 1) {
      maxDensity = Math.max(maxDensity, currentPdf(a));
    }
    // Also include overlays in maxDensity
    if (overlayScenarios.worst) {
      for (let a = 0; a <= 120; a += 2) {
        maxDensity = Math.max(
          maxDensity,
          normalPdfWithParams(a, SCENARIO_PRESETS.worst.mu, SCENARIO_PRESETS.worst.sigma)
        );
      }
    }
    if (overlayScenarios.best) {
      for (let a = 0; a <= 120; a += 2) {
        maxDensity = Math.max(
          maxDensity,
          normalPdfWithParams(a, SCENARIO_PRESETS.best.mu, SCENARIO_PRESETS.best.sigma)
        );
      }
    }
    maxDensity *= 1.15; // 15% head room

    // Generate Path for current curve
    const points: [number, number][] = [];
    const remainingPoints: [number, number][] = [];
    const step = 0.5;

    for (let a = MIN_AGE; a <= MAX_AGE; a += step) {
      const px = ageToX(a);
      const py = densityToY(currentPdf(a), maxDensity);
      points.push([px, py]);

      if (a >= age) {
        remainingPoints.push([px, py]);
      }
    }

    const currentPathD = points.reduce(
      (acc, [x, y], i) => `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`,
      ''
    );

    // Area under remaining curve (from age to 120)
    let remainingAreaD = '';
    if (remainingPoints.length > 0) {
      const startX = ageToX(age);
      const bottomY = MARGIN.top + PLOT_HEIGHT;
      const firstY = densityToY(currentPdf(age), maxDensity);

      remainingAreaD = `M ${startX.toFixed(1)} ${bottomY.toFixed(1)} L ${startX.toFixed(1)} ${firstY.toFixed(1)}`;
      for (const [rx, ry] of remainingPoints) {
        remainingAreaD += ` L ${rx.toFixed(1)} ${ry.toFixed(1)}`;
      }
      const lastX = remainingPoints[remainingPoints.length - 1][0];
      remainingAreaD += ` L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} Z`;
    }

    // Generate Overlays
    const renderOverlay = (mu: number, sigma: number, color: string, strokeDash: string) => {
      let d = '';
      for (let a = MIN_AGE; a <= MAX_AGE; a += step) {
        const px = ageToX(a);
        const py = densityToY(normalPdfWithParams(a, mu, sigma), maxDensity);
        d += `${a === MIN_AGE ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
      }
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-dasharray="${strokeDash}" opacity="0.65" />`;
    };

    let overlaysSvg = '';
    if (overlayScenarios.worst) {
      overlaysSvg += renderOverlay(SCENARIO_PRESETS.worst.mu, SCENARIO_PRESETS.worst.sigma, '#f85149', '4,4');
    }
    if (overlayScenarios.status_quo && state.scenarioPreset !== 'status_quo') {
      overlaysSvg += renderOverlay(SCENARIO_PRESETS.status_quo.mu, SCENARIO_PRESETS.status_quo.sigma, '#58a6ff', '4,4');
    }
    if (overlayScenarios.best) {
      overlaysSvg += renderOverlay(SCENARIO_PRESETS.best.mu, SCENARIO_PRESETS.best.sigma, '#3fb950', '4,4');
    }

    // Key points
    const youNowX = ageToX(age);
    const expectedEndX = ageToX(expectedEndAge);
    const p10X = ageToX(p10EndAge);
    const p90X = ageToX(p90EndAge);
    const bottomY = MARGIN.top + PLOT_HEIGHT;

    // X-Axis ticks every 10 years
    let ticksSvg = '';
    for (let tickAge = 0; tickAge <= 120; tickAge += 10) {
      const tx = ageToX(tickAge);
      ticksSvg += `
        <line x1="${tx}" y1="${bottomY}" x2="${tx}" y2="${bottomY + 6}" stroke="#30363d" stroke-width="1" />
        <text x="${tx}" y="${bottomY + 20}" font-size="11" fill="#8b949e" text-anchor="middle" font-family="monospace">${tickAge}</text>
      `;
    }

    this.container.innerHTML = `
      <div class="chart-svg-container">
        <svg class="lifespan-chart" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="remainingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e5b869" stop-opacity="0.38" />
              <stop offset="100%" stop-color="#e5b869" stop-opacity="0.04" />
            </linearGradient>
            <linearGradient id="pRangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#58a6ff" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#58a6ff" stop-opacity="0.02" />
            </linearGradient>
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Grid horizontal line -->
          <line x1="${MARGIN.left}" y1="${bottomY}" x2="${MARGIN.left + PLOT_WIDTH}" y2="${bottomY}" stroke="#30363d" stroke-width="1" />

          <!-- 10th to 90th percentile shaded band -->
          <rect x="${p10X}" y="${MARGIN.top}" width="${Math.max(1, p90X - p10X)}" height="${PLOT_HEIGHT}" fill="url(#pRangeGradient)" />
          <line x1="${p10X}" y1="${MARGIN.top + 10}" x2="${p10X}" y2="${bottomY}" stroke="#58a6ff" stroke-width="1.2" stroke-dasharray="2,3" opacity="0.6" />
          <line x1="${p90X}" y1="${MARGIN.top + 10}" x2="${p90X}" y2="${bottomY}" stroke="#58a6ff" stroke-width="1.2" stroke-dasharray="2,3" opacity="0.6" />
          <text x="${p10X}" y="${MARGIN.top + 8}" font-size="10" fill="#58a6ff" text-anchor="middle">p10 (${p10EndAge.toFixed(0)})</text>
          <text x="${p90X}" y="${MARGIN.top + 8}" font-size="10" fill="#58a6ff" text-anchor="middle">p90 (${p90EndAge.toFixed(0)})</text>

          <!-- Remaining Area Fill -->
          <path d="${remainingAreaD}" fill="url(#remainingGradient)" />

          <!-- Overlays -->
          ${overlaysSvg}

          <!-- Main Density Curve -->
          <path d="${currentPathD}" fill="none" stroke="#e5b869" stroke-width="2.6" />

          <!-- You Now Indicator -->
          <line x1="${youNowX}" y1="${MARGIN.top - 10}" x2="${youNowX}" y2="${bottomY}" stroke="#58a6ff" stroke-width="2" />
          <circle cx="${youNowX}" cy="${MARGIN.top - 10}" r="4" fill="#58a6ff" />
          <text x="${youNowX}" y="${MARGIN.top - 16}" font-size="11" font-weight="600" fill="#58a6ff" text-anchor="middle">
            ${t(language, 'chart_you_now', { age })}
          </text>

          <!-- Expected End Drag Handle -->
          <line x1="${expectedEndX}" y1="${MARGIN.top}" x2="${expectedEndX}" y2="${bottomY}" stroke="#e5b869" stroke-width="2.2" stroke-dasharray="4,2" />
          
          <g id="chart-drag-handle" 
             tabindex="0" 
             role="slider" 
             aria-label="Expected lifespan end" 
             aria-valuemin="30" 
             aria-valuemax="115" 
             aria-valuenow="${expectedEndAge.toFixed(0)}"
             style="cursor: ew-resize; outline: none;">
            <circle cx="${expectedEndX}" cy="${bottomY - 12}" r="11" fill="#e5b869" filter="url(#goldGlow)" />
            <circle cx="${expectedEndX}" cy="${bottomY - 12}" r="4" fill="#0d1117" />
          </g>

          <text x="${expectedEndX}" y="${MARGIN.top - 16}" font-size="11" font-weight="700" fill="#e5b869" text-anchor="middle">
            ${t(language, 'chart_expected_end', { age: expectedEndAge.toFixed(1) })}
          </text>

          <!-- Ticks & Axis -->
          ${ticksSvg}
        </svg>
      </div>
      <div class="chart-controls-hint">
        ${t(language, 'section_chart_hint')}
      </div>
    `;
  }
}
