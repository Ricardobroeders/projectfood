-- 0005_i18n.sql
-- Adds locale preference to user_settings and a plant_translations table

-- Add locale column to user_settings (default 'en', must be a supported locale)
alter table user_settings
  add column locale text not null default 'en'
    check (locale in ('en', 'nl'));

-- Translation table: one row per plant per locale
create table plant_translations (
  plant_id   uuid  not null references plants (id) on delete cascade,
  locale     text  not null check (locale in ('en', 'nl')),
  name       text  not null,
  primary key (plant_id, locale)
);

create index idx_plant_translations_locale on plant_translations (locale);

-- Seed English translations from plants.name
insert into plant_translations (plant_id, locale, name)
select id, 'en', name from plants;

-- RLS: authenticated users can read, no client writes
alter table plant_translations enable row level security;

create policy "plant_translations_select"
  on plant_translations for select
  to authenticated
  using (true);
