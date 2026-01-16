import Link from 'next/link'
import {
  MessageSquare,
  Languages,
  Mail,
  Sparkles,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Hotel,
  Globe,
  Quote,
} from 'lucide-react'

import { ProductDemo } from '@/components/landing/ProductDemo'
import { Navbar } from '@/components/landing/Navbar'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Review Replies',
    description: 'Generate professional, personalized responses to guest reviews in seconds. Our AI understands context and crafts replies that feel human.',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Automatically translate reviews and replies. Support for Thai, Indonesian, Vietnamese, Japanese, Chinese, and more.',
  },
  {
    icon: MessageSquare,
    title: 'Sentiment Analysis',
    description: 'Instantly understand what guests love and what needs improvement. Identify trends across all your reviews.',
  },
  {
    icon: Mail,
    title: 'Guest Email Templates',
    description: "One-click emails for post-stay review requests and return guest promos. Drive more positive reviews and repeat bookings.",
  },
]

const stats = [
  { value: '5x', label: 'Faster Responses' },
  { value: '100%', label: 'Response Rate Achievable' },
  { value: '7+', label: 'Languages Supported' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-teal-50 via-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Built for Southeast Asian Hotels
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-surface-900 leading-tight mb-6">
            Turn Every Review Into Your Next Booking
          </h1>
          <p className="text-xl text-surface-600 mb-8 max-w-2xl mx-auto">
            Independent hotels using HoteliaOS respond to Booking.com, Agoda, Google, and TripAdvisor reviews 5x faster—in Thai, Chinese, English, and 7+ languages.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-all shadow-md hover:shadow-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-surface-700 bg-white border border-surface-200 rounded-xl hover:bg-surface-50 hover:border-surface-300 transition-all">
              View Demo
            </Link>
          </div>
          <p className="text-sm font-medium text-surface-500 mt-8 mb-2">
            Built for independent hotels
          </p>
          <p className="text-xs text-surface-400">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-surface-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-6 bg-white border-b border-surface-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-surface-900 mb-12">Sound Familiar?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                problem: "I don't have time to reply to every review",
                reality: "You're busy running a hotel. But every unanswered review tells potential guests you don't care."
              },
              {
                problem: "Half my reviews are in languages I can't write",
                reality: "Poor translations make your hotel look unprofessional and cost you bookings."
              },
              {
                problem: "I'm paying 15-25% commission to OTAs",
                reality: "Every OTA guest could be a direct booking—if you had their contact info."
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-surface-50 hover:shadow-lg transition-all duration-300 border-l-4 border-coral-400">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-600 font-bold">✕</span>
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 italic">"{item.problem}"</h3>
                </div>
                <p className="text-surface-600 pl-0 mt-4 border-t border-surface-200 pt-4">
                  {item.reality}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See It In Action (Interactive Demo) */}
      <ProductDemo />

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">
              Everything You Need to Manage Reviews
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Designed specifically for independent hotels in Southeast Asia.
              Simple, affordable, and powerful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center mb-4 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Booking Engine? */}
      <section className="py-20 px-6 bg-surface-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ArrowRight className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-3xl font-bold text-surface-900 mb-4">
            No Booking Engine? No Problem.
          </h2>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto mb-8">
            HoteliaOS helps you collect guest emails, send personalized follow-ups, and convert OTA guests into direct WhatsApp or phone bookings. Start small. Reduce OTA commissions over time.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {[
              "Collect guest contacts",
              "Send 'Book Direct' promos",
              "Accept bookings via WhatsApp, phone, or email"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-surface-700 font-medium">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 mb-8 bg-brand-50 rounded-full text-brand-600">
            <Quote className="w-6 h-6 fill-current opacity-50" />
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-surface-900 leading-relaxed mb-6 relative z-10">
            "Before HoteliaOS, I spent 2 hours a day on reviews. Now I do it in 15 minutes. The AI sounds exactly like me."
          </blockquote>
          <cite className="text-lg text-surface-500 not-italic font-medium">
            — Operations Manager, 45-room hotel in Hatyai
          </cite>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gradient-to-b from-surface-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-surface-600">One plan. All features. No surprises.</p>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-card-hover p-8 border border-brand-100">
            <div className="text-center mb-6">
              <p className="text-sm font-semibold text-brand-600 mb-2">PROFESSIONAL</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-surface-900">$29</span>
                <span className="text-surface-500">/month</span>
              </div>
              <p className="text-sm text-surface-500 mt-2">per hotel</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited AI review replies',
                'Multi-language translation',
                'Sentiment analysis & insights',
                'Guest email templates',
                'All platforms supported',
                'Email support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-surface-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center px-6 py-3.5 text-lg font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-all shadow-sm hover:shadow-md">
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surface-900 mb-4">
            Your Competitors Are Already Responding Faster
          </h2>
          <p className="text-lg text-surface-600 mb-8">
            Hotels that respond to reviews within 24 hours see 12% higher booking rates.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-all shadow-md hover:shadow-lg">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-surface-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Hotel className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-surface-900">HoteliaOS</span>
            </div>
            <p className="text-sm text-surface-500">
              © 2026 HoteliaOS.
            </p>
            <div className="flex gap-6 text-sm text-surface-500">
              <Link href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
              <a href="mailto:support@hoteliaos.com" className="hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
