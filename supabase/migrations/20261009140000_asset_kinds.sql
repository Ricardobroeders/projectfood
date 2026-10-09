-- Asset kinds: the editable "flows" of the asset pipeline (admin app, 2026-10-09). A kind is the
-- data of one n8n lane: where inputs come from, the prompt template, the bucket and file name,
-- the default quality. The steps themselves are fixed in projectfood-admin/lib/pipeline.js.
create table if not exists public.asset_kinds (
  id               text primary key,                       -- slug, referenced by asset_jobs.kind
  label            text not null,
  source           text not null default 'manual' check (source in ('plant', 'manual')),
  prompt_template  text not null,                          -- {{name}}, {{category}}, {{category_words}}, {{subcategory}}, {{subcategory_words}}, {{botanical_family}}, {{description}}, {{key}}
  bucket           text not null,
  path_template    text not null,                          -- e.g. gold/{{key}}.png
  quality          text not null default 'medium' check (quality in ('low', 'medium', 'high')),
  model            text not null default 'gpt-image-1',
  background       text not null default 'transparent' check (background in ('transparent', 'opaque', 'auto')),
  writes_plant_image boolean not null default false,       -- set plants.image_url when done
  sort_order       int not null default 100,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.asset_kinds enable row level security;

insert into public.asset_kinds (id, label, source, prompt_template, bucket, path_template, quality, writes_plant_image, sort_order) values
('plant', 'Plant render', 'plant',
 'A stylized 3D illustration of a {{name}} (from the {{subcategory}}, {{category}}, from the {{botanical_family}}), in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from above, very soft shadows, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end illustrated product render — NOT photorealistic, NOT a photograph. No text, no props, no extra elements, no background details.',
 'food-images', '{{key}}.png', 'medium', true, 10),
('gold', 'Gold plant render', 'plant',
 'A stylized 3D illustration of {{name}} (category: {{category_words}}, type: {{subcategory_words}}), cast entirely in solid gold. Identical form language to a soft clay-render or Pixar-like style: smooth surface with soft rounded edges and uniform, slightly chunky geometry, clean and friendly look. The whole subject is one single gold material, top to bottom, every part of it including any leaves, stem, skin or bowl, with no other colors anywhere. Warm yellow gold with a satin, lightly brushed finish: broad soft highlights along the upper edges, warm amber-to-bronze tones deep in the crevices, a subtle gradient from pale gold at the top to deeper gold underneath. Diffused studio lighting from above, very soft shadows, no harsh contrast, no mirror reflections, no reflected environment or horizon line. Keep the subject instantly recognizable by its silhouette and surface detail: slightly emphasize veins, ribs, seeds, folds and edges so the shape reads clearly without color. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end collectible figurine render, NOT photorealistic, NOT a photograph, NOT jewelry. No text, no props, no pedestal, no base, no plinth, no coin, no sparkles, no glitter, no light rays, no extra elements, no background details.',
 'food-images', 'gold/{{key}}.png', 'medium', false, 20),
('achievement', 'Achievement render', 'manual',
 'A stylized 3D illustration for an achievement thumbnail. The image shows a {{description}}, in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from above, very soft shadows, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end illustrated product render — NOT photorealistic, NOT a photograph. No text, no props, no extra elements, no background details.',
 'achievements', 'achievement-{{key}}.png', 'high', false, 30),
('ui', 'UI image', 'manual',
 'A stylized 3D illustration for an achievement thumbnail. The image shows {{description}}, in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from the top left, a small soft contact shadow under the object, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, symmetrical where natural. Minimalist, cute, high-end illustrated product render, NOT photorealistic, NOT a photograph. No text, no numbers, no extra elements, no background details.',
 'images', 'app-ui-images/{{key}}.png', 'high', false, 40)
on conflict (id) do nothing;

-- Jobs now point at a kind row; the prompt is resolved when the job is queued and may be edited
-- while it waits. Existing rows keep their kind ids, which match the seed.
alter table public.asset_jobs drop constraint if exists asset_jobs_kind_check;
alter table public.asset_jobs add constraint asset_jobs_kind_fkey foreign key (kind) references public.asset_kinds (id) on update cascade;
