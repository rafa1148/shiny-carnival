'use client'

import { useState } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '@/components/ui'
import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Mail,
    MessageSquare,
    Hotel,
    Settings,
    CreditCard,
    Send,
    ExternalLink,
    BookOpen,
    Sparkles,
    PlayCircle
} from 'lucide-react'
import Link from 'next/link'

// FAQ Data
const faqs = [
    {
        category: 'Reviews & AI Responses',
        items: [
            {
                q: 'How do I add a new review?',
                a: 'You can manually add reviews by clicking "+ Add Review" on the Reviews page, or connect your review platform URLs in Hotel Settings for automatic importing.'
            },
            {
                q: 'How does the AI response work?',
                a: 'Our AI analyzes the review content, sentiment, and your hotel\'s brand voice settings to generate a personalized, professional response. You can edit it before copying.'
            },
            {
                q: 'Can I customize the AI\'s tone?',
                a: 'Yes! Go to Hotel Settings → AI Response Settings to set your brand voice, key selling points, and sign-off name.'
            },
            {
                q: 'What languages are supported?',
                a: 'The AI can respond in multiple languages. Set your default language in Hotel Settings, or it will auto-detect and match the review\'s language.'
            }
        ]
    },
    {
        category: 'Guest Emails',
        items: [
            {
                q: 'What email templates are available?',
                a: 'We offer Post-Stay Review Request (ask for reviews with optional promotion) and Return Guest Promo (bring back past guests with special offers).'
            },
            {
                q: 'Can I customize the promotions?',
                a: 'Yes! You can select offer types (percentage discount, free breakfast, early check-in, etc.) and combine multiple offers.'
            },
            {
                q: 'How do guests book after receiving a promo?',
                a: 'You can choose the booking method: direct booking link, WhatsApp, phone call, or email reply.'
            }
        ]
    },
    {
        category: 'Account & Billing',
        items: [
            {
                q: 'What\'s included in the Free plan?',
                a: '10 AI responses/month, 20 guest emails/month, and 1 hotel.'
            },
            {
                q: 'How do I upgrade to Pro?',
                a: 'Go to Account → Click "Upgrade to Pro". You\'ll be redirected to our secure payment page. (Coming soon)'
            },
            {
                q: 'When does my usage reset?',
                a: 'Usage resets on the 1st of each month.'
            }
        ]
    }
]

// Quick Start Steps
const quickStartSteps = [
    {
        icon: Hotel,
        title: 'Set up your hotel',
        desc: 'Go to Hotel Settings and fill in your hotel information, description, and links.'
    },
    {
        icon: Settings,
        title: 'Connect platforms',
        desc: 'Add your Google, TripAdvisor, Booking.com, and Agoda URLs in Hotel Settings.'
    },
    {
        icon: MessageSquare,
        title: 'Add reviews',
        desc: 'Import reviews manually or let the system fetch them automatically.'
    },
    {
        icon: Sparkles,
        title: 'Generate AI responses',
        desc: 'Click on any review and use AI to generate a professional response.'
    },
    {
        icon: Mail,
        title: 'Send guest emails',
        desc: 'Use email templates to request reviews or send promotions to past guests.'
    }
]

export default function HelpPage() {
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

    // Contact Form State
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [isSending, setIsSending] = useState(false)

    const toggleFaq = (idx: string) => {
        setExpandedFaq(expandedFaq === idx ? null : idx)
    }

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSending(true)

        // Simulate API call
        setTimeout(() => {
            alert(`Message sent! We'll get back to you at ${formData.email} soon.`)
            setFormData({ name: '', email: '', subject: '', message: '' })
            setIsSending(false)
        }, 1000)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            <Header
                title="Help & Support"
                subtitle="Get answers to common questions or reach out to our team"
            />

            {/* Quick Start Guide */}
            <section>
                <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-brand-600" />
                    Quick Start Guide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {quickStartSteps.map((step, i) => (
                        <Card key={i} className="bg-surface-50 border-surface-200 h-full hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4 flex flex-col items-center text-center h-full">
                                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3 shrink-0">
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-surface-900 mb-1 text-sm">Step {i + 1}</h3>
                                <p className="font-medium text-surface-800 text-sm mb-2">{step.title}</p>
                                <p className="text-xs text-surface-500 leading-relaxed">{step.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-surface-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-600" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {faqs.map((category, catIdx) => (
                            <div key={catIdx} className="space-y-3">
                                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider pl-1">{category.category}</h3>
                                <div className="space-y-3">
                                    {category.items.map((item, idx) => {
                                        const id = `${catIdx}-${idx}`
                                        const isOpen = expandedFaq === id

                                        return (
                                            <div
                                                key={idx}
                                                className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${isOpen ? 'border-brand-200 shadow-sm ring-1 ring-brand-100' : 'border-surface-200 hover:border-brand-200'}`}
                                            >
                                                <button
                                                    onClick={() => toggleFaq(id)}
                                                    className="w-full flex items-center justify-between p-4 text-left"
                                                >
                                                    <span className={`font-medium ${isOpen ? 'text-brand-700' : 'text-surface-700'}`}>{item.q}</span>
                                                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-500" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
                                                </button>

                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-0 text-sm text-surface-600 leading-relaxed animate-in slide-in-from-top-1 duration-200">
                                                        <div className="pt-2 border-t border-surface-100">
                                                            {item.a}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Contact & Links */}
                <div className="space-y-6">
                    {/* Useful Links */}
                    <Card className="bg-gradient-to-br from-white to-surface-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ExternalLink className="w-5 h-5 text-brand-600" />
                                Useful Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-surface-200 transition-all text-surface-600 hover:text-brand-600">
                                <Hotel className="w-4 h-4" />
                                <span className="font-medium text-sm">Hotel Settings</span>
                            </Link>
                            <Link href="/dashboard/account" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-surface-200 transition-all text-surface-600 hover:text-brand-600">
                                <CreditCard className="w-4 h-4" />
                                <span className="font-medium text-sm">Account & Billing</span>
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-surface-200 transition-all text-surface-600 hover:text-brand-600">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-medium text-sm">Back to Dashboard</span>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card className="border-brand-100 shadow-brand-500/5">
                        <CardHeader className="bg-brand-50/50 border-b border-brand-100">
                            <CardTitle className="text-lg flex items-center gap-2 text-brand-900">
                                <HelpCircle className="w-5 h-5 text-brand-600" />
                                Contact Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="text-sm text-surface-600 space-y-1">
                                <p><span className="font-semibold text-surface-800">Email:</span> support@hoteliaos.com</p>
                                <p className="text-xs text-surface-500">We typically respond within 24 hours.</p>
                            </div>

                            <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-surface-700">Name</label>
                                    <Input
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="bg-white h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-surface-700">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="bg-white h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-surface-700">Subject</label>
                                    <Input
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="bg-white h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-surface-700">Message</label>
                                    <Textarea
                                        placeholder="Describe your issue..."
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        className="bg-white min-h-[80px] text-sm resize-none"
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isSending}>
                                    {isSending ? 'Sending...' : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" /> Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
