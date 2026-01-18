-- Add theme_config column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}'::jsonb;

-- (Optional) Migrate existing design_config to theme_config if needed,
-- but for now we initialize it empty or rely on application logic to merge defaults.
