export const en = {
  // Header & Meta
  title: 'Lifespan Purchasing Power',
  subtitle: 'Remaining life as the one asset you are guaranteed to spend and can never earn more of.',
  lang_en: 'EN',
  lang_vi: 'VI',
  model_normal: 'Normal Distribution',
  model_gompertz: 'Gompertz Mortality',
  model_lev: 'Longevity Escape Velocity',
  mode_simple: 'Simple',
  mode_detailed: 'Detailed',
  btn_share: 'Share & Export',
  btn_reset: 'Reset Defaults',
  btn_export_json: 'Export JSON',
  btn_import_json: 'Import JSON',

  // View sections switcher
  tab_section_all: 'All Perspectives',
  tab_section_purchasing_power: 'Purchasing Power',
  tab_section_human_infra: 'Human Infra Engine',

  // Section titles
  section_script: 'Your Script',
  section_script_desc: 'Configure your current age, daily rhythms, and lifespan model parameters.',
  section_evaluation: 'Unified Evaluation',
  section_evaluation_desc: 'Your remaining purchasing power across physical, awake, and subjective time.',
  section_chart: 'Lifespan Probability Distribution',
  section_chart_hint: 'Drag the gold expected marker or use Left/Right arrow keys to adjust mean lifespan.',
  section_comparison: 'Scenario Comparison',
  section_comparison_desc: 'Side-by-side projection of worst-case, status-quo, and best-case assumptions.',
  section_equivalents: 'Purchasing Power Equivalents',
  section_equivalents_desc: 'Converting remaining years into visceral units you can feel and spend.',
  section_countdown: 'Live Countdown',
  section_countdown_hint: 'Ticking per second. Focus on the value of every single moment.',

  // Human Infra Section Header
  section_human_infra_title: 'Human Infra: Subject Continuity Engine',
  section_human_infra_desc:
    'Treating the continued availability of you—to act, learn, create, and reach the future—as an engineering substrate.',

  // Inputs
  label_current_age: 'Current age',
  label_scenario_preset: 'Lifespan scenario preset',
  preset_worst: 'Worst (μ68, σ7)',
  preset_status_quo: 'Status Quo (μ79, σ9)',
  preset_best: 'Best (μ93, σ6)',
  preset_custom: 'Custom Parameters',
  label_mean_lifespan: 'Expected lifespan (μ)',
  label_std_dev: 'Lifespan spread (σ)',
  label_gompertz_modal: 'Modal death age (M)',
  label_gompertz_beta: 'Dispersion parameter (β)',
  label_overlays: 'Overlay comparison curves',
  overlay_worst: 'Worst (68)',
  overlay_status_quo: 'Status Quo (79)',
  overlay_best: 'Best (93)',

  label_sleep_hours: 'Sleep per day',
  label_work_hours: 'Work per day',
  label_commute_hours: 'Commute per day',
  label_screen_hours: 'Screen time per day',
  label_meals_per_day: 'Meals per day',
  label_books_per_year: 'Books read per year',
  label_memory_start: 'Memory start age (origin m)',
  label_baseline_age: 'Subjective baseline age (b)',
  label_daily_focus: 'Daily peak creative focus',
  label_ai_factor: 'AI / Tool Leverage Factor',

  warning_overallocated: 'Warning: Sleep, work, commute, and screen time exceed 24 hours/day! Free time is clamped to 0.',

  // Headline Cards
  card_effective_awake: 'Effective Awake Life',
  card_effective_awake_desc: 'Remaining years with sleep deducted (~{days} awake days/year).',
  card_calendar_years: 'Expected Calendar Life',
  card_calendar_years_desc: 'Conditional expected remaining years alive (never negative).',
  card_free_time: 'Unallocated Free Time',
  card_free_time_desc: 'Total hours left after sleep, work, commute, and screens ({hours} h/day).',
  card_percentile_range: '10th – 90th Percentile Range',
  card_percentile_desc: 'True uncertainty: 80% probability you fall between these endpoints.',
  years_suffix: 'years',
  hours_suffix: 'hours',
  days_suffix: 'days',
  range_format: '{p10} to {p90} years left',
  end_age_format: 'Reaching age {age}',

  // Subjective Weber-Fechner
  card_subjective_progress: 'Perceived Life Spent',
  card_subjective_progress_desc: 'Subjective time is logarithmic: year n feels like 1/n of remembered life.',
  card_feels_half: 'Life Feels Half Over At',
  card_feels_half_desc: 'By age {age}, 50% of your subjective remembered duration has elapsed.',
  card_time_inflation: 'Time Inflation',
  card_time_inflation_desc: 'Your {remaining} remaining calendar years will feel like {subj} years of age {b}.',
  subjective_disclaimer: 'Modeled hypothesis via Weber-Fechner logarithmic perception, not medical neuroscience.',

  // LEV mode
  lev_badge: 'Longevity Escape Velocity Mode Active',
  lev_title: 'Unbounded Lifespan Horizon',
  lev_desc: 'In LEV, biological aging is decoupled from chronological time. Horizon is bounded by the Stellar Era of the cosmos.',
  lev_bound_label: 'Cosmological Horizon',
  lev_bound_val: '~10¹⁴ years (~100 trillion years)',
  lev_cosmic_horizon_desc: 'Remaining lifetime of red dwarf stars minus current age of the universe.',

  // Human Infra: Healthspan & The Golden Window
  card_healthspan_title: 'Healthspan & The Golden Window',
  card_healthspan_desc:
    'Healthy Life Expectancy (HALE) marks your window of prime physical autonomy and vigor before age-related limitations.',
  label_golden_window: 'Golden Window (Vigor)',
  label_fragility_era: 'Fragility Horizon',
  golden_window_format: '{years} years of prime vitality left',
  fragility_era_format: '~{years} lower-intensity elder years',
  hale_age_format: 'Reaching age {age} in full vitality',

  // Human Infra: Deep Focus Engine
  card_focus_title: 'Peak Deep Focus Engine',
  card_focus_desc:
    'High-clarity, creative focus hours left after deducting daily fatigue and obligations ({hours} h/day).',
  label_mastery_quotas: '10,000-Hour Masteries',
  mastery_quotas_desc:
    'Enough deep cognitive bandwidth to master {count} completely distinct disciplines from scratch.',

  // Human Infra: Accelerated Returns Flywheel
  card_flywheel_title: 'Accelerated Returns Flywheel',
  card_flywheel_desc:
    'The core Human Infra law: Remaining time lowers the cost of failing ambitious, transformative endeavors.',
  flywheel_3yr_eras: '3-Year Life Chapters',
  flywheel_3yr_desc:
    '{count} distinct 3-year chapters left to reinvent your craft, career, business, or lifestyle.',
  flywheel_failure_runway: 'Failure Tolerance Runway',
  flywheel_failure_desc:
    'You can completely fail {count} ambitious 2-year experimental ventures before your golden window closes.',

  // Human Infra: The Calendar Bridge
  card_calendar_bridge_title: 'The Calendar Bridge & Biotech Roadmap',
  card_calendar_bridge_desc:
    'Connecting your personal timeline to the macro roadmap of life-extension and biotechnology.',
  bridge_target_year_format: 'Projected to see calendar year {year}',
  bridge_golden_year_format: 'Prime golden vigor extends to year {year}',
  milestone_2035_title: '2035: Targeted Senolytics & Preventative mRNA',
  milestone_2035_desc: 'Routine senescent cell clearance and personalized cancer vaccines.',
  milestone_2040_title: '2040: Longevity Escape Velocity (LEV)',
  milestone_2040_desc: 'Medical science adds >1.0 year of healthy life for every 1.0 calendar year passed.',
  milestone_2045_title: '2045: Engineered Organ Replacement',
  milestone_2045_desc: 'Whole-organ 3D bioprinting and immunocompatible xenotransplantation.',
  milestone_2055_title: '2055+: Epigenetic Reprogramming & Stasis',
  milestone_2055_desc: 'In vivo epigenetic age reversal and neural-CNS preservation.',
  milestone_reached: 'Within Reach',
  milestone_beyond: 'Requires LEV',

  // Human Infra: AI Leverage
  card_ai_leverage_title: 'Cognitive AI & Tool Leverage',
  card_ai_leverage_desc:
    'How tools and AI amplification expand your effective lifetime creative and problem-solving output.',
  ai_amplified_years: '{years} amplified waking years of equivalent output',
  ai_career_equivalents: 'Equals ~{careers} historical 40-year working careers',

  // Human Infra: Boundary Diagnostic
  card_boundary_diagnostic_title: 'Boundary-Condition vs. Boundary-Within',
  card_boundary_diagnostic_desc:
    'Are you investing enough to keep the subject available, or only optimizing inside the countdown?',
  label_boundary_condition: 'Boundary-Condition (Sleep & Restoration)',
  label_boundary_within: 'Boundary-Within (Work, Commute, Screen, Leisure)',
  boundary_insight_good:
    'Strong foundation: You allocate substantial bandwidth to preserving your biological and cognitive substrate.',
  boundary_insight_low:
    'Substrate risk: Work and screen demands are eroding the very subject needed to reach the future.',

  // Chart labels
  chart_you_now: 'You (now: {age})',
  chart_expected_end: 'Expected End ({age})',
  chart_axis_age: 'Age (years)',
  chart_axis_density: 'Probability Density',
  chart_remaining_area: 'Remaining Probability Mass',

  // Equivalents
  filter_all: 'All Units',
  filter_seconds: 'Seconds to Hours',
  filter_days: 'Days to Weeks',
  filter_years: 'Years & Milestones',

  equiv_heartbeats_unit: 'heartbeats',
  equiv_heartbeats_rate: 'at 70 bpm resting heart rate',
  equiv_breaths_unit: 'breaths',
  equiv_breaths_rate: 'at 16 breaths per minute',
  equiv_births_unit: 'world births',
  equiv_births_rate: 'at ~4.3 human births per second worldwide',
  equiv_songs_unit: 'songs listened',
  equiv_songs_rate: 'at 10 songs per day',
  equiv_movies_unit: 'movies watched',
  equiv_movies_rate: 'at 1 movie per week (52/yr)',
  equiv_coffees_unit: 'cups of coffee / tea',
  equiv_coffees_rate: 'at 1.5 cups per day',
  equiv_meals_unit: 'meals & breakfasts',
  equiv_meals_rate: 'at {meals} meals per day',
  equiv_full_moons_unit: 'full moons',
  equiv_full_moons_rate: 'synodic lunar cycle (every 29.53 days)',
  equiv_sunrises_unit: 'sunrises & sunsets',
  equiv_sunrises_rate: '365.25 days per calendar year',
  equiv_weekends_unit: 'golden weekends',
  equiv_weekends_rate: '52.18 weekends per year',
  equiv_books_unit: 'books read',
  equiv_books_rate: 'at your rate of {books} books per year',
  equiv_sleeps_unit: 'luxurious 9h weekend sleeps',
  equiv_sleeps_rate: '1 deep restorative sleep per week',
  equiv_seasons_unit: 'changing seasons',
  equiv_seasons_rate: 'spring, summer, autumn, winter (4/yr)',
  equiv_vacations_unit: 'adventures & vacations',
  equiv_vacations_rate: 'at 2 major trips per year',
  equiv_friends_unit: 'nights with old friends',
  equiv_friends_rate: 'at 6 heart-to-heart evenings per year',
  equiv_birthdays_unit: 'birthdays celebrated',
  equiv_birthdays_rate: 'once every year',
  equiv_lunar_new_years_unit: 'Lunar New Years (Tết)',
  equiv_lunar_new_years_rate: 'annual renewal of spring',
  equiv_world_cups_unit: 'World Cups & Olympics',
  equiv_world_cups_rate: 'global celebrations every 4 years',

  // Countdown
  countdown_years: 'YRS',
  countdown_days: 'DAYS',
  countdown_hours: 'HRS',
  countdown_minutes: 'MIN',
  countdown_seconds: 'SEC',
  btn_hide_countdown: 'Hide Countdown',
  btn_show_countdown: 'Show Countdown',

  // Share Modal
  share_modal_title: 'Share Your Perspective',
  share_link_label: 'Direct Shareable URL (Preserves all inputs)',
  btn_copy_link: 'Copy Link',
  copied_success: 'Link copied to clipboard!',
  share_image_title: '1200 × 630 Share Card Preview',
  share_image_desc: 'High-resolution PNG card generated entirely in your browser without network calls.',
  btn_download_png: 'Download Share PNG',
  close_modal: 'Close',

  // Disclaimer
  disclaimer_title: 'Philosophy & Disclaimer',
  disclaimer_body:
    'This project is a contemplative tool designed to frame remaining lifespan as purchasing power for meaningful experiences. It is strictly not medical, actuarial, insurance, or financial advice. The normal and Gompertz models provide statistical illustrations of lifespan distributions, and subjective time scaling is based on the Weber-Fechner logarithmic hypothesis. Treasure your waking hours and spend them intentionally.',
};
