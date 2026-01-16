# HoteliaOS

AI-powered review management for independent hotels in Southeast Asia.

## Features

- 🤖 **AI Review Replies** - Generate professional responses in seconds
- 🌐 **Multi-Language** - Translate reviews and replies (Thai, Indonesian, Vietnamese, Japanese, Chinese, and more)
- 📊 **Sentiment Analysis** - Understand what guests love and what needs work
- 📧 **Guest Emails** - One-click review requests and promotional emails
- 📱 **Mobile-Friendly** - Manage reviews from anywhere

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Claude API (Anthropic)
- **Emails**: Resend
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Anthropic API key
- Resend account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your environment variables in `.env.local`

5. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations (see `supabase/migrations/`)
   - Copy your project URL and anon key to `.env.local`

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hoteliaos/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # React components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── supabase/               # Supabase config & migrations
```

## Database Schema

See `supabase/migrations/` for the complete schema. Key tables:

- `users` - User profiles
- `hotels` - Hotel information
- `reviews` - Guest reviews
- `rating_snapshots` - Historical ratings
- `guest_emails` - Sent emails
- `email_templates` - Email templates

## API Routes

- `POST /api/ai/generate-reply` - Generate AI review reply
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/analyze-sentiment` - Analyze review sentiment
- `POST /api/emails/send` - Send guest email

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT
