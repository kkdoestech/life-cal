# Lifespan Calculator Clone — Analysis, Spec & Build Plan

Oct 2, 2026 · @kian

The improved version of this plan is in Improved plan; this tab keeps the analysis of the original and the first plan.

## Overview

We will rebuild the tradecatlabs "Remaining Lifespan Purchasing Power Calculator" as a single static web page, built step by step with Claude, then improve its weakest part: the lifespan model.

The original treats your remaining life as **the one asset you are guaranteed to spend and can never earn more of**. Like converting money into bananas or rent, it converts remaining years into units you can feel: sunrises left, breakfasts left, Lunar New Years left, books left. It also adds two twists: *subjective* time (later years feel shorter) and a "longevity escape velocity" mode for the Human Infra idea that lifespan might become unbounded.

Key facts about the original, from its publication page and the live calculator:
- One HTML page, all calculation in the browser: no account, backend, database, remote API or telemetry.
- Live version is v0.21.13; the publication page registers a source snapshot of v0.19.54, deployed on Cloudflare after privacy and CSP (Content Security Policy) checks.
- Its source code is not public, so this spec is reconstructed from the page's visible text, labels and disclaimer. Formulas in the next sections are our reconstruction, checked against the numbers the page states.
- It is explicitly not medical, actuarial, insurance or investment advice.

## Analysis of the original

Leaving out its AI-token counter, the page has 10 inputs, 8 headline outputs, a 3-scenario comparison and an "equivalents" exchange, plus sharing tools.

### Inputs ("Your script")

| Input | Default / range seen | Notes |
| --- | --- | --- |
| Current age | user sets | Gold vertical line on the curve marks "you now" |
| Lifespan scenario (μ, σ) | Worst μ68 σ7 · Status quo μ79 σ9 · Best μ93 σ6 · Custom | Normal distribution; drag a point on the curve to set the expected end |
| Overlay comparison | toggle each scenario | Dashed curves over the solid current one |
| Sleep | 8 h/day | 8 h sleep → about 243 awake days a year |
| Work, commute, screen | h/day | Free time = 24 − sleep − work − commute − screen |
| Meals per day | 3 | For meal equivalents |
| Books per year | 12 | For reading equivalents |
| Memory start age | e.g. 4 | Weber-Fechner "life origin" |
| Perceived baseline age | user sets | Converts "one year now" into how it felt at that age |
| Mode toggles | Simple / Detailed · Normal lifespan / Longevity escape velocity | LEV mode extends the horizon to about 10¹⁴ years |

### Outputs ("Unified evaluation")

| Output | What it shows |
| --- | --- |
| Expected remaining effective lifespan | Remaining years, awake time only |
| Live countdown | Remaining time ticking per second after you adjust a slider |
| Life bar | Birth (0) to estimated end age |
| LEV horizon | About 10¹⁴ − 1.38 × 10¹⁰ years: end of normal star formation minus the universe's current age |
| Time inflation | Subjective remaining time on a log scale |
| Free time remaining | After sleep, work, commute, screen |
| Perceived progress | Share of subjective life used vs left, and the age at which life "feels half over" |
| Scenario comparison | Worst, status quo and best side by side on the same age scale |

### Equivalents exchange

Units span time scales: heartbeats and births (seconds) → songs, movies, a happy minute (minutes to hours) → coffee, ramen, full moons, takeout, a drive (days) → weekends, long runs, a long sleep (weeks) → seasons → trips, concerts, nights with old friends, Lunar New Years, birthdays (years). The page's line: the larger the unit, the faster life feels.

### Sharing and persistence

Reset, import template, export template, share link (state in the URL), and generate share image (the site's own preview is a 1200 × 630 PNG).

## The math model (reconstructed)

Notation: a = current age, μ and σ = scenario mean and spread, E = expected end age, m = memory start age, b = perceived baseline age, s = sleep hours/day.

### 1. Conditional expected end age

The model uses a *conditional* lifespan distribution: given you are alive at age a, the normal curve is cut off below a (a truncated normal). φ and Φ are the standard normal density and cumulative distribution.

$$
\alpha = \frac{a - \mu}{\sigma}, \qquad E = \mathbb{E}[T \mid T > a] = \mu + \sigma \, \frac{\varphi(\alpha)}{1 - \Phi(\alpha)}
$$

### 2. Effective (awake) time

$$
R_{\text{cal}} = E - a, \qquad R_{\text{awake}} = R_{\text{cal}} \times \frac{24 - s}{24}
$$

### 3. Free time

$$
h_{\text{free}} = 24 - s - h_{\text{work}} - h_{\text{commute}} - h_{\text{screen}}, \qquad R_{\text{free}} = R_{\text{cal}} \times 365.25 \times h_{\text{free}} \text{ hours}
$$

### 4. Subjective time (Weber-Fechner)

$$
P_{\text{used}} = \frac{\ln(a/m)}{\ln(E/m)}, \qquad a_{\text{half}} = \sqrt{m \, E}
$$

Time inflation, in "years as they feel at age b":

$$
R_{\text{subj}}(b) = \int_a^E \frac{b}{t} \, dt = b \ln\frac{E}{a}
$$

### 5. Counts and equivalents

$$
N_{\text{unit}} = R_{\text{cal}} \times \text{rate per year}
$$

### 6. Longevity escape velocity mode

Cosmological bound: about $10^{14} - 1.38 \times 10^{10}$ years.

## Golden Tests

| Test | Inputs | Expected |
| --- | --- | --- |
| Conditional end age, young | a 19, μ 79, σ 9 | E = 79.00, remaining 60.00 years |
| Conditional end age, older | a 70, μ 79, σ 9 | E = 81.59, remaining 11.59 years |
| Conditional end age, past the mean | a 85, μ 79, σ 9 | E = 90.39, remaining 5.39 years (never negative) |
| Awake days per year | s 8 | 243.5 days |
| Feels-half age | m 4, E 80 | 17.89 |
| Perceived progress | a 19, m 4, E 79 | 52.2% |
| Time inflation | a 19, E 79, b 19 | 27.08 "years of today" |
| Free hours remaining | 60 years, s 8, work 8, commute 1, screen 3 | 87,660 hours |
| Full moons | 60 years | 742.1 |
