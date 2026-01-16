# HoteliaOS - AI Context

## Project Overview
HoteliaOS is an AI-powered review management SaaS for independent hotels in Southeast Asia. It helps hotel managers respond to guest reviews faster, translate reviews, analyze sentiment, and send guest emails.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: Claude API (Anthropic) for review replies, translation, sentiment
- **Emails**: Resend
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Key Features
1. **AI Review Replies**: Generate professional responses in seconds
2. **Multi-Language**: Translate reviews and replies (12+ languages)
3. **Sentiment Analysis**: Understand guest feedback themes
4. **Guest Emails**: Review requests, post-stay thank yous, return promos

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── ai/            # AI endpoints (generate-reply, translate, analyze-sentiment)
│   │   └── emails/        # Email endpoints
│   ├── dashboard/         # Dashboard pages
│   │   ├── reviews/       # Review management
│   │   ├── emails/        # Guest email management
│   │   ├── analytics/     # Analytics (TODO)
│   │   └── settings/      # Hotel settings (TODO)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Sidebar, Header, DashboardLayout
│   └── ui/                # Button, Input, Card, Badge, etc.
├── lib/                   # Utilities (supabase, utils)
└── types/                 # TypeScript types
```

## Database Tables
- `profiles` - User profiles (extends Supabase auth)
- `hotels` - Hotel information
- `reviews` - Guest reviews with AI analysis
- `rating_snapshots` - Historical ratings
- `guest_emails` - Sent emails
- `email_templates` - Customizable templates

## API Routes
- `POST /api/ai/generate-reply` - Generate AI review response
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/analyze-sentiment` - Analyze sentiment + extract topics
- `POST /api/emails/send` - Send guest email via Resend

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `ANTHROPIC_API_KEY` - Claude API key
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Sender email address

## Design System
- **Colors**: Brand (green), Surface (gray scale)
- **Components**: Use components from `@/components/ui`
- **Styling**: Tailwind CSS with custom config

## Current Status
- [x] Project setup
- [x] UI components
- [x] Dashboard layout
- [x] Landing page
- [x] Reviews page (with demo AI reply)
- [x] Emails page
- [x] Database schema
- [x] AI API routes
- [x] Email API route
- [ ] Supabase integration (auth, CRUD)
- [ ] Stripe integration
- [ ] Analytics page
- [ ] Settings page
- [ ] Mobile optimization

## Next Steps
1. Set up Supabase project and run migrations
2. Implement auth (login, signup, logout)
3. Connect reviews page to database
4. Connect AI routes to Claude API
5. Test email sending with Resend
6. Add Stripe for subscriptions
