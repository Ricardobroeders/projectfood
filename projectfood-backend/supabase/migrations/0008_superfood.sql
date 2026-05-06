-- 0008_superfood.sql
-- Add is_superfood flag to plants catalog

alter table plants
  add column if not exists is_superfood boolean not null default false;

create index if not exists idx_plants_superfood on plants (id) where is_superfood = true;
