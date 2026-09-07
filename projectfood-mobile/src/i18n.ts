import type { Category } from '@/constants/theme';

export type Locale = 'en' | 'nl';
export type AchievementId = 'first_bites' | 'curious' | 'rainbow' | 'streak_7' | 'album';

const en = {
  tonight: "Tonight's dinner",
  subtitle: 'Tap what the family tasted',
  xp: 'XP',
  all: 'All',
  achievements: 'Achievements',
  home: 'Home',
  log: 'Log',
  cards: 'Cards',
  family: 'Family',
  reset: 'Reset',
  firstBitesTitle: 'First bites!',
  firstBitesBody: 'Three plants tasted tonight. That earns the first stamp.',
  bonus: '+50 XP bonus',
  showCard: 'Show my card',
  later: 'Later',
  didYouKnow: 'Did you know?',
  tapToFlip: 'Tap the card to flip it',
  curiousUnlocked: 'Curious stamp unlocked · +50 XP',
  close: 'Close',
  myCard: 'Fun-fact card',
  placeholder: 'Coming in the next build',
  homeTitle: 'Good evening',
  homeProgress: 'plants tasted tonight',
  homeCta: "Log tonight's dinner",
  stamps: {
    first_bites: 'First bites',
    curious: 'Curious',
    rainbow: 'Rainbow',
    streak_7: '7 dinners',
    album: 'Tomato family',
  } satisfies Record<AchievementId, string>,
  cats: {
    fruit: 'Fruit',
    vegetable: 'Vegetable',
    herb: 'Herb & spice',
    nut_seed: 'Nut & seed',
    legume: 'Legume',
    whole_grain: 'Whole grain',
    ferment: 'Ferment',
  } satisfies Record<Category, string>,
};

export type Strings = typeof en;

const nl: Strings = {
  tonight: 'Avondeten van vandaag',
  subtitle: 'Tik aan wat het gezin heeft geproefd',
  xp: 'XP',
  all: 'Alles',
  achievements: 'Prestaties',
  home: 'Home',
  log: 'Loggen',
  cards: 'Kaarten',
  family: 'Gezin',
  reset: 'Reset',
  firstBitesTitle: 'Eerste hapjes!',
  firstBitesBody: 'Drie planten geproefd vanavond. Dat is de eerste stempel.',
  bonus: '+50 XP bonus',
  showCard: 'Laat mijn kaart zien',
  later: 'Later',
  didYouKnow: 'Wist je dat?',
  tapToFlip: 'Tik op de kaart om hem om te draaien',
  curiousUnlocked: 'Stempel Nieuwsgierig · +50 XP',
  close: 'Sluiten',
  myCard: 'Weetjeskaart',
  placeholder: 'Komt in de volgende build',
  homeTitle: 'Goedenavond',
  homeProgress: 'planten geproefd vanavond',
  homeCta: 'Avondeten loggen',
  stamps: {
    first_bites: 'Eerste hapjes',
    curious: 'Nieuwsgierig',
    rainbow: 'Regenboog',
    streak_7: '7 avondmalen',
    album: 'Tomatenfamilie',
  },
  cats: {
    fruit: 'Fruit',
    vegetable: 'Groente',
    herb: 'Kruiden',
    nut_seed: 'Noten & zaden',
    legume: 'Peulvrucht',
    whole_grain: 'Volkoren',
    ferment: 'Gefermenteerd',
  },
};

export const STRINGS: Record<Locale, Strings> = { en, nl };
