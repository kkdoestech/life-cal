/**
 * Equivalents exchange: converts remaining calendar time into visceral everyday units.
 * "Remaining life as the one asset you are guaranteed to spend and can never earn more of."
 */

export interface EquivalentDefinition {
  id: string;
  category: 'seconds' | 'hours' | 'days' | 'weeks' | 'seasons' | 'years';
  ratePerYear: (userInputs: { mealsPerDay: number; booksPerYear: number }) => number;
  icon: string;
  rateLabelKey: string;
  unitKey: string;
}

export interface EquivalentResult {
  id: string;
  category: 'seconds' | 'hours' | 'days' | 'weeks' | 'seasons' | 'years';
  count: number;
  icon: string;
  rateLabelKey: string;
  unitKey: string;
}

// Full moon cycle is 29.53059 days (synodic month).
// 365.25 / 29.53059 = 12.368531... full moons per year.
// At 60 years: 60 * 12.368531 = 742.1118... full moons (matching golden test 742.1).
export const LUNAR_MONTH_DAYS = 29.53059;
export const FULL_MOONS_PER_YEAR = 365.25 / LUNAR_MONTH_DAYS;

export const EQUIVALENT_DEFINITIONS: EquivalentDefinition[] = [
  // Seconds & minutes
  {
    id: 'heartbeats',
    category: 'seconds',
    ratePerYear: () => 70 * 60 * 24 * 365.25, // 70 bpm
    icon: '❤️',
    rateLabelKey: 'equiv_heartbeats_rate',
    unitKey: 'equiv_heartbeats_unit',
  },
  {
    id: 'breaths',
    category: 'seconds',
    ratePerYear: () => 16 * 60 * 24 * 365.25, // 16 breaths/min
    icon: '🌬️',
    rateLabelKey: 'equiv_breaths_rate',
    unitKey: 'equiv_breaths_unit',
  },
  {
    id: 'world_births',
    category: 'seconds',
    ratePerYear: () => 4.3 * 86400 * 365.25, // ~4.3 births/sec worldwide
    icon: '👶',
    rateLabelKey: 'equiv_births_rate',
    unitKey: 'equiv_births_unit',
  },

  // Hours & daily rhythms
  {
    id: 'songs',
    category: 'hours',
    ratePerYear: () => 10 * 365.25, // 10 songs/day
    icon: '🎵',
    rateLabelKey: 'equiv_songs_rate',
    unitKey: 'equiv_songs_unit',
  },
  {
    id: 'movies',
    category: 'hours',
    ratePerYear: () => 52, // 1 movie/week
    icon: '🎬',
    rateLabelKey: 'equiv_movies_rate',
    unitKey: 'equiv_movies_unit',
  },
  {
    id: 'coffees',
    category: 'days',
    ratePerYear: () => 1.5 * 365.25, // 1.5 cups/day
    icon: '☕',
    rateLabelKey: 'equiv_coffees_rate',
    unitKey: 'equiv_coffees_unit',
  },
  {
    id: 'meals',
    category: 'days',
    ratePerYear: ({ mealsPerDay }) => mealsPerDay * 365.25,
    icon: '🍲',
    rateLabelKey: 'equiv_meals_rate',
    unitKey: 'equiv_meals_unit',
  },
  {
    id: 'full_moons',
    category: 'days',
    ratePerYear: () => FULL_MOONS_PER_YEAR,
    icon: '🌕',
    rateLabelKey: 'equiv_full_moons_rate',
    unitKey: 'equiv_full_moons_unit',
  },
  {
    id: 'sunrises',
    category: 'days',
    ratePerYear: () => 365.25,
    icon: '🌅',
    rateLabelKey: 'equiv_sunrises_rate',
    unitKey: 'equiv_sunrises_unit',
  },

  // Weeks & months
  {
    id: 'weekends',
    category: 'weeks',
    ratePerYear: () => 365.25 / 7, // ~52.18 weekends/yr
    icon: '🏖️',
    rateLabelKey: 'equiv_weekends_rate',
    unitKey: 'equiv_weekends_unit',
  },
  {
    id: 'books',
    category: 'weeks',
    ratePerYear: ({ booksPerYear }) => booksPerYear,
    icon: '📚',
    rateLabelKey: 'equiv_books_rate',
    unitKey: 'equiv_books_unit',
  },
  {
    id: 'long_sleeps',
    category: 'weeks',
    ratePerYear: () => 52, // once a week lie-in
    icon: '🛌',
    rateLabelKey: 'equiv_sleeps_rate',
    unitKey: 'equiv_sleeps_unit',
  },

  // Seasons & years
  {
    id: 'seasons',
    category: 'seasons',
    ratePerYear: () => 4,
    icon: '🍂',
    rateLabelKey: 'equiv_seasons_rate',
    unitKey: 'equiv_seasons_unit',
  },
  {
    id: 'vacations',
    category: 'years',
    ratePerYear: () => 2, // 2 vacations/year
    icon: '✈️',
    rateLabelKey: 'equiv_vacations_rate',
    unitKey: 'equiv_vacations_unit',
  },
  {
    id: 'nights_with_friends',
    category: 'years',
    ratePerYear: () => 6, // 6 memorable nights/year
    icon: '🍻',
    rateLabelKey: 'equiv_friends_rate',
    unitKey: 'equiv_friends_unit',
  },
  {
    id: 'birthdays',
    category: 'years',
    ratePerYear: () => 1,
    icon: '🎂',
    rateLabelKey: 'equiv_birthdays_rate',
    unitKey: 'equiv_birthdays_unit',
  },
  {
    id: 'lunar_new_years',
    category: 'years',
    ratePerYear: () => 1,
    icon: '🧧',
    rateLabelKey: 'equiv_lunar_new_years_rate',
    unitKey: 'equiv_lunar_new_years_unit',
  },
  {
    id: 'world_cups',
    category: 'years',
    ratePerYear: () => 0.25, // every 4 years
    icon: '⚽',
    rateLabelKey: 'equiv_world_cups_rate',
    unitKey: 'equiv_world_cups_unit',
  },
];

export function calculateEquivalents(
  remainingCalendarYears: number,
  userInputs: { mealsPerDay: number; booksPerYear: number }
): EquivalentResult[] {
  return EQUIVALENT_DEFINITIONS.map((def) => {
    const rate = def.ratePerYear(userInputs);
    const count = remainingCalendarYears * rate;
    return {
      id: def.id,
      category: def.category,
      count,
      icon: def.icon,
      rateLabelKey: def.rateLabelKey,
      unitKey: def.unitKey,
    };
  });
}
