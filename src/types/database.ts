// Database types matching Supabase schema

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  subscription_plan: 'free' | 'pro' | 'enterprise'
  ai_responses_used: number
  guest_emails_used: number
  usage_reset_date: string | null
}

export interface Hotel {
  id: string
  user_id: string
  name: string
  address: string | null
  city: string | null
  country: string
  phone: string | null
  email: string | null
  website: string | null
  description: string | null
  room_count: number | null
  star_rating: number | null
  google_place_id: string | null
  google_url: string | null
  tripadvisor_url: string | null
  booking_url: string | null
  agoda_url: string | null
  logo_url: string | null
  brand_voice: string | null
  key_selling_points: string | null
  default_language: string
  sign_off_name: string | null
  google_review_url: string | null
  direct_booking_url: string | null
  reply_to_email: string | null
  whatsapp_number: string | null
  phone_number: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  hotel_id: string
  platform: 'google' | 'tripadvisor' | 'booking' | 'agoda' | 'other'
  reviewer_name: string
  rating: number
  review_text: string
  review_date: string
  language: string | null
  translated_text: string | null
  sentiment: 'positive' | 'neutral' | 'negative' | null
  sentiment_topics: string[] | null
  response_text: string | null
  response_date: string | null
  status: 'pending' | 'responded' | 'ignored'
  flagged: boolean | null
  created_at: string
  updated_at: string
}

export interface Rating {
  id: string
  hotel_id: string
  platform: 'google' | 'tripadvisor' | 'booking' | 'agoda'
  rating: number
  review_count: number
  recorded_at: string
  created_at: string
}

export interface Competitor {
  id: string
  hotel_id: string
  name: string
  google_place_id: string | null
  tripadvisor_url: string | null
  booking_url: string | null
  created_at: string
}

export interface GuestEmail {
  id: string
  hotel_id: string
  guest_name: string
  guest_email: string
  template_type: 'review_request' | 'post_stay_thanks' | 'return_promo'
  subject: string | null
  body: string | null
  sent_at: string | null
  opened_at: string | null
  clicked_at: string | null
  status: 'draft' | 'sent' | 'failed' | 'opened' | 'clicked'
  resend_id: string | null
  created_at: string
}

export interface EmailTemplate {
  id: string
  hotel_id: string
  type: 'review_request' | 'post_stay_thanks' | 'return_promo'
  name: string
  subject: string
  body: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'free' | 'starter' | 'pro'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// Computed types
export interface HotelWithRatings extends Hotel {
  ratings: Rating[]
  review_count: number
  pending_reviews: number
}

export interface DashboardStats {
  total_reviews: number
  pending_replies: number
  average_rating: number
  rating_change: number
  reviews_this_week: number
  sentiment_breakdown: {
    positive: number
    neutral: number
    negative: number
  }
}

// API response types
export interface AIReplyResponse {
  reply: string
  translated_review?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  topics: string[]
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  score: number
  topics: {
    topic: string
    sentiment: 'positive' | 'negative'
    mentions: string[]
  }[]
}
