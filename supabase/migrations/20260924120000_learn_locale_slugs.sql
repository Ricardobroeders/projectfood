-- Per-locale slugs for learn articles (SEO article routine, 2026-09-24).
-- learn_articles.slug stays the stable internal key (the folder under
-- projectfood-app/content/learn); the public URL segment lives per locale in
-- learn_article_content.slug. Existing rows get their shared slug copied in, so
-- /en/learn/plant-diversity and its cluster keep their indexed URLs.

alter table public.learn_article_content add column slug text;

update public.learn_article_content c
set slug = a.slug
from public.learn_articles a
where a.id = c.article_id and c.slug is null;

alter table public.learn_article_content alter column slug set not null;

alter table public.learn_article_content
  add constraint learn_article_content_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

create unique index learn_article_content_locale_slug_key
  on public.learn_article_content (locale, slug);
