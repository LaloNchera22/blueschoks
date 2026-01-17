-- Migration to add design_config JSONB column to profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS design_config JSONB;

COMMENT ON COLUMN public.profiles.design_config IS 'Stores the granular design configuration for the store (colors, fonts, layout)';
