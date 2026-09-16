-- 0002 plant_logs gets the member dimension. Backfills one household + one adult member per
-- existing auth user, keeps the legacy PWA insert working through a BEFORE INSERT trigger,
-- and swaps the unique key to (member_id, plant_id, logged_on).

alter table public.plant_logs
  add column member_id uuid references public.household_members(id) on delete cascade,
  add column household_id uuid references public.households(id) on delete cascade;

-- backfill ---------------------------------------------------------------
insert into public.households (created_by, timezone)
select u.id,
       case when us.timezone is null or us.timezone = 'UTC' then 'Europe/Amsterdam' else us.timezone end
from auth.users u
left join public.user_settings us on us.user_id = u.id;

insert into public.household_users (household_id, user_id, role)
select id, created_by, 'owner' from public.households;

insert into public.household_members (household_id, user_id, name, kind, color_index, sort_order)
select h.id, h.created_by,
       left(coalesce(nullif(us.username, ''),
                     nullif(u.raw_user_meta_data->>'given_name', ''),
                     nullif(split_part(u.raw_user_meta_data->>'full_name', ' ', 1), ''),
                     nullif(split_part(u.email, '@', 1), ''),
                     'Me'), 20),
       'adult', 0, 0
from public.households h
join auth.users u on u.id = h.created_by
left join public.user_settings us on us.user_id = u.id;

update public.plant_logs l
set member_id = m.id, household_id = m.household_id
from public.household_members m
where m.user_id = l.user_id;

do $$
declare n int;
begin
  select count(*) into n from public.plant_logs where member_id is null or household_id is null;
  if n > 0 then raise exception 'backfill left % plant_logs rows without a member', n; end if;
end $$;

-- legacy writer support: the PWA inserts (user_id, plant_id, logged_on) only ------------------
create or replace function public.plant_logs_fill_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is null then new.user_id := auth.uid(); end if;
  if new.member_id is null then
    select id into new.member_id from household_members
    where user_id = new.user_id and archived_at is null limit 1;
    if new.member_id is null then
      raise exception 'no household member for user %', new.user_id;
    end if;
  end if;
  if new.household_id is null then
    select household_id into new.household_id from household_members where id = new.member_id;
  end if;
  return new;
end $$;
create trigger trg_plant_logs_fill_member before insert on public.plant_logs
  for each row execute function public.plant_logs_fill_member();

alter table public.plant_logs
  alter column member_id set not null,
  alter column household_id set not null;

alter table public.plant_logs drop constraint plant_logs_user_id_plant_id_logged_on_key;
alter table public.plant_logs add constraint plant_logs_member_plant_day_key unique (member_id, plant_id, logged_on);
create index idx_logs_household_day on public.plant_logs (household_id, logged_on desc);
create index idx_logs_member_plant on public.plant_logs (member_id, plant_id);

-- RLS: household-scoped; plant_logs_select_friends stays (social deferred, tables kept) -------
drop policy plant_logs_select_own on public.plant_logs;
drop policy plant_logs_insert_own on public.plant_logs;
drop policy plant_logs_delete_own on public.plant_logs;
create policy plant_logs_select_hh on public.plant_logs for select to authenticated
  using (user_id = auth.uid() or public.is_household_member(household_id));
create policy plant_logs_insert_hh on public.plant_logs for insert to authenticated
  with check (user_id = auth.uid() and public.is_household_member(household_id));
create policy plant_logs_delete_hh on public.plant_logs for delete to authenticated
  using (public.is_household_member(household_id));

-- new signups (PWA and app) get a household immediately; timezone uses the column default -----
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  hid uuid;
  display text;
begin
  insert into user_settings (user_id) values (new.id) on conflict (user_id) do nothing;
  display := left(coalesce(nullif(new.raw_user_meta_data->>'given_name', ''),
                           nullif(split_part(new.raw_user_meta_data->>'full_name', ' ', 1), ''),
                           nullif(split_part(new.email, '@', 1), ''),
                           'Me'), 20);
  insert into households (created_by) values (new.id) returning id into hid;
  insert into household_users (household_id, user_id, role) values (hid, new.id, 'owner');
  insert into household_members (household_id, user_id, name, kind) values (hid, new.id, display, 'adult');
  return new;
end $$;

update public.user_settings set timezone = 'Europe/Amsterdam' where timezone = 'UTC';
