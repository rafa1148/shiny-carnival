-- Add new columns for Hotel Settings page
ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS google_url TEXT,
ADD COLUMN IF NOT EXISTS highlights TEXT,
ADD COLUMN IF NOT EXISTS signature_name TEXT;
