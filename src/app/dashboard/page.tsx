'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, Badge, StarRating, Button } from '@/components/ui'
import { useHotel } from '@/lib/hooks/use-hotel'
import { createClient } from '@/lib/supabase'
import type { Review, Rating } from '@/types/database'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Star,
  Plus,
  Loader2,
} from 'lucide-react'

export default function DashboardPage() {
  const { hotel, loading: hotelLoading } = useHotel()
  const [reviews, setReviews] = useState<Review[]>([])
  const [platformRatings, setPlatformRatings] = useState<{
    platform: string
    rating: number
    reviews: number
    color: string
    max: number
  }[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Dashboard Metrics State
  const [stats, setStats] = useState({
    avgRating: 0,
    ratingTrend: 0,
    totalReviews: 0,
    pendingReviews: 0,
    responseRate: 0,
  })

  // Colors for different platforms
  const platformColors: Record<string, string> = {
    google: 'bg-blue-500',
    tripadvisor: 'bg-emerald-500',
    booking: 'bg-blue-700',
    agoda: 'bg-coral-500',
    expedia: 'bg-yellow-500',
  }

  useEffect(() => {
    async function fetchDashboardData() {
      if (!hotel) return

      setDataLoading(true)
      const supabase = createClient()

      try {
        // 1. Fetch Recent Reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('hotel_id', hotel.id)
          .order('review_date', { ascending: false })

        if (reviewsData) {
          setReviews(reviewsData.slice(0, 5))
        }

        // 2. Fetch All Review Stats (for simplified calculation)
        // In a real high-scale app, we would use a dedicated 'hotel_stats' table or materialized view
        // For now, we'll do a focused count query
        const { count: totalCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('hotel_id', hotel.id)

        const { count: pendingCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('hotel_id', hotel.id)
          .eq('status', 'pending')

        const { count: respondedCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('hotel_id', hotel.id)
          .eq('status', 'responded')

        // 3. Fetch Rating Snapshots
        const { data: ratingsData } = await supabase
          .from('rating_snapshots') // Assuming table name is 'rating_snapshots'
          .select('*')
          .eq('hotel_id', hotel.id)

        // Calculate Derived Stats
        const total = totalCount || 0
        const pending = pendingCount || 0
        const responded = respondedCount || 0

        // Calculate response rate based on total non-pending or just responded count vs total that needs response?
        // Simple definition: (Responded / Total Reviews) * 100
        const responseRateVal = total > 0 ? Math.round((responded / total) * 100) : 0

        // Calculate Average Rating from Snapshots if available, or fall back to raw reviews
        let currentAvgRating = 0
        let mappedRatings: typeof platformRatings = []

        if (ratingsData && ratingsData.length > 0) {
          // Calculate weighted average
          let totalScore = 0
          let totalVoteWeight = 0

          mappedRatings = ratingsData.map((r: Rating) => {
            totalScore += r.rating * r.review_count
            totalVoteWeight += r.review_count

            return {
              platform: r.platform.charAt(0).toUpperCase() + r.platform.slice(1),
              rating: r.rating,
              reviews: r.review_count,
              color: platformColors[r.platform] || 'bg-gray-500',
              max: r.platform === 'booking' || r.platform === 'agoda' ? 10 : 5 // Just a heuristic
            }
          })

          if (totalVoteWeight > 0) {
            currentAvgRating = Number((totalScore / totalVoteWeight).toFixed(1))
          }
        } else if (reviewsData && reviewsData.length > 0) {
          // Fallback: Calculate from fetched reviews
          const sum = reviewsData.reduce((acc, r) => acc + Number(r.rating), 0)
          currentAvgRating = Number((sum / reviewsData.length).toFixed(1))

          // Aggregate per platform
          const platformMap: Record<string, { sum: number, count: number }> = {}
          reviewsData.forEach(r => {
            const p = r.platform || 'other'
            if (!platformMap[p]) platformMap[p] = { sum: 0, count: 0 }
            platformMap[p].sum += Number(r.rating)
            platformMap[p].count++
          })

          mappedRatings = Object.entries(platformMap).map(([platform, stats]) => ({
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            rating: Number((stats.sum / stats.count).toFixed(1)),
            reviews: stats.count,
            color: platformColors[platform.toLowerCase()] || 'bg-gray-500',
            max: platform === 'booking' || platform === 'agoda' ? 10 : 5
          }))
        }

        setPlatformRatings(mappedRatings)
        setStats({
          avgRating: currentAvgRating,
          ratingTrend: 0, // Need historical data for this, keeping 0 for now
          totalReviews: total,
          pendingReviews: pending,
          responseRate: responseRateVal,
        })

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchDashboardData()
  }, [hotel])

  if (hotelLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // --- ONBOARDING STATE: No Hotel Found ---
  if (!hotel) {
    return (
      <div>
        <Header
          title="Welcome to HoteliaOS"
          subtitle="Let's get your hotel set up to start managing your reputation."
        />
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md w-full text-center p-8">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Add Your Hotel</h2>
            <p className="text-muted mb-8">
              Connect your hotel profile to start tracking reviews, monitoring ratings, and replying to guests with AI.
            </p>
            <Link href="/dashboard/onboarding">
              <Button size="lg" className="w-full">
                Get Started
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening with ${hotel.name}.`}
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Average Rating */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Average Rating</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    {dataLoading ? (
                      <div className="h-8 w-16 bg-surface-100 animate-pulse rounded" />
                    ) : (
                      <span className="text-3xl font-bold text-dark">{stats.avgRating}</span>
                    )}

                    {/* Trend Placeholder */}
                    {stats.totalReviews > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        {stats.ratingTrend >= 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-600 font-medium">+{stats.ratingTrend}</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-coral-500" />
                            <span className="text-coral-600 font-medium">{stats.ratingTrend}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div className="mt-3">
                <StarRating rating={stats.avgRating} size="sm" />
              </div>
            </CardContent>
          </Card>

          {/* Total Reviews */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Total Reviews</p>
                  {dataLoading ? (
                    <div className="h-8 w-16 bg-surface-100 animate-pulse rounded mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-dark mt-1">{stats.totalReviews}</p>
                  )}
                </div>
                <div className="p-2.5 bg-primary-50 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-muted mt-3">
                <span className="text-primary-600 font-medium">{/** +0 this month placeholder */}</span>
                Total collected reviews
              </p>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Pending Reviews</p>
                  {dataLoading ? (
                    <div className="h-8 w-16 bg-surface-100 animate-pulse rounded mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-dark mt-1">{stats.pendingReviews}</p>
                  )}
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <p className="text-sm text-muted mt-3">
                Need your response
              </p>
            </CardContent>
          </Card>

          {/* Response Rate */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Response Rate</p>
                  {dataLoading ? (
                    <div className="h-8 w-16 bg-surface-100 animate-pulse rounded mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-dark mt-1">{stats.responseRate}%</p>
                  )}
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <div className="mt-3 h-2 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                  style={{ width: `${stats.responseRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Platform Ratings */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold text-dark mb-4">Platform Ratings</h3>
              <div className="space-y-4">
                {dataLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-1.5 h-10 bg-surface-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-200 rounded w-3/4" />
                        <div className="h-3 bg-surface-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : platformRatings.length > 0 ? (
                  platformRatings.map((platform) => (
                    <div key={platform.platform} className="flex items-center gap-3">
                      <div className={`w-1.5 h-10 ${platform.color} rounded-full`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-dark">
                            {platform.platform}
                          </span>
                          <span className="text-sm font-bold text-dark">
                            {platform.rating}/{platform.max || 5}
                          </span>
                        </div>
                        <p className="text-xs text-muted">{platform.reviews} reviews</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted text-center py-4">No rating data available yet.</p>
                )}
              </div>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-700 mt-5 transition-colors"
              >
                View full analytics <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-dark">Recent Reviews</h3>
                <Link
                  href="/dashboard/reviews"
                  className="text-sm font-medium text-primary hover:text-primary-700 transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {dataLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface-50 animate-pulse h-24" />
                  ))
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Link
                      key={review.id}
                      href={`/dashboard/reviews?id=${review.id}`}
                      className="block p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-dark">{review.reviewer_name}</span>
                            <Badge variant={
                              review.platform === 'google' ? 'info' :
                                review.platform === 'tripadvisor' ? 'success' : 'default'
                            }>
                              {review.platform}
                            </Badge>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                          <p className="text-sm text-muted mt-2 line-clamp-2 group-hover:text-dark transition-colors">
                            {review.translated_text || review.review_text}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted">
                            {new Date(review.review_date).toLocaleDateString()}
                          </p>
                          <Badge variant={review.status === 'pending' ? 'warning' : 'success'} className="mt-2">
                            {review.status === 'pending' ? 'Pending' : 'Replied'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted text-center py-12">
                    No reviews found yet. Connect your accounts to import them.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
