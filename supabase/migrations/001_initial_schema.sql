-- HoteliaOS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotels table
CREATE TABLE public.hotels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Malaysia',
  google_place_id TEXT,
  tripadvisor_url TEXT,
  booking_url TEXT,
  agoda_url TEXT,
  logo_url TEXT,
  brand_voice TEXT DEFAULT 'professional and friendly',
  default_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google', 'tripadvisor', 'booking', 'agoda', 'other')),
  reviewer_name TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 10),
  review_text TEXT NOT NULL,
  review_date DATE NOT NULL,
  language TEXT DEFAULT 'en',
  translated_text TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  sentiment_topics TEXT[],
  response_text TEXT,
  response_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rating snapshots (for tracking historical ratings)
CREATE TABLE public.rating_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('google', 'tripadvisor', 'booking', 'agoda')),
  rating NUMERIC(2,1) NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 0,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, platform, snapshot_date)
);

-- Guest emails
CREATE TABLE public.guest_emails (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('review_request', 'post_stay', 'return_promo')),
  subject TEXT,
  body TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'opened', 'clicked', 'failed')),
  resend_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email templates
CREATE TABLE public.email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('review_request', 'post_stay', 'return_promo')),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, template_type)
);

-- Indexes for performance
CREATE INDEX idx_reviews_hotel_id ON public.reviews(hotel_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_platform ON public.reviews(platform);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_rating_snapshots_hotel_id ON public.rating_snapshots(hotel_id);
CREATE INDEX idx_guest_emails_hotel_id ON public.guest_emails(hotel_id);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Hotels policies
CREATE POLICY "Users can view own hotels" ON public.hotels
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own hotels" ON public.hotels
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own hotels" ON public.hotels
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own hotels" ON public.hotels
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Users can view reviews for their hotels" ON public.reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = reviews.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can insert reviews for their hotels" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = reviews.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can update reviews for their hotels" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = reviews.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can delete reviews for their hotels" ON public.reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = reviews.hotel_id AND hotels.user_id = auth.uid())
  );

-- Rating snapshots policies
CREATE POLICY "Users can view snapshots for their hotels" ON public.rating_snapshots
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = rating_snapshots.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can insert snapshots for their hotels" ON public.rating_snapshots
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = rating_snapshots.hotel_id AND hotels.user_id = auth.uid())
  );

-- Guest emails policies
CREATE POLICY "Users can view emails for their hotels" ON public.guest_emails
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = guest_emails.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can insert emails for their hotels" ON public.guest_emails
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = guest_emails.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can update emails for their hotels" ON public.guest_emails
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = guest_emails.hotel_id AND hotels.user_id = auth.uid())
  );

-- Email templates policies
CREATE POLICY "Users can view templates for their hotels" ON public.email_templates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = email_templates.hotel_id AND hotels.user_id = auth.uid())
  );
CREATE POLICY "Users can manage templates for their hotels" ON public.email_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = email_templates.hotel_id AND hotels.user_id = auth.uid())
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
