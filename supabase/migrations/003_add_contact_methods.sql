-- Add contact method columns to hotels table
ALTER TABLE hotels 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;
