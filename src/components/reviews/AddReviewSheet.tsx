'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button, Input, Select, Textarea, StarRating } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import type { Review } from '@/types/database'

interface AddReviewSheetProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    hotelId: string
}

export function AddReviewSheet({ isOpen, onClose, onSuccess, hotelId }: AddReviewSheetProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        platform: 'google',
        reviewer_name: '',
        rating: 5,
        review_date: new Date().toISOString().split('T')[0],
        review_text: '',
    })

    // Reset form when opening/closing could be handy, but for now simple state

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.reviewer_name || !formData.review_text) {
            setError('Name and review text are required.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // 1. Analyze Sentiment
            const sentimentRes = await fetch('/api/ai/analyze-sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: formData.review_text,
                    rating: formData.rating
                })
            })

            if (!sentimentRes.ok) throw new Error('Sentiment analysis failed')
            const sentimentData = await sentimentRes.json()

            let translatedText = null
            let language = sentimentData.language || 'en'

            // 2. Translate if needed (not English)
            if (language !== 'en') {
                const translateRes = await fetch('/api/ai/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: formData.review_text,
                        sourceLanguage: language,
                        targetLanguage: 'en'
                    })
                })

                if (translateRes.ok) {
                    const translateData = await translateRes.json()
                    translatedText = translateData.translatedText
                }
            }

            // 3. Insert into Supabase
            const supabase = createClient()
            const { error: insertError } = await supabase
                .from('reviews')
                .insert({
                    hotel_id: hotelId,
                    platform: formData.platform,
                    reviewer_name: formData.reviewer_name,
                    rating: formData.rating,
                    review_text: formData.review_text,
                    review_date: formData.review_date,
                    // AI Fields
                    sentiment: sentimentData.sentiment,
                    sentiment_topics: sentimentData.topics,
                    original_language: language,
                    translated_text: translatedText,
                    status: 'pending'
                })

            if (insertError) throw insertError

            onSuccess()
            onClose()

            // Reset form
            setFormData({
                platform: 'google',
                reviewer_name: '',
                rating: 5,
                review_date: new Date().toISOString().split('T')[0],
                review_text: '',
            })

        } catch (err: any) {
            console.error('Error adding review:', err)
            setError(err.message || 'Failed to add review')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Sheet Panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-canvas shadow-bento animate-in slide-in-from-right duration-300 rounded-l-bento border-l border-white/50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-surface-100 bg-white/50 backdrop-blur-md rounded-tl-bento">
                    <h2 className="text-xl font-bold text-dark">Add Review</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-100 rounded-full transition-colors text-muted hover:text-dark"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-accent-50 text-accent-700 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Platform */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Platform</label>
                            <Select
                                value={formData.platform}
                                onChange={(e) => handleChange('platform', e.target.value)}
                                options={[
                                    { value: 'google', label: 'Google' },
                                    { value: 'tripadvisor', label: 'TripAdvisor' },
                                    { value: 'booking', label: 'Booking.com' },
                                    { value: 'agoda', label: 'Agoda' },
                                    { value: 'expedia', label: 'Expedia' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Reviewer Name</label>
                            <Input
                                placeholder="e.g. John Doe"
                                value={formData.reviewer_name}
                                onChange={(e) => handleChange('reviewer_name', e.target.value)}
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Rating</label>
                            <div className="flex items-center gap-4 bg-surface-50 p-3 rounded-pill border border-surface-100 w-fit">
                                <StarRating rating={formData.rating} size="md" />
                                <span className="text-sm font-bold text-dark">{formData.rating}/5</span>
                            </div>
                            {/* Range input for easier selection */}
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={formData.rating}
                                onChange={(e) => handleChange('rating', Number(e.target.value))}
                                className="w-full mt-3 accent-primary"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Date</label>
                            <Input
                                type="date"
                                value={formData.review_date}
                                onChange={(e) => handleChange('review_date', e.target.value)}
                            />
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Review Text</label>
                            <Textarea
                                placeholder="Paste the guest's review here..."
                                value={formData.review_text}
                                onChange={(e) => handleChange('review_text', e.target.value)}
                                className="min-h-[150px]"
                            />
                            <p className="text-xs text-muted mt-2">
                                We'll automatically analyze sentiment and translate if needed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-surface-100 bg-white/50 backdrop-blur-md pb-8">
                    <Button
                        onClick={handleSubmit}
                        className="w-full shadow-lg shadow-primary/20"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing Review...
                            </>
                        ) : (
                            <>
                                Add Review
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </>
    )
}
