import './ui/styles.css';
import { State, DEFAULT_STATE } from './state/types';
import { validateState } from './state/validate';
import { decodeStateFromUrl, encodeStateToHash } from './state/url';
import { exportStateToJson, importStateFromJson, downloadJsonFile } from './state/storage';
import { computeNormalLifespan, ConditionalLifespanResult } from './model/normal';
import { computeGompertzLifespan } from './model/gompertz';
import {
  calculateAwakeDaysPerYear,
  calculateAwakeYears,
  calculateFreeHours,
  calculateSubjectiveTime,
  RemainingTimeMetrics,
  SubjectiveTimeMetrics,
} from './model/time';
import { LifespanChart } from './ui/chart';
import { renderHeader } from './ui/components/header';
import { renderInputs } from './ui/components/inputs';
import { renderCards } from './ui/components/cards';
import { renderComparison } from './ui/components/comparison';
import { EquivalentsExchange } from './ui/components/equivalents';
import { LiveCountdown } from './ui/components/countdown';
import { ShareModal } from './ui/components/shareModal';
import { renderDisclaimer } from './ui/components/disclaimer';

class LifespanApp {
  private state: State;
  private isShareModalOpen = false;

  // UI DOM elements
  private elHeader: HTMLElement;
  private elCountdown: HTMLElement;
  private elChart: HTMLElement;
  private elCards: HTMLElement;
  private elComparison: HTMLElement;
  private elEquivalents: HTMLElement;
  private elInputs: HTMLElement;
  private elDisclaimer: HTMLElement;
  private elModalContainer: HTMLElement;

  // Component instances
  private chartComponent: LifespanChart;
  private equivalentsComponent: EquivalentsExchange;
  private countdownComponent: LiveCountdown;
  private shareModalComponent: ShareModal;

  constructor() {
    // 1. Initialize State from URL hash or default
    const hash = window.location.hash;
    this.state = hash ? decodeStateFromUrl(hash) : { ...DEFAULT_STATE };

    // 2. Query DOM Elements
    this.elHeader = document.getElementById('app-header')!;
    this.elCountdown = document.getElementById('app-countdown')!;
    this.elChart = document.getElementById('app-chart')!;
    this.elCards = document.getElementById('app-cards')!;
    this.elComparison = document.getElementById('app-comparison')!;
    this.elEquivalents = document.getElementById('app-equivalents')!;
    this.elInputs = document.getElementById('app-inputs')!;
    this.elDisclaimer = document.getElementById('app-disclaimer')!;
    this.elModalContainer = document.getElementById('app-modal')!;

    // 3. Instantiate persistent components
    this.chartComponent = new LifespanChart(this.elChart, {
      onUpdateExpectedEnd: (newTargetAge: number) => {
        // Direct adjustment from dragging the curve handle
        if (this.state.modelType === 'normal') {
          // Adjust mu
          this.updateState({
            scenarioPreset: 'custom',
            normalParams: {
              mu: newTargetAge,
              sigma: this.state.normalParams.sigma,
            },
          });
        } else if (this.state.modelType === 'gompertz') {
          this.updateState({
            gompertzParams: {
              M: newTargetAge,
              beta: this.state.gompertzParams.beta,
            },
          });
        }
      },
    });

    this.equivalentsComponent = new EquivalentsExchange(this.elEquivalents);

    this.countdownComponent = new LiveCountdown(this.elCountdown, {
      onToggleHide: (hide: boolean) => {
        this.updateState({ hideCountdown: hide });
      },
    });

    this.shareModalComponent = new ShareModal(this.elModalContainer, {
      onClose: () => {
        this.isShareModalOpen = false;
        this.elModalContainer.innerHTML = '';
      },
    });

    // 4. Listen for popstate / hashchange
    window.addEventListener('hashchange', () => {
      this.state = decodeStateFromUrl(window.location.hash);
      this.renderAll();
    });

    // Initial render
    this.renderAll();
  }

  public updateState(partial: Partial<State>): void {
    this.state = validateState({ ...this.state, ...partial });

    // Sync to URL hash quietly without scrolling or adding history steps
    const newHash = encodeStateToHash(this.state);
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }

    this.renderAll();
  }

  private evaluateModels(): {
    lifespan: ConditionalLifespanResult;
    timeMetrics: RemainingTimeMetrics;
    subjective: SubjectiveTimeMetrics;
  } {
    const { age, modelType, normalParams, gompertzParams, sleepHours, workHours, commuteHours, screenHours, memoryStartAge, baselineAge } = this.state;

    let lifespan: ConditionalLifespanResult;

    if (modelType === 'gompertz') {
      const gRes = computeGompertzLifespan(age, gompertzParams.M, gompertzParams.beta);
      lifespan = {
        expectedEndAge: gRes.expectedEndAge,
        remainingCalendarYears: gRes.remainingCalendarYears,
        p10RemainingYears: gRes.p10RemainingYears,
        p90RemainingYears: gRes.p90RemainingYears,
        p10EndAge: gRes.p10EndAge,
        p90EndAge: gRes.p90EndAge,
      };
    } else {
      // Normal model (default and for LEV base)
      lifespan = computeNormalLifespan(age, normalParams.mu, normalParams.sigma);
    }

    const awakeYears = calculateAwakeYears(lifespan.remainingCalendarYears, sleepHours);
    const awakeDaysPerYear = calculateAwakeDaysPerYear(sleepHours);

    const freeInfo = calculateFreeHours(lifespan.remainingCalendarYears, {
      sleepHours,
      workHours,
      commuteHours,
      screenHours,
    });

    const subjective = calculateSubjectiveTime(
      age,
      lifespan.expectedEndAge,
      memoryStartAge,
      baselineAge
    );

    const timeMetrics: RemainingTimeMetrics = {
      calendarYears: lifespan.remainingCalendarYears,
      awakeYears,
      awakeDaysPerYear,
      freeHoursPerDay: freeInfo.freeHoursPerDay,
      totalFreeHours: freeInfo.totalFreeHours,
      isOverAllocated: freeInfo.isOverAllocated,
      totalAllocatedHours: freeInfo.totalAllocatedHours,
    };

    return { lifespan, timeMetrics, subjective };
  }

  private renderAll(): void {
    const { lifespan, timeMetrics, subjective } = this.evaluateModels();

    // 1. Header
    renderHeader(this.elHeader, this.state, {
      onLanguageChange: (lang) => this.updateState({ language: lang }),
      onModelChange: (model) => this.updateState({ modelType: model }),
      onUiModeChange: (uiMode) => this.updateState({ uiMode }),
      onOpenShareModal: () => {
        this.isShareModalOpen = true;
        this.shareModalComponent.render(this.state, lifespan, timeMetrics, subjective);
      },
      onResetDefaults: () => {
        this.state = { ...DEFAULT_STATE };
        window.history.replaceState(null, '', encodeStateToHash(this.state));
        this.renderAll();
      },
      onExportJson: () => {
        const json = exportStateToJson(this.state);
        downloadJsonFile(json, `lifespan-purchasing-power-${Date.now()}.json`);
      },
      onImportJson: () => {
        const input = document.getElementById('json-file-input') as HTMLInputElement;
        const file = input?.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            const imported = importStateFromJson(content);
            this.state = imported;
            window.history.replaceState(null, '', encodeStateToHash(this.state));
            this.renderAll();
          }
        };
        reader.readAsText(file);
      },
    });

    // 2. Live Countdown
    this.countdownComponent.render(this.state, lifespan.remainingCalendarYears);

    // 3. SVG Distribution Chart
    this.chartComponent.render(
      this.state,
      lifespan.expectedEndAge,
      lifespan.p10EndAge,
      lifespan.p90EndAge
    );

    // 4. Headline Cards
    renderCards(this.elCards, this.state, lifespan, timeMetrics, subjective);

    // 5. 3-Scenario Comparison
    renderComparison(this.elComparison, this.state);

    // 6. Equivalents Grid
    this.equivalentsComponent.render(this.state, lifespan.remainingCalendarYears);

    // 7. Inputs Panel
    renderInputs(this.elInputs, this.state, {
      onStateUpdate: (updates) => this.updateState(updates),
    });

    // 8. Disclaimer
    renderDisclaimer(this.elDisclaimer, this.state);

    // 9. Re-render modal if open
    if (this.isShareModalOpen) {
      this.shareModalComponent.render(this.state, lifespan, timeMetrics, subjective);
    }
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new LifespanApp();
});
