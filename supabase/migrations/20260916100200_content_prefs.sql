-- 0003 five locales in the schema, plant facts for the detail page, notification preferences.

-- widen locale checks to en/nl/it/de/fr (drop whatever the old check was called) ------------
do $$
declare c record;
begin
  for c in
    select conname, conrelid::regclass as tbl
    from pg_constraint
    where contype = 'c'
      and conrelid in ('public.plant_translations'::regclass, 'public.user_settings'::regclass,
                       'public.survey_question_translations'::regclass)
      and pg_get_constraintdef(oid) ilike '%locale%'
  loop
    execute format('alter table %s drop constraint %I', c.tbl, c.conname);
  end loop;
end $$;
alter table public.plant_translations
  add constraint plant_translations_locale_check check (locale in ('en', 'nl', 'it', 'de', 'fr'));
alter table public.user_settings
  add constraint user_settings_locale_check check (locale in ('en', 'nl', 'it', 'de', 'fr'));
alter table public.survey_question_translations
  add constraint survey_question_translations_locale_check check (locale in ('en', 'nl', 'it', 'de', 'fr'));

-- plant facts: one kid fact + one parent tip per plant per locale (KB v1 feature 3) --------------
create table public.plant_facts (
  plant_id uuid not null references public.plants(id) on delete cascade,
  locale text not null check (locale in ('en', 'nl', 'it', 'de', 'fr')),
  kid_fact text not null,
  parent_tip text not null,
  status text not null default 'generated' check (status in ('generated', 'reviewed')),
  model text,
  generated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  primary key (plant_id, locale)
);
alter table public.plant_facts enable row level security;
create policy plant_facts_select on public.plant_facts for select to authenticated using (true);

-- notification preferences stay per user (the phone that holds the token) ---------------------
-- existing per-type flags are re-purposed:
--   notif_daily_reminder -> dinner question (essential)
--   notif_streak_rescue  -> streak keeper   (essential)
--   notif_weekly_nudge   -> Sunday family-30 nudge (marketing)
--   notif_reengagement   -> card teaser     (marketing)
alter table public.user_settings
  add column notif_essential boolean not null default true,
  add column notif_marketing boolean not null default false,
  add column notif_backoff_until date,
  add column push_prompt_at timestamptz;
update public.user_settings set notif_weekly_nudge = false, notif_reengagement = false;
