import type { ImageSourcePropType } from 'react-native';

import type { Category } from '@/constants/theme';

export type Plant = {
  slug: string;
  name: { en: string; nl: string };
  category: Category;
  color: string;
  family: string | null;
  superfood: boolean;
  image: ImageSourcePropType;
  fact: { en: string; nl: string };
};

/** 24 plants from the live catalog, clay renders copied from projectfood-app/public/images/plants. */
export const PLANTS: Plant[] = [
  { slug: 'broccoli', name: { en: 'Broccoli', nl: 'Broccoli' }, category: 'vegetable', color: 'green', family: 'Brassicaceae', superfood: true, image: require('@/assets/plants/broccoli.png'),
    fact: { en: 'Broccoli is a flower that we eat before it blooms.', nl: 'Broccoli is een bloem die we opeten voordat hij gaat bloeien.' } },
  { slug: 'carrot', name: { en: 'Carrot', nl: 'Wortel' }, category: 'vegetable', color: 'orange', family: 'Apiaceae', superfood: false, image: require('@/assets/plants/carrot.png'),
    fact: { en: 'Carrots used to be purple. The orange ones were bred in the Netherlands.', nl: 'Wortels waren vroeger paars. De oranje wortel komt uit Nederland.' } },
  { slug: 'tomato', name: { en: 'Tomato', nl: 'Tomaat' }, category: 'vegetable', color: 'red', family: 'Solanaceae', superfood: false, image: require('@/assets/plants/tomato.png'),
    fact: { en: 'A tomato is a fruit, even though it acts like a vegetable at dinner.', nl: 'Een tomaat is eigenlijk fruit, ook al doet hij bij het avondeten alsof hij groente is.' } },
  { slug: 'cucumber', name: { en: 'Cucumber', nl: 'Komkommer' }, category: 'vegetable', color: 'green', family: 'Cucurbitaceae', superfood: false, image: require('@/assets/plants/cucumber.png'),
    fact: { en: 'A cucumber is about 95 percent water.', nl: 'Een komkommer bestaat voor ongeveer 95 procent uit water.' } },
  { slug: 'sweet-potato', name: { en: 'Sweet potato', nl: 'Zoete aardappel' }, category: 'vegetable', color: 'orange', family: 'Convolvulaceae', superfood: true, image: require('@/assets/plants/sweet-potato.png'),
    fact: { en: 'Sweet potatoes are not potatoes at all. They are cousins of a climbing flower.', nl: 'Zoete aardappels zijn geen aardappels. Ze zijn familie van een klimbloem.' } },
  { slug: 'red-pepper', name: { en: 'Red pepper', nl: 'Rode paprika' }, category: 'vegetable', color: 'red', family: 'Solanaceae', superfood: false, image: require('@/assets/plants/red-pepper.png'),
    fact: { en: 'A red pepper is a green pepper that stayed on the plant a bit longer.', nl: 'Een rode paprika is een groene paprika die wat langer aan de plant bleef hangen.' } },
  { slug: 'spinach', name: { en: 'Spinach', nl: 'Spinazie' }, category: 'vegetable', color: 'green', family: 'Amaranthaceae', superfood: true, image: require('@/assets/plants/spinach.png'),
    fact: { en: 'Spinach leaves squeak a little when you rub them together.', nl: 'Spinazieblaadjes piepen een beetje als je ze tegen elkaar wrijft.' } },
  { slug: 'pumpkin', name: { en: 'Pumpkin', nl: 'Pompoen' }, category: 'vegetable', color: 'orange', family: 'Cucurbitaceae', superfood: false, image: require('@/assets/plants/pumpkin.png'),
    fact: { en: 'The biggest pumpkin ever grown weighed more than a small car.', nl: 'De grootste pompoen ooit woog meer dan een kleine auto.' } },
  { slug: 'corn', name: { en: 'Corn', nl: 'Maïs' }, category: 'vegetable', color: 'yellow', family: 'Poaceae', superfood: false, image: require('@/assets/plants/corn.png'),
    fact: { en: 'Every corn kernel is a seed. One cob carries about 800 of them.', nl: 'Elke maïskorrel is een zaadje. Aan één kolf zitten er ongeveer 800.' } },
  { slug: 'strawberry', name: { en: 'Strawberry', nl: 'Aardbei' }, category: 'fruit', color: 'red', family: 'Rosaceae', superfood: true, image: require('@/assets/plants/strawberry.png'),
    fact: { en: 'A strawberry wears its seeds on the outside.', nl: 'Een aardbei draagt zijn zaadjes aan de buitenkant.' } },
  { slug: 'banana', name: { en: 'Banana', nl: 'Banaan' }, category: 'fruit', color: 'yellow', family: 'Musaceae', superfood: false, image: require('@/assets/plants/banana.png'),
    fact: { en: 'Bananas grow pointing up, towards the sun.', nl: 'Bananen groeien met de punt omhoog, naar de zon.' } },
  { slug: 'blueberry', name: { en: 'Blueberry', nl: 'Bosbes' }, category: 'fruit', color: 'blue', family: 'Ericaceae', superfood: true, image: require('@/assets/plants/blueberry.png'),
    fact: { en: 'Blueberries look grey-blue because of a natural wax coat.', nl: 'Bosbessen zijn blauwgrijs door een natuurlijk waslaagje.' } },
  { slug: 'red-apple', name: { en: 'Red apple', nl: 'Rode appel' }, category: 'fruit', color: 'red', family: 'Rosaceae', superfood: false, image: require('@/assets/plants/red-apple.png'),
    fact: { en: 'An apple floats because a quarter of it is air.', nl: 'Een appel blijft drijven omdat hij voor een kwart uit lucht bestaat.' } },
  { slug: 'kiwi', name: { en: 'Kiwi', nl: 'Kiwi' }, category: 'fruit', color: 'green', family: 'Actinidiaceae', superfood: true, image: require('@/assets/plants/kiwi.png'),
    fact: { en: 'The kiwi is named after a fuzzy bird from New Zealand.', nl: 'De kiwi is genoemd naar een pluizige vogel uit Nieuw-Zeeland.' } },
  { slug: 'mango', name: { en: 'Mango', nl: 'Mango' }, category: 'fruit', color: 'orange', family: 'Anacardiaceae', superfood: false, image: require('@/assets/plants/mango.png'),
    fact: { en: 'A mango tree can keep giving fruit for a hundred years.', nl: 'Een mangoboom kan wel honderd jaar lang vruchten geven.' } },
  { slug: 'basil', name: { en: 'Basil', nl: 'Basilicum' }, category: 'herb', color: 'green', family: 'Lamiaceae', superfood: false, image: require('@/assets/plants/basil.png'),
    fact: { en: 'Basil is in the same family as mint.', nl: 'Basilicum is familie van munt.' } },
  { slug: 'mint', name: { en: 'Mint', nl: 'Munt' }, category: 'herb', color: 'green', family: 'Lamiaceae', superfood: false, image: require('@/assets/plants/mint.png'),
    fact: { en: 'Mint feels cold because it tricks the cold sensors in your mouth.', nl: 'Munt voelt koud omdat het de koudevoelers in je mond voor de gek houdt.' } },
  { slug: 'walnut', name: { en: 'Walnut', nl: 'Walnoot' }, category: 'nut_seed', color: 'brown', family: 'Juglandaceae', superfood: true, image: require('@/assets/plants/walnut.png'),
    fact: { en: 'A walnut looks a bit like a tiny brain.', nl: 'Een walnoot lijkt een beetje op een piepklein brein.' } },
  { slug: 'almond', name: { en: 'Almond', nl: 'Amandel' }, category: 'nut_seed', color: 'brown', family: 'Rosaceae', superfood: true, image: require('@/assets/plants/almond.png'),
    fact: { en: 'Almonds are the seeds of a fruit that looks like a small peach.', nl: 'Amandelen zijn de pitten van een vrucht die op een kleine perzik lijkt.' } },
  { slug: 'chickpeas', name: { en: 'Chickpeas', nl: 'Kikkererwten' }, category: 'legume', color: 'brown', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/chickpeas.png'),
    fact: { en: 'Hummus is made of mashed chickpeas.', nl: 'Hummus is gemaakt van geprakte kikkererwten.' } },
  { slug: 'green-lentils', name: { en: 'Green lentils', nl: 'Groene linzen' }, category: 'legume', color: 'green', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/green-lentils.png'),
    fact: { en: 'People have farmed lentils for more than 8,000 years.', nl: 'Mensen verbouwen al meer dan 8.000 jaar linzen.' } },
  { slug: 'oats', name: { en: 'Oats', nl: 'Haver' }, category: 'whole_grain', color: 'brown', family: 'Poaceae', superfood: true, image: require('@/assets/plants/oats.png'),
    fact: { en: 'Horses love oats as much as we do.', nl: 'Paarden houden net zo veel van haver als wij.' } },
  { slug: 'yogurt', name: { en: 'Yogurt', nl: 'Yoghurt' }, category: 'ferment', color: 'white', family: null, superfood: false, image: require('@/assets/plants/yogurt.png'),
    fact: { en: 'Yogurt is milk that friendly bacteria turned thick and sour.', nl: 'Yoghurt is melk die door vriendelijke bacteriën dik en zuur werd.' } },
  { slug: 'kimchi', name: { en: 'Kimchi', nl: 'Kimchi' }, category: 'ferment', color: 'red', family: 'Brassicaceae', superfood: true, image: require('@/assets/plants/kimchi.png'),
    fact: { en: 'Kimchi is cabbage that has been bubbling away for weeks.', nl: 'Kimchi is kool die wekenlang heeft staan pruttelen.' } },
];

export const PLANT_BY_SLUG: Record<string, Plant> = Object.fromEntries(PLANTS.map((p) => [p.slug, p]));
