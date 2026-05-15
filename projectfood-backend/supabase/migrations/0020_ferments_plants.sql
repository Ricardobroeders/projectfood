-- Recategorize existing plants to ferment (kimchi was vegetable, tempeh was legume)
UPDATE plants SET category = 'ferment', subcategory = 'fermented_vegetable' WHERE slug = 'kimchi';
UPDATE plants SET category = 'ferment', subcategory = 'fermented_soybean'   WHERE slug = 'tempeh';

-- Insert 6 new ferment plants (kimchi already existed as vegetable)
INSERT INTO plants (slug, name, emoji, category, subcategory, color, botanical_family, search_aliases) VALUES
('kombucha',        'Kombucha',        '🍵', 'ferment', 'fermented_beverage',  'brown', NULL,       '{"kombucha","gefermenteerde thee","tè fermentato","fermented tea"}'),
('sauerkraut',      'Sauerkraut',      '🥬', 'ferment', 'fermented_vegetable', 'white', NULL,       '{"sauerkraut","zuurkool","crauti","fermented cabbage","choucroute"}'),
('yogurt',          'Yogurt',          '🥛', 'ferment', 'fermented_dairy',     'white', NULL,       '{"yogurt","yoghurt","yogurt greco","greek yogurt","plain yogurt"}'),
('kefir',           'Kefir',           '🥛', 'ferment', 'fermented_dairy',     'white', NULL,       '{"kefir","kefir melk","kefir latte","fermented milk","milk kefir"}'),
('miso',            'Miso',            '🍜', 'ferment', 'fermented_soybean',   'brown', 'Fabaceae', '{"miso","miso pasta","pasta di miso","miso soup","shiro miso","hatcho miso"}'),
('sourdough-bread', 'Sourdough Bread', '🍞', 'ferment', 'fermented_grain',     'brown', 'Poaceae',  '{"sourdough bread","zuurdesembrood","pane a lievitazione naturale","sourdough","desem"}');

-- Insert translations for 6 new plants (kimchi and tempeh already have translations)
INSERT INTO plant_translations (plant_id, locale, name)
SELECT p.id, t.locale, t.tname
FROM plants p
JOIN (VALUES
  ('kombucha',        'en', 'Kombucha'),
  ('kombucha',        'nl', 'Kombucha'),
  ('kombucha',        'it', 'Kombucha'),
  ('sauerkraut',      'en', 'Sauerkraut'),
  ('sauerkraut',      'nl', 'Zuurkool'),
  ('sauerkraut',      'it', 'Crauti'),
  ('yogurt',          'en', 'Yogurt'),
  ('yogurt',          'nl', 'Yoghurt'),
  ('yogurt',          'it', 'Yogurt'),
  ('kefir',           'en', 'Kefir'),
  ('kefir',           'nl', 'Kefir'),
  ('kefir',           'it', 'Kefir'),
  ('miso',            'en', 'Miso'),
  ('miso',            'nl', 'Miso'),
  ('miso',            'it', 'Miso'),
  ('sourdough-bread', 'en', 'Sourdough Bread'),
  ('sourdough-bread', 'nl', 'Zuurdesembrood'),
  ('sourdough-bread', 'it', 'Pane a lievitazione naturale')
) AS t(slug, locale, tname) ON p.slug = t.slug
ON CONFLICT (plant_id, locale) DO UPDATE SET name = EXCLUDED.name;
