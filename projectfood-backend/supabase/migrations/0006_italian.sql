-- Add Italian locale support to existing check constraints
alter table user_settings
  drop constraint user_settings_locale_check,
  add constraint user_settings_locale_check check (locale in ('en', 'nl', 'it'));

alter table plant_translations
  drop constraint plant_translations_locale_check,
  add constraint plant_translations_locale_check check (locale in ('en', 'nl', 'it'));
