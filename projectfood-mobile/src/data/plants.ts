import type { ImageSourcePropType } from 'react-native';

import type { Category } from '@/constants/theme';

export type PlantColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'white' | 'brown';

export type Plant = {
  slug: string;
  name: { en: string; nl: string };
  category: Category;
  color: PlantColor;
  family: string | null;
  superfood: boolean;
  image: ImageSourcePropType;
  fact: { en: string; nl: string };
};

/**
 * 72 plants from the live catalog (Supabase `plants` + `plant_translations`, 2026-09-14), grouped by
 * category with the everyday ones first. Clay renders copied from projectfood-app/public/images/plants
 * at 128×128. Facts are the kid-facing fun facts for the card flip; the backend does not hold them yet.
 */
export const PLANTS: Plant[] = [
  // ── Vegetables ────────────────────────────────────────────────────────────────────────────
  { slug: 'broccoli', name: { en: 'Broccoli', nl: 'Broccoli' }, category: 'vegetable', color: 'green', family: 'Brassicaceae', superfood: true, image: require('@/assets/plants/broccoli.png'),
    fact: { en: 'Broccoli is a flower that we eat before it blooms.', nl: 'Broccoli is een bloem die we opeten voordat hij gaat bloeien.' } },
  { slug: 'carrot', name: { en: 'Carrot', nl: 'Wortel' }, category: 'vegetable', color: 'orange', family: 'Apiaceae', superfood: false, image: require('@/assets/plants/carrot.png'),
    fact: { en: 'Carrots used to be purple. The orange ones were bred in the Netherlands.', nl: 'Wortels waren vroeger paars. De oranje wortel komt uit Nederland.' } },
  { slug: 'tomato', name: { en: 'Tomato', nl: 'Tomaat' }, category: 'vegetable', color: 'red', family: 'Solanaceae', superfood: false, image: require('@/assets/plants/tomato.png'),
    fact: { en: 'A tomato is a fruit, even though it acts like a vegetable at dinner.', nl: 'Een tomaat is eigenlijk fruit, ook al doet hij bij het avondeten alsof hij groente is.' } },
  { slug: 'cucumber', name: { en: 'Cucumber', nl: 'Komkommer' }, category: 'vegetable', color: 'green', family: 'Cucurbitaceae', superfood: false, image: require('@/assets/plants/cucumber.png'),
    fact: { en: 'A cucumber is about 95 percent water.', nl: 'Een komkommer bestaat voor ongeveer 95 procent uit water.' } },
  { slug: 'potato', name: { en: 'Potato', nl: 'Aardappel' }, category: 'vegetable', color: 'brown', family: 'Solanaceae', superfood: false, image: require('@/assets/plants/potato.png'),
    fact: { en: 'A potato is a swollen underground stem, not a root.', nl: 'Een aardappel is een dikke ondergrondse stengel, geen wortel.' } },
  { slug: 'sweet-potato', name: { en: 'Sweet potato', nl: 'Zoete aardappel' }, category: 'vegetable', color: 'orange', family: 'Convolvulaceae', superfood: true, image: require('@/assets/plants/sweet-potato.png'),
    fact: { en: 'Sweet potatoes are not potatoes at all. They are cousins of a climbing flower.', nl: 'Zoete aardappels zijn geen aardappels. Ze zijn familie van een klimbloem.' } },
  { slug: 'red-pepper', name: { en: 'Red pepper', nl: 'Rode paprika' }, category: 'vegetable', color: 'red', family: 'Solanaceae', superfood: false, image: require('@/assets/plants/red-pepper.png'),
    fact: { en: 'A red pepper is a green pepper that stayed on the plant a bit longer.', nl: 'Een rode paprika is een groene paprika die wat langer aan de plant bleef hangen.' } },
  { slug: 'spinach', name: { en: 'Spinach', nl: 'Spinazie' }, category: 'vegetable', color: 'green', family: 'Amaranthaceae', superfood: true, image: require('@/assets/plants/spinach.png'),
    fact: { en: 'Spinach leaves squeak a little when you rub them together.', nl: 'Spinazieblaadjes piepen een beetje als je ze tegen elkaar wrijft.' } },
  { slug: 'cauliflower', name: { en: 'Cauliflower', nl: 'Bloemkool' }, category: 'vegetable', color: 'white', family: 'Brassicaceae', superfood: false, image: require('@/assets/plants/cauliflower.png'),
    fact: { en: 'Cauliflower stays white because its leaves keep the sun off it.', nl: 'Bloemkool blijft wit omdat de bladeren de zon tegenhouden.' } },
  { slug: 'pea', name: { en: 'Peas', nl: 'Erwten' }, category: 'vegetable', color: 'green', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/pea.png'),
    fact: { en: 'Peas are seeds. Each pod is a tiny row of them.', nl: 'Erwten zijn zaadjes. Elke peul is een klein rijtje.' } },
  { slug: 'green-bean', name: { en: 'Green beans', nl: 'Sperziebonen' }, category: 'vegetable', color: 'green', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/green-bean.png'),
    fact: { en: 'Green beans are picked young, before the beans inside grow big.', nl: 'Sperziebonen worden jong geplukt, voordat de boontjes erin groot worden.' } },
  { slug: 'courgette', name: { en: 'Courgette', nl: 'Courgette' }, category: 'vegetable', color: 'green', family: 'Cucurbitaceae', superfood: false, image: require('@/assets/plants/courgette.png'),
    fact: { en: 'A courgette is a young squash. Left alone it grows as long as your arm.', nl: 'Een courgette is een jonge pompoensoort. Laat je hem hangen, dan wordt hij zo lang als je arm.' } },
  { slug: 'aubergine', name: { en: 'Aubergine', nl: 'Aubergine' }, category: 'vegetable', color: 'purple', family: 'Solanaceae', superfood: false, image: require('@/assets/plants/aubergine.png'),
    fact: { en: 'The first aubergines were small and white, like eggs.', nl: 'De eerste aubergines waren klein en wit, net eieren.' } },
  { slug: 'beetroot', name: { en: 'Beetroot', nl: 'Rode biet' }, category: 'vegetable', color: 'purple', family: 'Amaranthaceae', superfood: true, image: require('@/assets/plants/beetroot.png'),
    fact: { en: 'Beetroot juice was once used as lipstick.', nl: 'Bietensap werd vroeger als lippenstift gebruikt.' } },
  { slug: 'onion', name: { en: 'Onion', nl: 'Ui' }, category: 'vegetable', color: 'brown', family: 'Amaryllidaceae', superfood: false, image: require('@/assets/plants/onion.png'),
    fact: { en: 'Cutting an onion sets off a tiny gas that makes your eyes cry.', nl: 'Als je een ui snijdt komt er een gasje vrij dat je ogen laat huilen.' } },
  { slug: 'leek', name: { en: 'Leek', nl: 'Prei' }, category: 'vegetable', color: 'green', family: 'Amaryllidaceae', superfood: false, image: require('@/assets/plants/leek.png'),
    fact: { en: 'The leek is the national symbol of Wales.', nl: 'Prei is het nationale symbool van Wales.' } },
  { slug: 'button-mushroom', name: { en: 'Mushroom', nl: 'Champignon' }, category: 'vegetable', color: 'white', family: 'Agaricaceae', superfood: false, image: require('@/assets/plants/button-mushroom.png'),
    fact: { en: 'A mushroom is not a plant. It is closer to an animal than to a tree.', nl: 'Een champignon is geen plant. Hij is meer familie van dieren dan van bomen.' } },
  { slug: 'kale', name: { en: 'Kale', nl: 'Boerenkool' }, category: 'vegetable', color: 'green', family: 'Brassicaceae', superfood: true, image: require('@/assets/plants/kale.png'),
    fact: { en: 'Kale tastes sweeter after a night of frost.', nl: 'Boerenkool smaakt zoeter na een nacht vorst.' } },
  { slug: 'pumpkin', name: { en: 'Pumpkin', nl: 'Pompoen' }, category: 'vegetable', color: 'orange', family: 'Cucurbitaceae', superfood: false, image: require('@/assets/plants/pumpkin.png'),
    fact: { en: 'The biggest pumpkin ever grown weighed more than a small car.', nl: 'De grootste pompoen ooit woog meer dan een kleine auto.' } },
  { slug: 'corn', name: { en: 'Corn', nl: 'Maïs' }, category: 'vegetable', color: 'yellow', family: 'Poaceae', superfood: false, image: require('@/assets/plants/corn.png'),
    fact: { en: 'Every corn kernel is a seed. One cob carries about 800 of them.', nl: 'Elke maïskorrel is een zaadje. Aan één kolf zitten er ongeveer 800.' } },

  // ── Fruit ─────────────────────────────────────────────────────────────────────────────────
  { slug: 'red-apple', name: { en: 'Red apple', nl: 'Rode appel' }, category: 'fruit', color: 'red', family: 'Rosaceae', superfood: false, image: require('@/assets/plants/red-apple.png'),
    fact: { en: 'An apple floats because a quarter of it is air.', nl: 'Een appel blijft drijven omdat hij voor een kwart uit lucht bestaat.' } },
  { slug: 'banana', name: { en: 'Banana', nl: 'Banaan' }, category: 'fruit', color: 'yellow', family: 'Musaceae', superfood: false, image: require('@/assets/plants/banana.png'),
    fact: { en: 'Bananas grow pointing up, towards the sun.', nl: 'Bananen groeien met de punt omhoog, naar de zon.' } },
  { slug: 'strawberry', name: { en: 'Strawberry', nl: 'Aardbei' }, category: 'fruit', color: 'red', family: 'Rosaceae', superfood: true, image: require('@/assets/plants/strawberry.png'),
    fact: { en: 'A strawberry wears its seeds on the outside.', nl: 'Een aardbei draagt zijn zaadjes aan de buitenkant.' } },
  { slug: 'orange', name: { en: 'Orange', nl: 'Sinaasappel' }, category: 'fruit', color: 'orange', family: 'Rutaceae', superfood: false, image: require('@/assets/plants/orange.png'),
    fact: { en: 'Oranges are not always orange. In warm countries they stay green.', nl: 'Sinaasappels zijn niet altijd oranje. In warme landen blijven ze groen.' } },
  { slug: 'pear', name: { en: 'Pear', nl: 'Peer' }, category: 'fruit', color: 'green', family: 'Rosaceae', superfood: false, image: require('@/assets/plants/pear.png'),
    fact: { en: 'Pears ripen from the inside out.', nl: 'Peren rijpen van binnen naar buiten.' } },
  { slug: 'grape', name: { en: 'Grapes', nl: 'Druiven' }, category: 'fruit', color: 'purple', family: 'Vitaceae', superfood: false, image: require('@/assets/plants/grape.png'),
    fact: { en: 'A raisin is a grape that dried in the sun.', nl: 'Een rozijn is een druif die in de zon is gedroogd.' } },
  { slug: 'blueberry', name: { en: 'Blueberry', nl: 'Bosbes' }, category: 'fruit', color: 'blue', family: 'Ericaceae', superfood: true, image: require('@/assets/plants/blueberry.png'),
    fact: { en: 'Blueberries look grey-blue because of a natural wax coat.', nl: 'Bosbessen zijn blauwgrijs door een natuurlijk waslaagje.' } },
  { slug: 'raspberry', name: { en: 'Raspberry', nl: 'Framboos' }, category: 'fruit', color: 'red', family: 'Rosaceae', superfood: true, image: require('@/assets/plants/raspberry.png'),
    fact: { en: 'A raspberry is a bunch of tiny fruits holding hands.', nl: 'Een framboos is een trosje piepkleine vruchtjes die elkaar vasthouden.' } },
  { slug: 'kiwi', name: { en: 'Kiwi', nl: 'Kiwi' }, category: 'fruit', color: 'green', family: 'Actinidiaceae', superfood: true, image: require('@/assets/plants/kiwi.png'),
    fact: { en: 'The kiwi is named after a fuzzy bird from New Zealand.', nl: 'De kiwi is genoemd naar een pluizige vogel uit Nieuw-Zeeland.' } },
  { slug: 'mango', name: { en: 'Mango', nl: 'Mango' }, category: 'fruit', color: 'orange', family: 'Anacardiaceae', superfood: false, image: require('@/assets/plants/mango.png'),
    fact: { en: 'A mango tree can keep giving fruit for a hundred years.', nl: 'Een mangoboom kan wel honderd jaar lang vruchten geven.' } },
  { slug: 'watermelon', name: { en: 'Watermelon', nl: 'Watermeloen' }, category: 'fruit', color: 'red', family: 'Cucurbitaceae', superfood: false, image: require('@/assets/plants/watermelon.png'),
    fact: { en: 'A watermelon is 92 percent water, which is why it is so heavy.', nl: 'Een watermeloen bestaat voor 92 procent uit water, daarom is hij zo zwaar.' } },
  { slug: 'pineapple', name: { en: 'Pineapple', nl: 'Ananas' }, category: 'fruit', color: 'yellow', family: 'Bromeliaceae', superfood: false, image: require('@/assets/plants/pineapple.png'),
    fact: { en: 'A pineapple takes two years to grow.', nl: 'Een ananas doet er twee jaar over om te groeien.' } },
  { slug: 'cherry', name: { en: 'Cherries', nl: 'Kersen' }, category: 'fruit', color: 'red', family: 'Rosaceae', superfood: false, image: require('@/assets/plants/cherry.png'),
    fact: { en: 'A cherry tree grows from a single pit and can give 7,000 cherries.', nl: 'Een kersenboom groeit uit één pit en kan wel 7.000 kersen geven.' } },
  { slug: 'avocado', name: { en: 'Avocado', nl: 'Avocado' }, category: 'fruit', color: 'green', family: 'Lauraceae', superfood: true, image: require('@/assets/plants/avocado.png'),
    fact: { en: 'An avocado is a berry with one giant seed.', nl: 'Een avocado is een bes met één reuzenpit.' } },

  // ── Herbs & spices ────────────────────────────────────────────────────────────────────────
  { slug: 'basil', name: { en: 'Basil', nl: 'Basilicum' }, category: 'herb', color: 'green', family: 'Lamiaceae', superfood: false, image: require('@/assets/plants/basil.png'),
    fact: { en: 'Basil is in the same family as mint.', nl: 'Basilicum is familie van munt.' } },
  { slug: 'parsley', name: { en: 'Parsley', nl: 'Peterselie' }, category: 'herb', color: 'green', family: 'Apiaceae', superfood: false, image: require('@/assets/plants/parsley.png'),
    fact: { en: 'Parsley was once used as a decoration, not as food.', nl: 'Peterselie werd vroeger als versiering gebruikt, niet als eten.' } },
  { slug: 'chives', name: { en: 'Chives', nl: 'Bieslook' }, category: 'herb', color: 'green', family: 'Amaryllidaceae', superfood: false, image: require('@/assets/plants/chives.png'),
    fact: { en: 'Chives grow purple flowers you can eat too.', nl: 'Bieslook krijgt paarse bloemetjes die je ook kunt eten.' } },
  { slug: 'mint', name: { en: 'Mint', nl: 'Munt' }, category: 'herb', color: 'green', family: 'Lamiaceae', superfood: false, image: require('@/assets/plants/mint.png'),
    fact: { en: 'Mint feels cold because it tricks the cold sensors in your mouth.', nl: 'Munt voelt koud omdat het de koudevoelers in je mond voor de gek houdt.' } },
  { slug: 'oregano', name: { en: 'Oregano', nl: 'Oregano' }, category: 'herb', color: 'green', family: 'Lamiaceae', superfood: false, image: require('@/assets/plants/oregano.png'),
    fact: { en: 'Oregano means "joy of the mountain" in Greek.', nl: 'Oregano betekent "vreugde van de berg" in het Grieks.' } },
  { slug: 'thyme', name: { en: 'Thyme', nl: 'Tijm' }, category: 'herb', color: 'green', family: 'Lamiaceae', superfood: false, image: require('@/assets/plants/thyme.png'),
    fact: { en: 'Bees love thyme flowers, and thyme honey is famous.', nl: 'Bijen zijn dol op tijmbloemen, en tijmhoning is beroemd.' } },
  { slug: 'cinnamon', name: { en: 'Cinnamon', nl: 'Kaneel' }, category: 'herb', color: 'brown', family: 'Lauraceae', superfood: true, image: require('@/assets/plants/cinnamon.png'),
    fact: { en: 'Cinnamon is the bark of a tree, rolled up as it dries.', nl: 'Kaneel is de bast van een boom, die oprolt als hij droogt.' } },
  { slug: 'ginger', name: { en: 'Ginger', nl: 'Gember' }, category: 'herb', color: 'yellow', family: 'Zingiberaceae', superfood: true, image: require('@/assets/plants/ginger.png'),
    fact: { en: 'Ginger is a root that keeps growing if you plant a piece of it.', nl: 'Gember is een wortel die verder groeit als je een stukje plant.' } },

  // ── Nuts & seeds ──────────────────────────────────────────────────────────────────────────
  { slug: 'peanut', name: { en: 'Peanuts', nl: "Pinda's" }, category: 'nut_seed', color: 'brown', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/peanut.png'),
    fact: { en: 'Peanuts are not nuts. They grow underground like beans.', nl: "Pinda's zijn geen noten. Ze groeien onder de grond, net als bonen." } },
  { slug: 'walnut', name: { en: 'Walnut', nl: 'Walnoot' }, category: 'nut_seed', color: 'brown', family: 'Juglandaceae', superfood: true, image: require('@/assets/plants/walnut.png'),
    fact: { en: 'A walnut looks a bit like a tiny brain.', nl: 'Een walnoot lijkt een beetje op een piepklein brein.' } },
  { slug: 'almond', name: { en: 'Almond', nl: 'Amandel' }, category: 'nut_seed', color: 'brown', family: 'Rosaceae', superfood: true, image: require('@/assets/plants/almond.png'),
    fact: { en: 'Almonds are the seeds of a fruit that looks like a small peach.', nl: 'Amandelen zijn de pitten van een vrucht die op een kleine perzik lijkt.' } },
  { slug: 'cashew', name: { en: 'Cashew', nl: 'Cashewnoot' }, category: 'nut_seed', color: 'white', family: 'Anacardiaceae', superfood: false, image: require('@/assets/plants/cashew.png'),
    fact: { en: 'A cashew hangs under a fruit like a little tail.', nl: 'Een cashewnoot hangt als een staartje onder een vrucht.' } },
  { slug: 'hazelnut', name: { en: 'Hazelnut', nl: 'Hazelnoot' }, category: 'nut_seed', color: 'brown', family: 'Betulaceae', superfood: false, image: require('@/assets/plants/hazelnut.png'),
    fact: { en: 'Squirrels hide hazelnuts and forget some, so new trees grow.', nl: 'Eekhoorns verstoppen hazelnoten en vergeten er een paar, zo groeien nieuwe bomen.' } },
  { slug: 'sunflower-seeds', name: { en: 'Sunflower seeds', nl: 'Zonnebloempitten' }, category: 'nut_seed', color: 'yellow', family: 'Asteraceae', superfood: false, image: require('@/assets/plants/sunflower-seeds.png'),
    fact: { en: 'One sunflower head can hold 2,000 seeds.', nl: 'In één zonnebloem zitten wel 2.000 pitten.' } },
  { slug: 'sesame-seeds', name: { en: 'Sesame seeds', nl: 'Sesamzaad' }, category: 'nut_seed', color: 'white', family: 'Pedaliaceae', superfood: false, image: require('@/assets/plants/sesame-seeds.png'),
    fact: { en: '"Open sesame" comes from sesame pods that pop open when ripe.', nl: '"Sesam, open u" komt van sesampeulen die openspringen als ze rijp zijn.' } },
  { slug: 'pumpkin-seeds', name: { en: 'Pumpkin seeds', nl: 'Pompoenpitten' }, category: 'nut_seed', color: 'green', family: 'Cucurbitaceae', superfood: true, image: require('@/assets/plants/pumpkin-seeds.png'),
    fact: { en: 'Pumpkin seeds are green inside their white shell.', nl: 'Pompoenpitten zijn groen onder hun witte schil.' } },

  // ── Legumes ───────────────────────────────────────────────────────────────────────────────
  { slug: 'chickpeas', name: { en: 'Chickpeas', nl: 'Kikkererwten' }, category: 'legume', color: 'yellow', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/chickpeas.png'),
    fact: { en: 'Hummus is made of mashed chickpeas.', nl: 'Hummus is gemaakt van geprakte kikkererwten.' } },
  { slug: 'green-lentils', name: { en: 'Green lentils', nl: 'Groene linzen' }, category: 'legume', color: 'green', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/green-lentils.png'),
    fact: { en: 'People have farmed lentils for more than 8,000 years.', nl: 'Mensen verbouwen al meer dan 8.000 jaar linzen.' } },
  { slug: 'red-lentils', name: { en: 'Red lentils', nl: 'Rode linzen' }, category: 'legume', color: 'orange', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/red-lentils.png'),
    fact: { en: 'Red lentils turn yellow when you cook them.', nl: 'Rode linzen worden geel als je ze kookt.' } },
  { slug: 'kidney-bean', name: { en: 'Kidney beans', nl: 'Kidneybonen' }, category: 'legume', color: 'red', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/kidney-beans.png'),
    fact: { en: 'Kidney beans are named after their shape. They look like tiny kidneys.', nl: 'Kidneybonen heten zo omdat ze op kleine niertjes lijken.' } },
  { slug: 'black-bean', name: { en: 'Black beans', nl: 'Zwarte bonen' }, category: 'legume', color: 'brown', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/black-beans.png'),
    fact: { en: 'Black beans turn the water they cook in dark purple.', nl: 'Zwarte bonen kleuren hun kookwater donkerpaars.' } },
  { slug: 'white-bean', name: { en: 'White beans', nl: 'Witte bonen' }, category: 'legume', color: 'white', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/white-bean.png'),
    fact: { en: 'A dried bean can sleep for years and still sprout.', nl: 'Een gedroogde boon kan jaren slapen en dan nog ontkiemen.' } },
  { slug: 'edamame', name: { en: 'Edamame', nl: 'Edamame' }, category: 'legume', color: 'green', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/edamame.png'),
    fact: { en: 'Edamame are young soybeans, still soft and green.', nl: 'Edamame zijn jonge sojabonen, nog zacht en groen.' } },
  { slug: 'tofu', name: { en: 'Tofu', nl: 'Tofu' }, category: 'legume', color: 'white', family: 'Fabaceae', superfood: false, image: require('@/assets/plants/tofu.png'),
    fact: { en: 'Tofu is made from soy milk the way cheese is made from milk.', nl: 'Tofu wordt van sojamelk gemaakt, zoals kaas van melk.' } },

  // ── Whole grains ──────────────────────────────────────────────────────────────────────────
  { slug: 'oats', name: { en: 'Oats', nl: 'Haver' }, category: 'whole_grain', color: 'brown', family: 'Poaceae', superfood: true, image: require('@/assets/plants/oats.png'),
    fact: { en: 'Horses love oats as much as we do.', nl: 'Paarden houden net zo veel van haver als wij.' } },
  { slug: 'wheat', name: { en: 'Whole wheat', nl: 'Volkoren tarwe' }, category: 'whole_grain', color: 'yellow', family: 'Poaceae', superfood: false, image: require('@/assets/plants/wheat.png'),
    fact: { en: 'One wheat plant makes about 50 grains, and a loaf needs thousands.', nl: 'Eén tarweplant maakt ongeveer 50 korrels, en voor een brood heb je er duizenden nodig.' } },
  { slug: 'brown-rice', name: { en: 'Brown rice', nl: 'Zilvervliesrijst' }, category: 'whole_grain', color: 'brown', family: 'Poaceae', superfood: false, image: require('@/assets/plants/brown-rice.png'),
    fact: { en: 'Brown rice is white rice that kept its coat on.', nl: 'Zilvervliesrijst is witte rijst die zijn jasje aanhield.' } },
  { slug: 'quinoa', name: { en: 'Quinoa', nl: 'Quinoa' }, category: 'whole_grain', color: 'white', family: 'Amaranthaceae', superfood: true, image: require('@/assets/plants/quinoa.png'),
    fact: { en: 'Quinoa is a seed, not a grain, and it comes from the Andes mountains.', nl: 'Quinoa is een zaadje, geen graan, en komt uit het Andesgebergte.' } },
  { slug: 'spelt', name: { en: 'Spelt', nl: 'Spelt' }, category: 'whole_grain', color: 'brown', family: 'Poaceae', superfood: false, image: require('@/assets/plants/spelt.png'),
    fact: { en: 'Spelt is an ancient cousin of wheat that the Romans already ate.', nl: 'Spelt is een oud neefje van tarwe dat de Romeinen al aten.' } },
  { slug: 'buckwheat', name: { en: 'Buckwheat', nl: 'Boekweit' }, category: 'whole_grain', color: 'brown', family: 'Polygonaceae', superfood: true, image: require('@/assets/plants/buckwheat.png'),
    fact: { en: 'Buckwheat is not wheat at all. It is family of rhubarb.', nl: 'Boekweit is helemaal geen tarwe. Het is familie van rabarber.' } },
  { slug: 'rye', name: { en: 'Rye', nl: 'Rogge' }, category: 'whole_grain', color: 'brown', family: 'Poaceae', superfood: false, image: require('@/assets/plants/rye.png'),
    fact: { en: 'Rye grows where it is too cold for wheat.', nl: 'Rogge groeit waar het te koud is voor tarwe.' } },

  // ── Ferments ──────────────────────────────────────────────────────────────────────────────
  { slug: 'yogurt', name: { en: 'Yogurt', nl: 'Yoghurt' }, category: 'ferment', color: 'white', family: null, superfood: false, image: require('@/assets/plants/yogurt.png'),
    fact: { en: 'Yogurt is milk that friendly bacteria turned thick and sour.', nl: 'Yoghurt is melk die door vriendelijke bacteriën dik en zuur werd.' } },
  { slug: 'sourdough-bread', name: { en: 'Sourdough bread', nl: 'Zuurdesembrood' }, category: 'ferment', color: 'brown', family: 'Poaceae', superfood: false, image: require('@/assets/plants/sourdough-bread.png'),
    fact: { en: 'Sourdough rises with wild yeast caught from the air.', nl: 'Zuurdesem rijst door wilde gist die uit de lucht komt.' } },
  { slug: 'kefir', name: { en: 'Kefir', nl: 'Kefir' }, category: 'ferment', color: 'white', family: null, superfood: true, image: require('@/assets/plants/kefir.png'),
    fact: { en: 'Kefir is made with grains that look like tiny cauliflowers.', nl: 'Kefir wordt gemaakt met korrels die op mini-bloemkooltjes lijken.' } },
  { slug: 'sauerkraut', name: { en: 'Sauerkraut', nl: 'Zuurkool' }, category: 'ferment', color: 'white', family: null, superfood: false, image: require('@/assets/plants/sauerkraut.png'),
    fact: { en: 'Sauerkraut is cabbage that pickled itself with a bit of salt.', nl: 'Zuurkool is kool die zichzelf met een beetje zout heeft ingemaakt.' } },
  { slug: 'kimchi', name: { en: 'Kimchi', nl: 'Kimchi' }, category: 'ferment', color: 'red', family: 'Brassicaceae', superfood: true, image: require('@/assets/plants/kimchi.png'),
    fact: { en: 'Kimchi is cabbage that has been bubbling away for weeks.', nl: 'Kimchi is kool die wekenlang heeft staan pruttelen.' } },
  { slug: 'miso', name: { en: 'Miso', nl: 'Miso' }, category: 'ferment', color: 'brown', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/miso.png'),
    fact: { en: 'Miso can age for years before it is eaten.', nl: 'Miso kan jaren rijpen voordat het wordt gegeten.' } },
  { slug: 'tempeh', name: { en: 'Tempeh', nl: 'Tempeh' }, category: 'ferment', color: 'brown', family: 'Fabaceae', superfood: true, image: require('@/assets/plants/tempeh.png'),
    fact: { en: 'Tempeh is soybeans knitted together by a friendly mould.', nl: 'Tempeh is sojabonen die door een vriendelijke schimmel aan elkaar zijn gebreid.' } },
];

export const PLANT_BY_SLUG: Record<string, Plant> = Object.fromEntries(PLANTS.map((p) => [p.slug, p]));
