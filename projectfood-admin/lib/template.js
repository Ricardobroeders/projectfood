// Pure helpers shared by server and browser (no secrets, no clients).

// OpenAI list price per 1024×1024 gpt-image-1 image, for estimates only.
export const PRICE = { low: 0.011, medium: 0.042, high: 0.167 };

export const PLACEHOLDERS = {
  plant: ['name', 'category', 'category_words', 'subcategory', 'subcategory_words', 'botanical_family', 'key'],
  manual: ['description', 'key'],
};

/** Sample inputs for the prompt preview on the Kinds page. */
export const SAMPLE_INPUTS = {
  plant: { key: 'kohlrabi', name: 'Kohlrabi', category: 'vegetable', subcategory: 'stem_vegetable', botanical_family: 'Brassicaceae' },
  manual: { key: 'streak-flame', description: 'a small friendly orange flame' },
};

export function slugify(s) {
  return String(s).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

const words = (s) => String(s ?? '').split('_').join(' ');

/** Fills {{placeholders}} from inputs; unknown placeholders stay visible so a typo shows. */
export function fill(template, inputs) {
  const values = { ...inputs, category_words: words(inputs.category), subcategory_words: words(inputs.subcategory) };
  return String(template).replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (m, k) => (values[k] != null && values[k] !== '' ? String(values[k]) : m));
}
