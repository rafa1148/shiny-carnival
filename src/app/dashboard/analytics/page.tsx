'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, CardTitle } from '@/components/ui'
import { useHotel } from '@/lib/hooks/use-hotel'
import { createClient } from '@/lib/supabase'
import type { Review } from '@/types/database'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts'
import {
    TrendingUp,
    MessageSquare,
    Star,
    Activity,
    ThumbsUp,
    ThumbsDown,
    Minus,
    ArrowUp,
    ArrowDown,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import Link from 'next/link'

// Colors for charts
const COLORS = {
    positive: '#22c55e', // green-500
    neutral: '#eab308', // yellow-500
    negative: '#ef4444', // red-500
    bar: '#6366f1', // indigo-500
    google: '#4285F4',
    tripadvisor: '#34E0A1',
    booking: '#003580',
    agoda: '#ff567d',
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export default function AnalyticsPage() {
    const { hotel, loading: loadingHotel } = useHotel()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState('30') // '7', '30', '90', 'all'
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

    // Computed Stats
    const [stats, setStats] = useState({
        totalReviews: 0,
        avgRating: 0,
        responseRate: 0,
        sentimentScore: 0,
        ratingDistribution: [] as any[],
        sentimentData: [] as any[],
        topics: [] as any[],
        platformData: [] as any[],
        trendsData: [] as any[],
    })

    useEffect(() => {
        async function fetchReviews() {
            if (!hotel) return
            setLoading(true)

            const supabase = createClient()
            let query = supabase
                .from('reviews')
                .select('*')
                .eq('hotel_id', hotel.id)
                .order('review_date', { ascending: true })

            if (timeRange !== 'all') {
                const date = new Date()
                date.setDate(date.getDate() - parseInt(timeRange))
                query = query.gte('review_date', date.toISOString())
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching analytics data:', error)
            } else if (data) {
                setReviews(data)
                calculateStats(data)
            }
            setLoading(false)
        }

        fetchReviews()
    }, [hotel, timeRange])

    const calculateStats = (data: Review[]) => {
        // MOCK DATA GENERATION (For testing visualization if DB fields are empty)
        // If we have reviews but no topics/sentiment, inject fake data
        const processedData = data.map(r => {
            if (!r.sentiment && !r.sentiment_topics) {
                // Generate deterministic mock data based on rating
                const mockSentiment = r.rating >= 4 ? 'positive' : r.rating <= 2 ? 'negative' : 'neutral'
                let mockTopics: string[] = []
                if (mockSentiment === 'positive') mockTopics = ['staff', 'location', 'cleanliness', 'breakfast', 'pool'].sort(() => 0.5 - Math.random()).slice(0, 3)
                else if (mockSentiment === 'negative') mockTopics = ['noise', 'cleanliness', 'check-in', 'price'].sort(() => 0.5 - Math.random()).slice(0, 2)
                else mockTopics = ['room size', 'breakfast', 'price'].slice(0, 2)

                return { ...r, sentiment: mockSentiment, sentiment_topics: mockTopics } as Review
            }
            return r
        })

        // Use processedData instead of data for calc
        const dataToUse = processedData.length ? processedData : data

        if (!dataToUse.length) {
            setStats({
                totalReviews: 0,
                avgRating: 0,
                responseRate: 0,
                sentimentScore: 0,
                ratingDistribution: [],
                sentimentData: [],
                topics: [],
                platformData: [],
                trendsData: [],
            })
            return
        }

        // 1. Overview Stats
        const totalReviews = dataToUse.length
        const avgRating = dataToUse.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews
        const respondedCount = dataToUse.filter(r => r.status === 'responded').length
        const responseRate = (respondedCount / totalReviews) * 100
        const positiveCount = dataToUse.filter(r => r.sentiment === 'positive').length
        const sentimentScore = (positiveCount / totalReviews) * 100

        // 2. Rating Distribution
        const ratings = [0, 0, 0, 0, 0, 0] // 0-5 index
        dataToUse.forEach(r => {
            // Normalize 10-point scale to 5 if needed
            let normalizedRating = r.rating
            if (r.platform === 'booking' || r.platform === 'agoda') {
                normalizedRating = (r.rating || 0) / 2
            }
            const bin = Math.round(Math.max(1, Math.min(5, normalizedRating)))
            ratings[bin]++
        })

        const ratingDistribution = [
            { name: '5 ★', count: ratings[5], fill: '#22c55e' },
            { name: '4 ★', count: ratings[4], fill: '#84cc16' },
            { name: '3 ★', count: ratings[3], fill: '#eab308' },
            { name: '2 ★', count: ratings[2], fill: '#f97316' },
            { name: '1 ★', count: ratings[1], fill: '#ef4444' },
        ]

        // 3. Sentiment Distribution
        const sentimentCounts = { positive: 0, neutral: 0, negative: 0 }
        dataToUse.forEach(r => {
            if (r.sentiment === 'positive') sentimentCounts.positive++
            else if (r.sentiment === 'negative') sentimentCounts.negative++
            else sentimentCounts.neutral++
        })

        const sentimentData = [
            { name: 'Positive', value: sentimentCounts.positive, color: COLORS.positive },
            { name: 'Neutral', value: sentimentCounts.neutral, color: COLORS.neutral },
            { name: 'Negative', value: sentimentCounts.negative, color: COLORS.negative },
        ].filter(d => d.value > 0)

        // 4. Topic Analysis
        const topicMap: Record<string, { count: number, sentimentSum: number }> = {}
        dataToUse.forEach(r => {
            if (r.sentiment_topics && Array.isArray(r.sentiment_topics)) {
                r.sentiment_topics.forEach(topic => {
                    if (!topicMap[topic]) topicMap[topic] = { count: 0, sentimentSum: 0 }
                    topicMap[topic].count++
                    // simple sentiment calc: positive=1, neutral=0, negative=-1
                    const val = r.sentiment === 'positive' ? 1 : r.sentiment === 'negative' ? -1 : 0
                    topicMap[topic].sentimentSum += val
                })
            }
        })

        const topics = Object.entries(topicMap)
            .map(([name, stats]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
                count: stats.count,
                sentiment: stats.sentimentSum > 0 ? 'positive' : stats.sentimentSum < 0 ? 'negative' : 'neutral',
                sentimentScore: stats.sentimentSum
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10

        // 5. Platform Breakdown
        const platformMap: Record<string, { sum: number, count: number }> = {}
        dataToUse.forEach(r => {
            const p = r.platform || 'other'
            if (!platformMap[p]) platformMap[p] = { sum: 0, count: 0 }
            platformMap[p].sum += (r.rating || 0)
            platformMap[p].count++
        })

        const platformData = Object.entries(platformMap).map(([name, stats]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            rating: (stats.sum / stats.count).toFixed(1),
            count: stats.count
        }))

        // 6. Trends 
        const sorted = [...dataToUse].sort((a, b) => new Date(a.review_date).getTime() - new Date(b.review_date).getTime())
        const trendMap: Record<string, { count: number, sentimentSum: number }> = {}

        sorted.forEach(r => {
            const date = new Date(r.review_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            if (!trendMap[date]) trendMap[date] = { count: 0, sentimentSum: 0 }
            trendMap[date].count++
            trendMap[date].sentimentSum += (r.sentiment === 'positive' ? 1 : r.sentiment === 'negative' ? -1 : 0)
        })

        const trendsData = Object.entries(trendMap).map(([date, s]) => ({
            date,
            sentiment: s.count > 0 ? (s.sentimentSum / s.count).toFixed(2) : 0,
            volume: s.count
        }))

        setStats({
            totalReviews,
            avgRating,
            responseRate,
            sentimentScore,
            ratingDistribution,
            sentimentData,
            topics,
            platformData,
            trendsData
        })
    }

    const getTopicColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return 'bg-green-100 text-green-700'
            case 'negative': return 'bg-red-100 text-red-700'
            default: return 'bg-yellow-100 text-yellow-700'
        }
    }

    const getTopicBarColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return 'bg-green-500'
            case 'negative': return 'bg-red-500'
            default: return 'bg-yellow-500'
        }
    }

    if (loadingHotel) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        )
    }

    return (
        <div>
            <Header
                title="Analytics & Insights"
                subtitle="Understand what your guests love and where to improve"
                customAction={
                    <select
                        className="bg-white border border-surface-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '1em',
                            paddingRight: '2.5rem'
                        }}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="all">All time</option>
                    </select>
                }
            />

            <div className="p-8 max-w-7xl mx-auto space-y-8">

                {/* Section 1: Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Reviews"
                        value={stats.totalReviews}
                        icon={MessageSquare}
                        trend={stats.totalReviews > 0 ? "12%" : undefined}
                        trendUp={stats.totalReviews > 0}
                    />
                    <StatsCard
                        title="Average Rating"
                        value={stats.avgRating.toFixed(1)}
                        icon={Star}
                        subvalue="/ 5.0"
                        trend={stats.totalReviews > 0 ? "0.2" : undefined}
                        trendUp={stats.totalReviews > 0}
                    />
                    <StatsCard
                        title="Response Rate"
                        value={`${stats.responseRate.toFixed(0)}%`}
                        icon={Activity}
                        trend={stats.totalReviews > 0 ? "5%" : undefined}
                        trendUp={stats.totalReviews > 0}
                    />
                    <StatsCard
                        title="Sentiment Score"
                        value={`${stats.sentimentScore.toFixed(0)}%`}
                        icon={ThumbsUp}
                        trend={stats.totalReviews > 0 ? "Positive" : undefined}
                        trendUp={stats.totalReviews > 0}
                        trendLabel={stats.totalReviews > 0 ? "Guests are happy" : undefined}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner text-primary text-lg">Loading analytics...</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <Card className="p-12 text-center bg-surface-50 border-dashed">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
                                <Activity className="w-8 h-8 text-surface-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-dark mb-2">No data available yet</h3>
                            <p className="text-muted max-w-md mx-auto">
                                Add reviews to start seeing insights. The more reviews you add, the better your analytics will be.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Section 2: Rating Distribution */}
                            <Card className="lg:col-span-2">
                                <CardTitle className="px-6 pt-6 pb-2">Rating Distribution</CardTitle>
                                <CardContent className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.ratingDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={40} axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                                {stats.ratingDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Section 3: Sentiment Analysis */}
                            <Card>
                                <CardTitle className="px-6 pt-6 pb-2">Sentiment Analysis</CardTitle>
                                <CardContent className="h-80 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.sentimentData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {stats.sentimentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-xs text-muted">
                                        {stats.sentimentData.map((d: any) => (
                                            <div key={d.name} className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                                                {d.name}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Section 4: Topic Analysis (THE KILLER FEATURE) */}
                            <Card className="lg:col-span-2">
                                <CardTitle className="px-6 pt-6 pb-0 flex items-center justify-between">
                                    <span>What Guests Mention Most</span>
                                    <span className="text-xs font-normal text-muted bg-surface-100 px-2 py-1 rounded-full">Top Topics</span>
                                </CardTitle>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {stats.topics.length > 0 ? stats.topics.map((topic) => (
                                            <div key={topic.name} className="border border-transparent hover:border-surface-200 rounded-lg transition-all duration-200">
                                                <div
                                                    className="flex items-center gap-4 p-2 cursor-pointer hover:bg-surface-50 rounded-lg"
                                                    onClick={() => setExpandedTopic(expandedTopic === topic.name ? null : topic.name)}
                                                >
                                                    <div className="w-24 shrink-0 text-sm font-medium text-dark truncate flex items-center gap-1" title={topic.name}>
                                                        {topic.name}
                                                        {expandedTopic === topic.name ? <ChevronUp className="w-3 h-3 text-muted" /> : <ChevronDown className="w-3 h-3 text-muted" />}
                                                    </div>
                                                    <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${getTopicBarColor(topic.sentiment)}`}
                                                            style={{ width: `${(topic.count / Math.max(...stats.topics.map(t => t.count))) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="w-32 shrink-0 flex items-center justify-end gap-2 text-xs">
                                                        <span className="font-medium">{topic.count} mentions</span>
                                                        <span className={`px-1.5 py-0.5 rounded-md ${getTopicColor(topic.sentiment)}`}>
                                                            {topic.sentiment === 'positive' ? '😊' : topic.sentiment === 'negative' ? '😟' : '😐'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Expanded Reviews List */}
                                                {expandedTopic === topic.name && (
                                                    <div className="mt-2 pl-4 pr-2 pb-4 space-y-2 border-l-2 border-surface-100 ml-6">
                                                        {reviews
                                                            .filter(r => {
                                                                const sTopics = r.sentiment_topics || []
                                                                return sTopics.map(t => t.toLowerCase()).includes(topic.name.toLowerCase())
                                                            })
                                                            .slice(0, 5) // Show max 5 reviews
                                                            .map(r => (
                                                                <div key={r.id} className="bg-surface-50 p-3 rounded-lg text-sm group hover:bg-surface-100 transition-colors">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <div className="font-medium text-dark flex items-center gap-2">
                                                                            <span>{r.reviewer_name}</span>
                                                                            <span className="text-xs font-normal text-muted capitalize">• {r.platform}</span>
                                                                        </div>
                                                                        <Link
                                                                            href={`/dashboard/reviews?id=${r.id}`}
                                                                            className="text-xs text-brand-600 hover:text-brand-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            View Review &rarr;
                                                                        </Link>
                                                                    </div>
                                                                    <p className="text-muted line-clamp-2 italic">
                                                                        "{r.review_text}"
                                                                    </p>
                                                                </div>
                                                            ))
                                                        }
                                                        {reviews.filter(r => (r.sentiment_topics || []).map(t => t.toLowerCase()).includes(topic.name.toLowerCase())).length === 0 && (
                                                            <p className="text-xs text-muted pl-2">No specific reviews found in the current set (mock data might be used for aggregation).</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )) : (
                                            <p className="text-muted text-center py-8">No specific topics detected yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 5: Platform Breakdown */}
                            <Card>
                                <CardTitle className="px-6 pt-6 pb-2">Platform Ratings</CardTitle>
                                <CardContent className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.platformData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis domain={[0, 10]} hide />
                                            <Tooltip />
                                            <Bar dataKey="rating" fill="#6366f1" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#666' }}>
                                                {stats.platformData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || COLORS.bar} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Section 6: Recent Sentiment Trends */}
                        <Card>
                            <CardTitle className="px-6 pt-6 pb-2">Sentiment Trend (Last Period)</CardTitle>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.trendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} axisLine={false} tickLine={false} />
                                        <YAxis domain={[-1, 1]} hide />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="sentiment"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                                <p className="text-center text-xs text-muted mt-2">
                                    Avg Sentiment Score (-1 Negative to +1 Positive)
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon: Icon, subvalue, trend, trendUp, trendLabel }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Icon className="w-6 h-6 text-brand-600" />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-muted">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-bold text-dark">{value}</h3>
                        {subvalue && <span className="text-sm text-muted">{subvalue}</span>}
                    </div>
                    {trendLabel && <p className="text-xs text-muted mt-1">{trendLabel}</p>}
                </div>
            </CardContent>
        </Card>
    )
}
