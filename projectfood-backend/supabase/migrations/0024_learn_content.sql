-- Learn content: pillar + cluster article system for SEO/GEO authority

CREATE TYPE article_type AS ENUM ('pillar', 'cluster');

CREATE TABLE learn_articles (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text          UNIQUE NOT NULL,
  type             article_type  NOT NULL,
  pillar_id        uuid          REFERENCES learn_articles(id) ON DELETE CASCADE,
  display_order    int           NOT NULL DEFAULT 0,
  emoji            text,
  cover_image_url  text,
  is_published     boolean       NOT NULL DEFAULT false,
  published_at     timestamptz,
  created_at       timestamptz   NOT NULL DEFAULT now(),
  updated_at       timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT chk_pillar_id CHECK (
    (type = 'pillar' AND pillar_id IS NULL) OR
    (type = 'cluster' AND pillar_id IS NOT NULL)
  )
);

CREATE TABLE learn_article_content (
  article_id              uuid        NOT NULL REFERENCES learn_articles(id) ON DELETE CASCADE,
  locale                  text        NOT NULL CHECK (locale IN ('en', 'nl', 'it')),
  title                   text        NOT NULL,
  subtitle                text,
  body_md                 text        NOT NULL DEFAULT '',
  reading_time_min        int,
  meta_title              text,
  meta_description        text,
  sd_keywords             text[]      NOT NULL DEFAULT '{}',
  sd_faq                  jsonb,
  sd_citations            jsonb,
  related_article_slugs   text[]      NOT NULL DEFAULT '{}',
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (article_id, locale)
);

CREATE INDEX idx_learn_articles_type_published
  ON learn_articles(type, is_published) WHERE is_published = true;

CREATE INDEX idx_learn_articles_pillar_id
  ON learn_articles(pillar_id) WHERE pillar_id IS NOT NULL;

CREATE INDEX idx_learn_article_content_locale
  ON learn_article_content(locale);

CREATE TRIGGER trg_learn_articles_updated_at
  BEFORE UPDATE ON learn_articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_learn_article_content_updated_at
  BEFORE UPDATE ON learn_article_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE learn_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learn_article_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "learn_articles_public_select"
  ON learn_articles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "learn_article_content_public_select"
  ON learn_article_content FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM learn_articles la
      WHERE la.id = learn_article_content.article_id
        AND la.is_published = true
    )
  );
