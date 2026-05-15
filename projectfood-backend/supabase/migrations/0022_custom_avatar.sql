ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS custom_avatar_image TEXT,
  ADD COLUMN IF NOT EXISTS custom_avatar_bg    TEXT;

-- Update sync trigger: don't overwrite avatar_url if user has a custom avatar set
CREATE OR REPLACE FUNCTION public.sync_user_avatar_url()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE public.user_settings
  SET avatar_url = NEW.raw_user_meta_data->>'avatar_url'
  WHERE user_id = NEW.id
    AND NEW.raw_user_meta_data->>'avatar_url' IS NOT NULL
    AND custom_avatar_image IS NULL;
  RETURN NEW;
END;
$$;
