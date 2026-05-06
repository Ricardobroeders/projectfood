-- seed.sql
-- Plant catalog — 155 entries across 6 categories
-- Omitting image_url and seasonality (v2 enrichment)

insert into plants (slug, name, emoji, category, subcategory, color, botanical_family, search_aliases) values

-- ══════════════════════════════════════════════════
-- FRUIT (37)
-- ══════════════════════════════════════════════════

-- Berry
('blueberry',        'Blueberry',        '🫐', 'fruit', 'berry',       'blue',   'Ericaceae',    '{"blueberries"}'),
('strawberry',       'Strawberry',       '🍓', 'fruit', 'berry',       'red',    'Rosaceae',     '{"strawberries"}'),
('raspberry',        'Raspberry',        '🍓', 'fruit', 'berry',       'red',    'Rosaceae',     '{"raspberries"}'),
('blackberry',       'Blackberry',       '🫐', 'fruit', 'berry',       'purple', 'Rosaceae',     '{"blackberries"}'),
('cranberry',        'Cranberry',        '🍒', 'fruit', 'berry',       'red',    'Ericaceae',    '{"cranberries"}'),
('goji-berry',       'Goji Berry',       '🔴', 'fruit', 'berry',       'red',    'Solanaceae',   '{"goji","wolfberry","goji berries"}'),
('acai-berry',       'Açaí Berry',       '🫐', 'fruit', 'berry',       'purple', 'Arecaceae',    '{"acai","açaí"}'),
('gooseberry',       'Gooseberry',       '🟢', 'fruit', 'berry',       'green',  'Grossulariaceae', '{"gooseberries"}'),

-- Citrus
('orange',           'Orange',           '🍊', 'fruit', 'citrus',      'orange', 'Rutaceae',     '{"navel orange","blood orange"}'),
('lemon',            'Lemon',            '🍋', 'fruit', 'citrus',      'yellow', 'Rutaceae',     '{"lemons"}'),
('lime',             'Lime',             '🍋', 'fruit', 'citrus',      'green',  'Rutaceae',     '{"key lime","persian lime"}'),
('grapefruit',       'Grapefruit',       '🍊', 'fruit', 'citrus',      'orange', 'Rutaceae',     '{"pomelo"}'),
('clementine',       'Clementine',       '🍊', 'fruit', 'citrus',      'orange', 'Rutaceae',     '{"mandarin","tangerine","satsuma"}'),

-- Apple / Pear
('red-apple',        'Red Apple',        '🍎', 'fruit', 'pome',        'red',    'Rosaceae',     '{"apple","gala","fuji","braeburn"}'),
('green-apple',      'Green Apple',      '🍏', 'fruit', 'pome',        'green',  'Rosaceae',     '{"granny smith","apple"}'),
('pear',             'Pear',             '🍐', 'fruit', 'pome',        'green',  'Rosaceae',     '{"conference pear","bosc","anjou"}'),

-- Stone fruit
('peach',            'Peach',            '🍑', 'fruit', 'stone_fruit', 'orange', 'Rosaceae',     '{"peaches","nectarine"}'),
('cherry',           'Cherry',           '🍒', 'fruit', 'stone_fruit', 'red',    'Rosaceae',     '{"cherries","sweet cherry"}'),
('plum',             'Plum',             '🫐', 'fruit', 'stone_fruit', 'purple', 'Rosaceae',     '{"plums","prune"}'),
('apricot',          'Apricot',          '🍑', 'fruit', 'stone_fruit', 'orange', 'Rosaceae',     '{"apricots"}'),
('mango',            'Mango',            '🥭', 'fruit', 'tropical',    'orange', 'Anacardiaceae','{"mangoes","alphonso"}'),

-- Tropical
('banana',           'Banana',           '🍌', 'fruit', 'tropical',    'yellow', 'Musaceae',     '{"bananas","plantain"}'),
('pineapple',        'Pineapple',        '🍍', 'fruit', 'tropical',    'yellow', 'Bromeliaceae', '{"pineapples"}'),
('papaya',           'Papaya',           '🧡', 'fruit', 'tropical',    'orange', 'Caricaceae',   '{"pawpaw","papaw"}'),
('kiwi',             'Kiwi',             '🥝', 'fruit', 'tropical',    'green',  'Actinidiaceae','{"kiwifruit","kiwi fruit"}'),
('passion-fruit',    'Passion Fruit',    '🟠', 'fruit', 'tropical',    'purple', 'Passifloraceae','{"passionfruit","maracuja"}'),
('guava',            'Guava',            '🟢', 'fruit', 'tropical',    'green',  'Myrtaceae',    '{"guavas"}'),
('dragon-fruit',     'Dragon Fruit',     '🐉', 'fruit', 'tropical',    'red',    'Cactaceae',    '{"pitaya","pitahaya"}'),
('lychee',           'Lychee',           '🔴', 'fruit', 'tropical',    'red',    'Sapindaceae',  '{"litchi","lichee"}'),

-- Melon
('watermelon',       'Watermelon',       '🍉', 'fruit', 'melon',       'red',    'Cucurbitaceae','{"watermelons"}'),
('cantaloupe',       'Cantaloupe',       '🍈', 'fruit', 'melon',       'orange', 'Cucurbitaceae','{"rockmelon","musk melon"}'),
('honeydew-melon',   'Honeydew Melon',   '🍈', 'fruit', 'melon',       'green',  'Cucurbitaceae','{"honeydew","green melon"}'),

-- Other
('grape',            'Grape',            '🍇', 'fruit', 'vine',        'purple', 'Vitaceae',     '{"grapes","red grape","green grape"}'),
('pomegranate',      'Pomegranate',      '🌹', 'fruit', 'other',       'red',    'Lythraceae',   '{"pomegranates"}'),
('fig',              'Fig',              '🟣', 'fruit', 'other',       'purple', 'Moraceae',     '{"figs","dried fig"}'),
('date',             'Date',             '🟤', 'fruit', 'other',       'brown',  'Arecaceae',    '{"dates","medjool","deglet noor"}'),
('avocado',          'Avocado',          '🥑', 'fruit', 'other',       'green',  'Lauraceae',    '{"avocados","avo"}'),

-- ══════════════════════════════════════════════════
-- VEGETABLE (45)
-- ══════════════════════════════════════════════════

-- Leafy greens
('spinach',          'Spinach',          '🥬', 'vegetable', 'leafy',       'green',  'Amaranthaceae','{"baby spinach"}'),
('kale',             'Kale',             '🥬', 'vegetable', 'leafy',       'green',  'Brassicaceae', '{"curly kale","cavolo nero","lacinato"}'),
('rocket',           'Rocket',           '🥬', 'vegetable', 'leafy',       'green',  'Brassicaceae', '{"arugula","roquette"}'),
('swiss-chard',      'Swiss Chard',      '🥬', 'vegetable', 'leafy',       'green',  'Amaranthaceae','{"chard","rainbow chard","silverbeet"}'),
('romaine-lettuce',  'Romaine Lettuce',  '🥬', 'vegetable', 'leafy',       'green',  'Asteraceae',   '{"cos lettuce","romaine"}'),
('watercress',       'Watercress',       '🥬', 'vegetable', 'leafy',       'green',  'Brassicaceae', '{"cress"}'),
('pak-choi',         'Pak Choi',         '🥬', 'vegetable', 'leafy',       'green',  'Brassicaceae', '{"bok choy","pak choy","chinese cabbage"}'),

-- Root
('carrot',           'Carrot',           '🥕', 'vegetable', 'root',        'orange', 'Apiaceae',     '{"carrots","baby carrot"}'),
('beetroot',         'Beetroot',         '🟣', 'vegetable', 'root',        'purple', 'Amaranthaceae','{"beet","red beet","beets"}'),
('parsnip',          'Parsnip',          '⬜', 'vegetable', 'root',        'white',  'Apiaceae',     '{"parsnips"}'),
('turnip',           'Turnip',           '⬜', 'vegetable', 'root',        'white',  'Brassicaceae', '{"turnips","neep","swede"}'),
('sweet-potato',     'Sweet Potato',     '🍠', 'vegetable', 'root',        'orange', 'Convolvulaceae','{"yam","kumara","sweet potatoes"}'),
('potato',           'Potato',           '🥔', 'vegetable', 'root',        'brown',  'Solanaceae',   '{"potatoes","spud","white potato"}'),
('celeriac',         'Celeriac',         '⬜', 'vegetable', 'root',        'white',  'Apiaceae',     '{"celery root","turnip-rooted celery"}'),
('radish',           'Radish',           '🔴', 'vegetable', 'root',        'red',    'Brassicaceae', '{"radishes","daikon","mooli"}'),

-- Brassica
('broccoli',         'Broccoli',         '🥦', 'vegetable', 'brassica',    'green',  'Brassicaceae', '{"broccoli florets","tenderstem"}'),
('cauliflower',      'Cauliflower',      '⬜', 'vegetable', 'brassica',    'white',  'Brassicaceae', '{"cauliflowers"}'),
('cabbage',          'Cabbage',          '🥬', 'vegetable', 'brassica',    'green',  'Brassicaceae', '{"green cabbage","red cabbage","savoy"}'),
('brussels-sprouts', 'Brussels Sprouts', '🥦', 'vegetable', 'brassica',    'green',  'Brassicaceae', '{"brussel sprouts","sprouts"}'),
('kohlrabi',         'Kohlrabi',         '🟢', 'vegetable', 'brassica',    'green',  'Brassicaceae', '{"german turnip"}'),

-- Allium
('onion',            'Onion',            '🧅', 'vegetable', 'allium',      'brown',  'Amaryllidaceae','{"red onion","white onion","yellow onion"}'),
('garlic',           'Garlic',           '🧄', 'vegetable', 'allium',      'white',  'Amaryllidaceae','{"garlic clove","black garlic"}'),
('leek',             'Leek',             '🥬', 'vegetable', 'allium',      'green',  'Amaryllidaceae','{"leeks"}'),
('spring-onion',     'Spring Onion',     '🌿', 'vegetable', 'allium',      'green',  'Amaryllidaceae','{"scallion","green onion","salad onion"}'),
('shallot',          'Shallot',          '🧅', 'vegetable', 'allium',      'brown',  'Amaryllidaceae','{"shallots","echalion"}'),

-- Nightshade
('tomato',           'Tomato',           '🍅', 'vegetable', 'nightshade',  'red',    'Solanaceae',   '{"tomatoes","cherry tomato","plum tomato"}'),
('red-pepper',       'Red Pepper',       '🌶️', 'vegetable', 'nightshade',  'red',    'Solanaceae',   '{"red bell pepper","capsicum"}'),
('yellow-pepper',    'Yellow Pepper',    '🫑', 'vegetable', 'nightshade',  'yellow', 'Solanaceae',   '{"yellow bell pepper","capsicum"}'),
('green-pepper',     'Green Pepper',     '🫑', 'vegetable', 'nightshade',  'green',  'Solanaceae',   '{"green bell pepper","capsicum"}'),
('aubergine',        'Aubergine',        '🍆', 'vegetable', 'nightshade',  'purple', 'Solanaceae',   '{"eggplant","brinjal"}'),
('chilli',           'Chilli',           '🌶️', 'vegetable', 'nightshade',  'red',    'Solanaceae',   '{"chili","hot pepper","jalapeno","habanero"}'),

-- Gourd / Squash
('courgette',        'Courgette',        '🥒', 'vegetable', 'gourd',       'green',  'Cucurbitaceae','{"zucchini"}'),
('butternut-squash', 'Butternut Squash', '🎃', 'vegetable', 'gourd',       'orange', 'Cucurbitaceae','{"butternut pumpkin"}'),
('pumpkin',          'Pumpkin',          '🎃', 'vegetable', 'gourd',       'orange', 'Cucurbitaceae','{"pumpkins","kabocha"}'),
('cucumber',         'Cucumber',         '🥒', 'vegetable', 'gourd',       'green',  'Cucurbitaceae','{"cucumbers"}'),

-- Other vegetables
('celery',           'Celery',           '🥬', 'vegetable', 'stalk',       'green',  'Apiaceae',     '{"celery sticks"}'),
('asparagus',        'Asparagus',        '🌿', 'vegetable', 'stalk',       'green',  'Asparagaceae', '{"asparagus spears"}'),
('artichoke',        'Artichoke',        '🌿', 'vegetable', 'flower',      'green',  'Asteraceae',   '{"globe artichoke","jerusalem artichoke"}'),
('corn',             'Corn',             '🌽', 'vegetable', 'grain',       'yellow', 'Poaceae',      '{"sweetcorn","maize","corn on the cob"}'),
('mushroom',         'Mushroom',         '🍄', 'vegetable', 'fungus',      'brown',  'Fungi',        '{"chestnut mushroom","portobello","shiitake","oyster mushroom"}'),
('fennel',           'Fennel',           '🌿', 'vegetable', 'bulb',        'white',  'Apiaceae',     '{"florence fennel","finocchio"}'),
('okra',             'Okra',             '🟢', 'vegetable', 'other',       'green',  'Malvaceae',    '{"ladies fingers","gumbo","bhindi"}'),
('pea',              'Pea',              '🟢', 'vegetable', 'pod',         'green',  'Fabaceae',     '{"garden peas","sugar snap peas","mangetout","snow peas"}'),
('green-bean',       'Green Bean',       '🫘', 'vegetable', 'pod',         'green',  'Fabaceae',     '{"french bean","string bean","runner bean","haricot vert"}'),
('sweetcorn',        'Baby Corn',        '🌽', 'vegetable', 'grain',       'yellow', 'Poaceae',      '{"mini corn","baby sweetcorn"}'),

-- ══════════════════════════════════════════════════
-- HERB / SPICE (20)
-- ══════════════════════════════════════════════════

('basil',            'Basil',            '🌿', 'herb', 'soft_herb',   'green',  'Lamiaceae',    '{"sweet basil","thai basil","holy basil"}'),
('mint',             'Mint',             '🌿', 'herb', 'soft_herb',   'green',  'Lamiaceae',    '{"spearmint","peppermint","fresh mint"}'),
('parsley',          'Parsley',          '🌿', 'herb', 'soft_herb',   'green',  'Apiaceae',     '{"flat leaf parsley","curly parsley","italian parsley"}'),
('coriander',        'Coriander',        '🌿', 'herb', 'soft_herb',   'green',  'Apiaceae',     '{"cilantro","chinese parsley"}'),
('chives',           'Chives',           '🌿', 'herb', 'soft_herb',   'green',  'Amaryllidaceae','{"chive"}'),
('dill',             'Dill',             '🌿', 'herb', 'soft_herb',   'green',  'Apiaceae',     '{"dill weed"}'),
('tarragon',         'Tarragon',         '🌿', 'herb', 'soft_herb',   'green',  'Asteraceae',   '{"french tarragon","estragon"}'),
('thyme',            'Thyme',            '🌿', 'herb', 'woody_herb',  'green',  'Lamiaceae',    '{"fresh thyme","lemon thyme"}'),
('rosemary',         'Rosemary',         '🌿', 'herb', 'woody_herb',  'green',  'Lamiaceae',    '{"fresh rosemary"}'),
('oregano',          'Oregano',          '🌿', 'herb', 'woody_herb',  'green',  'Lamiaceae',    '{"dried oregano","marjoram"}'),
('sage',             'Sage',             '🌿', 'herb', 'woody_herb',  'green',  'Lamiaceae',    '{"fresh sage"}'),
('bay-leaf',         'Bay Leaf',         '🍃', 'herb', 'woody_herb',  'green',  'Lauraceae',    '{"bay leaves","dried bay"}'),
('ginger',           'Ginger',           '🫚', 'herb', 'root_spice',  'yellow', 'Zingiberaceae','{"fresh ginger","ginger root","ground ginger"}'),
('turmeric',         'Turmeric',         '🟡', 'herb', 'root_spice',  'orange', 'Zingiberaceae','{"fresh turmeric","ground turmeric","curcumin"}'),
('galangal',         'Galangal',         '🟤', 'herb', 'root_spice',  'brown',  'Zingiberaceae','{"galangal root","thai ginger"}'),
('lemongrass',       'Lemongrass',       '🌿', 'herb', 'stalk_spice', 'green',  'Poaceae',      '{"lemon grass","citronella"}'),
('cardamom',         'Cardamom',         '🟢', 'herb', 'seed_spice',  'green',  'Zingiberaceae','{"cardamon","elaichi"}'),
('cinnamon',         'Cinnamon',         '🟤', 'herb', 'bark_spice',  'brown',  'Lauraceae',    '{"ceylon cinnamon","cassia"}'),
('black-pepper',     'Black Pepper',     '⚫', 'herb', 'seed_spice',  'brown',  'Piperaceae',   '{"peppercorn","ground pepper"}'),
('chilli-flakes',    'Chilli Flakes',    '🌶️', 'herb', 'seed_spice',  'red',    'Solanaceae',   '{"red pepper flakes","dried chilli","crushed chilli"}'),

-- ══════════════════════════════════════════════════
-- NUT / SEED (25)
-- ══════════════════════════════════════════════════

('almond',           'Almond',           '🌰', 'nut_seed', 'nut',  'brown',  'Rosaceae',     '{"almonds","whole almond","flaked almond","almond flour"}'),
('walnut',           'Walnut',           '🌰', 'nut_seed', 'nut',  'brown',  'Juglandaceae', '{"walnuts","english walnut"}'),
('cashew',           'Cashew',           '🌰', 'nut_seed', 'nut',  'white',  'Anacardiaceae','{"cashews","cashew nut"}'),
('pecan',            'Pecan',            '🌰', 'nut_seed', 'nut',  'brown',  'Juglandaceae', '{"pecans"}'),
('hazelnut',         'Hazelnut',         '🌰', 'nut_seed', 'nut',  'brown',  'Betulaceae',   '{"hazelnuts","cobnuts","filberts"}'),
('pistachio',        'Pistachio',        '🟢', 'nut_seed', 'nut',  'green',  'Anacardiaceae','{"pistachios","pistachio nut"}'),
('macadamia',        'Macadamia',        '🌰', 'nut_seed', 'nut',  'white',  'Proteaceae',   '{"macadamia nut","macadamias"}'),
('brazil-nut',       'Brazil Nut',       '🌰', 'nut_seed', 'nut',  'brown',  'Lecythidaceae','{"brazil nuts","para nut"}'),
('pine-nut',         'Pine Nut',         '🌰', 'nut_seed', 'nut',  'white',  'Pinaceae',     '{"pine nuts","pignoli","pignolia"}'),
('coconut',          'Coconut',          '🥥', 'nut_seed', 'nut',  'brown',  'Arecaceae',    '{"coconut flesh","desiccated coconut","coconut flakes"}'),
('chia-seed',        'Chia Seed',        '⚫', 'nut_seed', 'seed', 'brown',  'Lamiaceae',    '{"chia seeds","chia"}'),
('flaxseed',         'Flaxseed',         '🟤', 'nut_seed', 'seed', 'brown',  'Linaceae',     '{"linseed","flax seed","ground flax"}'),
('pumpkin-seeds',    'Pumpkin Seeds',    '🌱', 'nut_seed', 'seed', 'green',  'Cucurbitaceae','{"pepitas","pumpkin seed"}'),
('sunflower-seeds',  'Sunflower Seeds',  '🌻', 'nut_seed', 'seed', 'yellow', 'Asteraceae',   '{"sunflower seed"}'),
('sesame-seeds',     'Sesame Seeds',     '⬜', 'nut_seed', 'seed', 'white',  'Pedaliaceae',  '{"sesame","tahini seeds","til"}'),
('hemp-seeds',       'Hemp Seeds',       '🌱', 'nut_seed', 'seed', 'green',  'Cannabaceae',  '{"hemp hearts","shelled hemp"}'),
('poppy-seeds',      'Poppy Seeds',      '⚫', 'nut_seed', 'seed', 'brown',  'Papaveraceae', '{"poppy seed"}'),
('nigella-seeds',    'Nigella Seeds',    '⚫', 'nut_seed', 'seed', 'brown',  'Ranunculaceae','{"black seed","kalonji","black cumin"}'),
('psyllium-husk',    'Psyllium Husk',    '🌾', 'nut_seed', 'seed', 'brown',  'Plantaginaceae','{"ispaghula","psyllium"}'),
('cacao-nibs',       'Cacao Nibs',       '🍫', 'nut_seed', 'seed', 'brown',  'Malvaceae',    '{"cocoa nibs","cacao"}'),
('tahini',           'Tahini',           '🟡', 'nut_seed', 'seed', 'brown',  'Pedaliaceae',  '{"sesame paste","sesame butter"}'),
('peanut',           'Peanut',           '🥜', 'nut_seed', 'nut',  'brown',  'Fabaceae',     '{"peanuts","groundnut","monkey nut"}'),
('almond-butter',    'Almond Butter',    '🌰', 'nut_seed', 'nut',  'brown',  'Rosaceae',     '{"almond spread"}'),
('sunflower-butter', 'Sunflower Butter', '🌻', 'nut_seed', 'seed', 'yellow', 'Asteraceae',   '{"sunbutter","sunflower seed butter"}'),
('watermelon-seeds', 'Watermelon Seeds', '🌱', 'nut_seed', 'seed', 'brown',  'Cucurbitaceae','{"egusi"}'),

-- ══════════════════════════════════════════════════
-- LEGUME (15)
-- ══════════════════════════════════════════════════

('green-lentils',    'Green Lentils',    '🫘', 'legume', 'lentil',  'green',  'Fabaceae', '{"puy lentils","french lentils","beluga lentils"}'),
('red-lentils',      'Red Lentils',      '🫘', 'legume', 'lentil',  'orange', 'Fabaceae', '{"split red lentils","masoor dal"}'),
('chickpea',         'Chickpeas',        '🫘', 'legume', 'bean',    'yellow', 'Fabaceae', '{"garbanzo beans","ceci beans","chana"}'),
('black-bean',       'Black Beans',      '🫘', 'legume', 'bean',    'brown',  'Fabaceae', '{"black turtle beans","frijoles negros"}'),
('kidney-bean',      'Kidney Beans',     '🫘', 'legume', 'bean',    'red',    'Fabaceae', '{"red kidney beans","borlotti beans"}'),
('cannellini-bean',  'Cannellini Beans', '⬜', 'legume', 'bean',    'white',  'Fabaceae', '{"white kidney beans","italian white beans"}'),
('butter-bean',      'Butter Beans',     '🫘', 'legume', 'bean',    'white',  'Fabaceae', '{"lima beans","large white beans"}'),
('edamame',          'Edamame',          '🫘', 'legume', 'soybean', 'green',  'Fabaceae', '{"edamame beans","young soybean"}'),
('tofu',             'Tofu',             '⬜', 'legume', 'soybean', 'white',  'Fabaceae', '{"bean curd","firm tofu","silken tofu"}'),
('tempeh',           'Tempeh',           '🟤', 'legume', 'soybean', 'brown',  'Fabaceae', '{"fermented soy"}'),
('split-peas',       'Split Peas',       '🫘', 'legume', 'pea',     'yellow', 'Fabaceae', '{"yellow split peas","green split peas","dal"}'),
('mung-bean',        'Mung Beans',       '🟢', 'legume', 'bean',    'green',  'Fabaceae', '{"moong","green gram","mung bean sprouts"}'),
('adzuki-bean',      'Adzuki Beans',     '🟤', 'legume', 'bean',    'red',    'Fabaceae', '{"azuki","red bean","aduki"}'),
('pinto-bean',       'Pinto Beans',      '🫘', 'legume', 'bean',    'brown',  'Fabaceae', '{"speckled beans","frijoles pintos"}'),
('fava-bean',        'Fava Beans',       '🫘', 'legume', 'bean',    'green',  'Fabaceae', '{"broad beans","field beans","habas"}'),

-- ══════════════════════════════════════════════════
-- WHOLE GRAIN (15)
-- ══════════════════════════════════════════════════

('oats',             'Oats',             '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"rolled oats","oatmeal","porridge oats","steel cut oats"}'),
('quinoa',           'Quinoa',           '🌾', 'whole_grain', 'pseudo_cereal', 'white', 'Amaranthaceae','{"red quinoa","black quinoa","tri-colour quinoa"}'),
('brown-rice',       'Brown Rice',       '🍚', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"wholegrain rice","whole grain rice"}'),
('buckwheat',        'Buckwheat',        '🌾', 'whole_grain', 'pseudo_cereal', 'brown', 'Polygonaceae', '{"kasha","buckwheat groats","soba"}'),
('barley',           'Barley',           '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"pearl barley","hulled barley","pot barley"}'),
('millet',           'Millet',           '🌾', 'whole_grain', 'grain', 'yellow', 'Poaceae',           '{"pearl millet","finger millet","foxtail millet"}'),
('amaranth',         'Amaranth',         '🌾', 'whole_grain', 'pseudo_cereal', 'brown', 'Amaranthaceae','{"amaranth grain","kiwicha"}'),
('spelt',            'Spelt',            '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"spelt berries","dinkel"}'),
('freekeh',          'Freekeh',          '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"farik","green wheat"}'),
('farro',            'Farro',            '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"emmer wheat","einkorn"}'),
('rye',              'Rye',              '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"rye grain","rye berries","pumpernickel"}'),
('wild-rice',        'Wild Rice',        '🍚', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"wild rice blend"}'),
('teff',             'Teff',             '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"teff grain","injera grain"}'),
('sorghum',          'Sorghum',          '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"jowar","milo","great millet"}'),
('bulgur-wheat',     'Bulgur Wheat',     '🌾', 'whole_grain', 'grain', 'brown',  'Poaceae',           '{"bulgur","cracked wheat","tabbouleh grain"}');
