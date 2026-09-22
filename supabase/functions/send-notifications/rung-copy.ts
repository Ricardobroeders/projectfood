// Copy for the rung nudge, per locale: "Mia needs 9 more vegetables for Green machine gold."
// Achievement names follow the app's locale files (projectfood-mobile/src/features/i18n/locales/*.json,
// key stamps.<id>.title); unit phrases read after a number, singular and plural.
import type { RungState, Threshold } from './ladder.ts';

type Locale = 'en' | 'nl' | 'it';
type Unit = [singular: string, plural: string];

const NAMES: Record<Locale, Record<string, string>> = {
  en: {
    explorer: 'Explorer', full_table: 'Full table', rainbow: 'Rainbow', big_dinner: 'Big dinner', regular_table: 'Regular table', steady_weeks: 'Steady weeks',
    green_machine: 'Green machine', fruit_basket: 'Fruit basket', herb_garden: 'Herb garden', nutcracker: 'Nutcracker', bean_counter: 'Bean counter', grain_train: 'Grain train',
    bubbly: 'Bubbly', superfood: 'Superfood', tomato_family: 'Tomato family', regulars: 'Regulars', table_talk: 'Table talk', family_of_thirty: 'Family of thirty',
  },
  nl: {
    explorer: 'Ontdekker', full_table: 'Volle tafel', rainbow: 'Regenboog', big_dinner: 'Groot diner', regular_table: 'Vaste tafel', steady_weeks: 'Vaste weken',
    green_machine: 'Groentekanjer', fruit_basket: 'Fruitmand', herb_garden: 'Kruidentuin', nutcracker: 'Notenkraker', bean_counter: 'Bonenteller', grain_train: 'Graantrein',
    bubbly: 'Bubbels', superfood: 'Superfood', tomato_family: 'Tomatenfamilie', regulars: 'Vaste gasten', table_talk: 'Tafelpraat', family_of_thirty: 'Familie van dertig',
  },
  it: {
    explorer: 'Esploratore', full_table: 'Tavola piena', rainbow: 'Arcobaleno', big_dinner: 'Grande cena', regular_table: 'Tavola regolare', steady_weeks: 'Settimane costanti',
    green_machine: 'Macchina verde', fruit_basket: 'Cesto di frutta', herb_garden: 'Giardino di erbe', nutcracker: 'Schiaccianoci', bean_counter: 'Conta-fagioli', grain_train: 'Treno dei cereali',
    bubbly: 'Bollicine', superfood: 'Superfood', tomato_family: 'Famiglia del pomodoro', regulars: 'Habitué', table_talk: 'Chiacchiere a tavola', family_of_thirty: 'Famiglia dei trenta',
  },
};

const LEVELS: Record<Locale, string[]> = {
  en: ['bronze', 'silver', 'gold', 'platinum'],
  nl: ['brons', 'zilver', 'goud', 'platina'],
  it: ['bronzo', 'argento', 'oro', 'platino'],
};

/** What a rung counts. Regulars changes metric per rung, so it carries one unit per level. */
const UNITS: Record<Locale, Record<string, Unit | Unit[]>> = {
  en: {
    explorer: ['different plant', 'different plants'],
    full_table: ['plant the whole family has tasted', 'plants the whole family has tasted'],
    rainbow: ['week with five colours', 'weeks with five colours'],
    big_dinner: ['plant in one dinner', 'plants in one dinner'],
    regular_table: ['dinner', 'dinners'],
    steady_weeks: ['week with four dinners', 'weeks with four dinners'],
    green_machine: ['vegetable', 'vegetables'],
    fruit_basket: ['fruit', 'fruits'],
    herb_garden: ['herb', 'herbs'],
    nutcracker: ['nut or seed', 'nuts and seeds'],
    bean_counter: ['legume', 'legumes'],
    grain_train: ['whole grain', 'whole grains'],
    bubbly: ['ferment', 'ferments'],
    superfood: ['superfood', 'superfoods'],
    tomato_family: ['tomato-family plant', 'tomato-family plants'],
    regulars: [['silver card', 'silver cards'], ['gold card', 'gold cards'], ['plant tasted 25 times', 'plants tasted 25 times'], ['taste of one plant', 'tastes of one plant']],
    table_talk: ['dinner in a row', 'dinners in a row'],
    family_of_thirty: ['week of 30', 'weeks of 30'],
  },
  nl: {
    explorer: ['andere plant', 'verschillende planten'],
    full_table: ['plant die het hele gezin proefde', 'planten die het hele gezin proefde'],
    rainbow: ['week met vijf kleuren', 'weken met vijf kleuren'],
    big_dinner: ['plant in één diner', 'planten in één diner'],
    regular_table: ['diner', 'diners'],
    steady_weeks: ['week met vier diners', 'weken met vier diners'],
    green_machine: ['groente', 'groenten'],
    fruit_basket: ['fruitsoort', 'fruitsoorten'],
    herb_garden: ['kruid', 'kruiden'],
    nutcracker: ['noot of zaad', 'noten en zaden'],
    bean_counter: ['peulvrucht', 'peulvruchten'],
    grain_train: ['volkoren graan', 'volkoren granen'],
    bubbly: ['ferment', 'fermenten'],
    superfood: ['superfood', 'superfoods'],
    tomato_family: ['plant uit de tomatenfamilie', 'planten uit de tomatenfamilie'],
    regulars: [['zilveren kaart', 'zilveren kaarten'], ['gouden kaart', 'gouden kaarten'], ['plant 25 keer geproefd', 'planten 25 keer geproefd'], ['hapje van één plant', 'hapjes van één plant']],
    table_talk: ['avond op rij', 'avonden op rij'],
    family_of_thirty: ['week van 30', 'weken van 30'],
  },
  it: {
    explorer: ['pianta diversa', 'piante diverse'],
    full_table: ['pianta assaggiata da tutta la famiglia', 'piante assaggiate da tutta la famiglia'],
    rainbow: ['settimana con cinque colori', 'settimane con cinque colori'],
    big_dinner: ['pianta in una cena', 'piante in una cena'],
    regular_table: ['cena', 'cene'],
    steady_weeks: ['settimana con quattro cene', 'settimane con quattro cene'],
    green_machine: ['verdura', 'verdure'],
    fruit_basket: ['frutto', 'frutti'],
    herb_garden: ['erba', 'erbe'],
    nutcracker: ['noce o seme', 'noci e semi'],
    bean_counter: ['legume', 'legumi'],
    grain_train: ['cereale integrale', 'cereali integrali'],
    bubbly: ['fermentato', 'fermentati'],
    superfood: ['superfood', 'superfood'],
    tomato_family: ['pianta della famiglia del pomodoro', 'piante della famiglia del pomodoro'],
    regulars: [["carta d'argento", "carte d'argento"], ["carta d'oro", "carte d'oro"], ['pianta assaggiata 25 volte', 'piante assaggiate 25 volte'], ['assaggio di una pianta', 'assaggi di una pianta']],
    table_talk: ['cena di fila', 'cene di fila'],
    family_of_thirty: ['settimana da 30', 'settimane da 30'],
  },
};

const TITLES: Record<Locale, Record<Threshold, string>> = {
  en: { 50: 'Halfway there', 75: 'Almost there' },
  nl: { 50: 'Halverwege', 75: 'Bijna' },
  it: { 50: 'A metà strada', 75: 'Quasi' },
};

const BODY: Record<Locale, (owner: string | null, n: number, unit: string, stamp: string, level: string) => string> = {
  en: (o, n, u, s, l) => `${o ?? 'The family'} needs ${n} more ${u} for ${s} ${l}.`,
  nl: (o, n, u, s, l) => `${o ?? 'Het gezin'} heeft nog ${n} ${u} nodig voor ${s} ${l}.`,
  it: (o, n, u, s, l) => `${o ? `A ${o}` : 'Alla famiglia'} ${n === 1 ? 'manca' : 'mancano'} ${n} ${u} per ${s} ${l}.`,
};

const asLocale = (l: string): Locale => (l === 'nl' || l === 'it' ? l : 'en');

/** Title and body for one rung nudge. `owner` is the member's name, null for a household achievement. */
export function rungCopy(locale: string, r: RungState, owner: string | null, threshold: Threshold): { title: string; body: string } {
  const l = asLocale(locale);
  const n = Math.max(1, r.target - r.current);
  const u = UNITS[l][r.id];
  const unit: Unit = Array.isArray(u[0]) ? (u as Unit[])[Math.min(r.level, 4) - 1] : (u as Unit);
  return {
    title: TITLES[l][threshold],
    body: BODY[l](owner, n, n === 1 ? unit[0] : unit[1], NAMES[l][r.id] ?? r.id, LEVELS[l][Math.min(Math.max(r.level, 1), 4) - 1]),
  };
}
