-- Add email configuration columns to hotels table
ALTER TABLE hotels 
ADD COLUMN IF NOT EXISTS google_review_url TEXT,
ADD COLUMN IF NOT EXISTS direct_booking_url TEXT,
ADD COLUMN IF NOT EXISTS reply_to_email TEXT;
