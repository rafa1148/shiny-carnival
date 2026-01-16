-- Add subscription and usage columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_responses_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guest_emails_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usage_reset_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', date_trunc('month', now()));
