'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout'
import { Card, CardContent, Button, Badge, StarRating, Textarea, Select } from '@/components/ui'
import { AddReviewSheet } from '@/components/reviews/AddReviewSheet'
import { useHotel } from '@/lib/hooks/use-hotel'
import { createClient } from '@/lib/supabase'
import type { Review } from '@/types/database'
import {
  Sparkles,
  Copy,
  Check,
  Languages,
  Send,
  Filter,
  Loader2,
  Globe,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react'

// Platform options
const platformOptions = [
  { value: 'all', label: 'All Platforms' },
  { value: 'google', label: 'Google' },
  { value: 'tripadvisor', label: 'TripAdvisor' },
  { value: 'booking', label: 'Booking.com' },
  { value: 'agoda', label: 'Agoda' },
  { value: 'expedia', label: 'Expedia' },
  { value: 'other', label: 'Other' },
]

// Status options
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'responded', label: 'Responded' },
]

export default function ReviewsPage() {
  const { hotel } = useHotel()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  // New State for Manual Addition
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)

  // Reply Generation State
  const [generatedReply, setGeneratedReply] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [replyLanguage, setReplyLanguage] = useState('en')

  // Filters State
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Interactive States
  // Removed activeMenuId and menuRef

  // Generation limit tracking (max 3 per review)
  const [generationCounts, setGenerationCounts] = useState<Record<string, number>>({})
  const MAX_GENERATIONS = 3

  // Auto-regenerate when language changes
  useEffect(() => {
    if (selectedReview && generatedReply && !isGenerating) {
      handleGenerateReply()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyLanguage])


  // Fetch Reviews Logic
  const fetchReviews = async () => {
    if (!hotel) return
    setLoadingReviews(true)
    const supabase = createClient()

    // Build query
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('hotel_id', hotel.id)
      .neq('status', 'ignored') // Exclude ignored reviews by default
      .order('review_date', { ascending: false })

    // Apply filters
    if (platformFilter !== 'all') {
      query = query.eq('platform', platformFilter)
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        query = query.eq('status', 'pending')
      } else if (statusFilter === 'responded') {
        query = query.eq('status', 'responded')
      }
    }

    const { data: reviewsData, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
    } else if (reviewsData) {
      setReviews(reviewsData)
      // If selected review is not in the new list, deselect it
      if (reviewsData.length > 0) {
        // Check for ID in URL
        const urlParams = new URLSearchParams(window.location.search)
        const reviewId = urlParams.get('id')

        if (reviewId) {
          const linkedReview = reviewsData.find(r => r.id === reviewId)
          if (linkedReview) {
            setSelectedReview(linkedReview)
          } else {
            setSelectedReview(reviewsData[0])
          }
        } else {
          setSelectedReview(reviewsData[0])
        }
      } else {
        setSelectedReview(null)
      }
    }
    setLoadingReviews(false)
  }

  // Initial Fetch & Filter Changes
  useEffect(() => {
    fetchReviews()
  }, [hotel, platformFilter, statusFilter])

  // --- Handlers ---

  const handleMarkResponded = async () => {
    if (!selectedReview || !generatedReply) return

    console.log('Marking review as responded:', selectedReview.id)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('reviews')
        .update({
          status: 'responded',
          response_text: generatedReply,
          response_date: new Date().toISOString()
        })
        .eq('id', selectedReview.id)

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      console.log('Review marked as responded successfully')
      await fetchReviews()
      setGeneratedReply('')

      // Update local state
      setSelectedReview(prev => prev ? ({
        ...prev,
        status: 'responded',
        response_text: generatedReply,
        response_date: new Date().toISOString()
      }) : null)

    } catch (err) {
      console.error('Error updating review:', err)
      alert('Failed to update status')
    }
  }

  const handleGenerateReply = async () => {
    if (!selectedReview || !hotel) return

    // Check generation limit
    const currentCount = generationCounts[selectedReview.id] || 0
    if (currentCount >= MAX_GENERATIONS) {
      alert(`Generation limit reached (${MAX_GENERATIONS}/${MAX_GENERATIONS}). Please use the current response.`)
      return
    }

    setIsGenerating(true)

    try {
      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: selectedReview.review_text,
          reviewerName: selectedReview.reviewer_name,
          rating: selectedReview.rating,
          platform: selectedReview.platform,
          hotelName: hotel.name,
          brandVoice: hotel.brand_voice,
          replyLanguage: replyLanguage,
          sentiment: selectedReview.sentiment,
          topics: selectedReview.sentiment_topics || [],
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to generate reply')

      setGeneratedReply(data.reply)

      // Increment generation count
      setGenerationCounts(prev => ({
        ...prev,
        [selectedReview.id]: (prev[selectedReview.id] || 0) + 1
      }))
    } catch (error) {
      console.error('Error generating reply:', error)
      alert('Failed to generate AI reply. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Removed handleCopyReview and handleDelete




  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />
      case 'negative': return <ThumbsDown className="w-4 h-4" />
      default: return <Minus className="w-4 h-4" />
    }
  }

  return (
    <div>
      <Header
        title="Reviews"
        subtitle="Manage and respond to guest reviews across all platforms"
        action={{
          label: 'Add Review',
          onClick: () => setIsAddReviewOpen(true),
        }}
      />

      <AddReviewSheet
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        hotelId={hotel?.id || ''}
        onSuccess={fetchReviews}
      />

      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Reviews List */}
          <div className="lg:w-1/2 space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select
                options={platformOptions}
                className="w-40"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              />
              <Select
                options={statusOptions}
                className="w-36"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              {loadingReviews ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center p-8 text-muted">
                  No reviews found. Add one manually to get started!
                </div>
              ) : (
                reviews.map((review) => (
                  <Card
                    key={review.id}
                    hover
                    className={`cursor-pointer group relative ${selectedReview?.id === review.id ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => {
                      setSelectedReview(review)
                    }}
                  >
                    <CardContent className="py-4">

                      {/* Flag Indicator */}
                      {review.flagged && (
                        <div className="absolute top-0 right-0 p-1">
                          <div className="w-0 h-0 border-t-[20px] border-r-[20px] border-t-orange-500 border-r-transparent" />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-dark">{review.reviewer_name}</span>
                            <Badge variant={
                              review.platform === 'google' ? 'info' :
                                review.platform === 'tripadvisor' ? 'success' :
                                  review.platform === 'booking' ? 'default' : 'error'
                            }>
                              {review.platform}
                            </Badge>
                            {review.language && review.language !== 'en' && (
                              <Badge variant="warning">
                                <Globe className="w-3 h-3 mr-1" />
                                {review.language.toUpperCase()}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <StarRating rating={review.rating} size="sm" />
                            {review.sentiment && (
                              <Badge variant={
                                review.sentiment === 'positive' ? 'success' :
                                  review.sentiment === 'negative' ? 'error' : 'warning'
                              }>
                                {getSentimentIcon(review.sentiment)}
                                <span className="ml-1 capitalize">{review.sentiment}</span>
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted line-clamp-2">
                            {review.translated_text || review.review_text}
                          </p>

                          {review.sentiment_topics && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {review.sentiment_topics.map((topic) => (
                                <span
                                  key={topic}
                                  className="px-2 py-0.5 text-xs bg-surface-100 text-muted rounded-full"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right Side: Status */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-2">

                          <p className="text-xs text-muted">{new Date(review.review_date).toLocaleDateString()}</p>
                          <Badge
                            variant={review.status === 'pending' ? 'warning' : 'success'}
                          >
                            {review.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Reply Panel */}
          <div className="lg:w-1/2">
            <Card className="sticky top-24">
              <CardContent className="py-6">
                {selectedReview ? (
                  <div className="space-y-4">
                    {/* Review Details */}
                    <div className="pb-4 border-b border-surface-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-dark">
                          Review from {selectedReview.reviewer_name}
                        </h3>
                      </div>

                      {/* Original text if translated */}
                      {selectedReview.translated_text && (
                        <div className="mb-3 p-3 bg-surface-50 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <Languages className="w-3 h-3 text-muted" />
                            <p className="text-xs text-muted">
                              Original ({selectedReview.language?.toUpperCase() || 'Foreign'})
                            </p>
                          </div>
                          <p className="text-sm text-dark">{selectedReview.review_text}</p>
                        </div>
                      )}

                      <p className="text-sm text-dark leading-relaxed">
                        {selectedReview.translated_text || selectedReview.review_text}
                      </p>
                    </div>

                    {/* AI Reply Section - Conditional Rendering */}
                    <div>
                      {selectedReview.status === 'responded' ? (
                        /* Read-only view for responded reviews */
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Check className="w-4 h-4 text-green-600" />
                            <h4 className="font-medium text-green-800">Response Sent</h4>
                            {selectedReview.response_date && (
                              <span className="text-xs text-green-600 ml-auto">
                                {new Date(selectedReview.response_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-green-100 text-sm text-dark whitespace-pre-wrap">
                            {selectedReview.response_text}
                          </div>
                        </div>
                      ) : (
                        /* Generator for pending reviews */
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-dark">AI-Generated Reply</h4>
                              <span className="text-xs text-muted bg-surface-100 px-2 py-0.5 rounded-full">
                                {generationCounts[selectedReview.id] || 0}/{MAX_GENERATIONS}
                              </span>
                            </div>
                            <Select
                              options={[
                                { value: 'en', label: '🇬🇧 English' },
                                { value: 'th', label: '🇹🇭 Thai' },
                                { value: 'ja', label: '🇯🇵 Japanese' },
                                { value: 'zh', label: '🇨🇳 Chinese' },
                                { value: 'ko', label: '🇰🇷 Korean' },
                              ]}
                              value={replyLanguage}
                              onChange={(e) => setReplyLanguage(e.target.value)}
                              className="w-36"
                              disabled={isGenerating || (generationCounts[selectedReview.id] || 0) >= MAX_GENERATIONS}
                            />
                          </div>

                          {!generatedReply ? (
                            <Button
                              onClick={handleGenerateReply}
                              loading={isGenerating}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 !opacity-100 text-white shadow-sm"
                              size="lg"
                              disabled={(generationCounts[selectedReview.id] || 0) >= MAX_GENERATIONS}
                            >
                              <Sparkles className="w-5 h-5" />
                              {(generationCounts[selectedReview.id] || 0) >= MAX_GENERATIONS
                                ? 'Limit Reached'
                                : 'Generate AI Reply'}
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <Textarea
                                value={generatedReply}
                                onChange={(e) => setGeneratedReply(e.target.value)}
                                rows={10}
                                className="text-sm"
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="secondary"
                                  onClick={handleGenerateReply}
                                  loading={isGenerating}
                                  className="flex-1"
                                  disabled={(generationCounts[selectedReview.id] || 0) >= MAX_GENERATIONS}
                                >
                                  <Sparkles className="w-4 h-4" />
                                  Regenerate
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={handleCopy}
                                >
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  {copied ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button
                                  className="flex-1"
                                  onClick={handleMarkResponded}
                                  disabled={!generatedReply}
                                >
                                  <Send className="w-4 h-4" />
                                  Mark as Responded
                                </Button>
                              </div>
                              {(generationCounts[selectedReview.id] || 0) >= MAX_GENERATIONS && (
                                <p className="text-xs text-center text-orange-600">
                                  Generation limit reached. Please edit the text manually if needed.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-medium text-dark mb-1">Select a Review</h3>
                    <p className="text-sm text-muted">
                      Click on a review to generate an AI-powered response
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
