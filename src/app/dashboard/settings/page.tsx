'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, Button, Input, Textarea, Select } from '@/components/ui'
import { useHotel } from '@/lib/hooks/use-hotel'
import { createClient } from '@/lib/supabase'
import { Save, AlertTriangle, Building, Link as LinkIcon, Sparkles, CheckCircle2, X, Plus } from 'lucide-react'
import { BRAND_VOICE_OPTIONS, KEY_SELLING_POINTS_SUGGESTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const COUNTRIES = [
    'Malaysia', 'Thailand', 'Indonesia', 'Vietnam', 'Singapore', 'Philippines', 'Japan', 'Other'
]

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'th', label: 'Thai' },
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese (Simplified)' },
    { value: 'ko', label: 'Korean' },
]

export default function SettingsPage() {
    const { hotel, loading: loadingHotel } = useHotel()
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<string | null>(null)

    // Additional UI State
    const [selectedVoice, setSelectedVoice] = useState('')
    const [additionalVoice, setAdditionalVoice] = useState('')
    const [sellingPoints, setSellingPoints] = useState<string[]>([])
    const [customPoint, setCustomPoint] = useState('')

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        country: 'Malaysia',
        description: '',
        google_place_id: '',
        tripadvisor_url: '',
        booking_url: '',
        agoda_url: '',
        brand_voice: '',
        key_selling_points: '',
        default_language: 'en',
        sign_off_name: '',
        google_review_url: '',
        direct_booking_url: '',
        reply_to_email: '',
        whatsapp_number: '',
        phone_number: '',
    })

    // Load hotel data
    useEffect(() => {
        if (hotel) {
            setFormData({
                name: hotel.name || '',
                address: hotel.address || '',
                city: hotel.city || '',
                country: hotel.country || 'Malaysia',
                description: hotel.description || '',
                google_place_id: hotel.google_place_id || hotel.google_url || '',
                tripadvisor_url: hotel.tripadvisor_url || '',
                booking_url: hotel.booking_url || '',
                agoda_url: hotel.agoda_url || '',
                brand_voice: hotel.brand_voice || '',
                key_selling_points: hotel.key_selling_points || '',
                default_language: hotel.default_language || 'en',
                sign_off_name: hotel.sign_off_name || '',
                google_review_url: hotel.google_review_url || '',
                direct_booking_url: hotel.direct_booking_url || '',
                reply_to_email: hotel.reply_to_email || '',
                whatsapp_number: hotel.whatsapp_number || '',
                phone_number: hotel.phone_number || '',
            })

            // Parse Brand Voice
            if (hotel.brand_voice) {
                const parts = hotel.brand_voice.split(' | ')
                const voiceId = parts[0]
                // Check if the first part is a valid ID
                const isPredefined = BRAND_VOICE_OPTIONS.some(opt => opt.id === voiceId)

                if (isPredefined) {
                    setSelectedVoice(voiceId)
                    setAdditionalVoice(parts.slice(1).join(' | '))
                } else {
                    // Fallback for completely custom or old data
                    setSelectedVoice('')
                    setAdditionalVoice(hotel.brand_voice)
                }
            }

            // Parse Key Selling Points
            if (hotel.key_selling_points) {
                setSellingPoints(hotel.key_selling_points.split(',').map(s => s.trim()).filter(Boolean))
            }
        }
    }, [hotel])

    // Auto-save logic
    const handleAutoSave = async (field: string, value: string) => {
        if (!hotel) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('hotels')
                .update({ [field]: value })
                .eq('id', hotel.id)

            if (error) throw error

            // Show saved indicator
            setLastSaved(field)
            setTimeout(() => setLastSaved(null), 2000)

            console.log(`Auto-saved ${field}`)
        } catch (error) {
            console.error(`Error auto-saving ${field}:`, error)
        }
    }

    const handleBlur = (field: string, value: string) => {
        // Only save if value changed from initial load OR just save always on blur?
        // To avoid complexity, we just save. Supabase is fast.
        // Optimization: check against hotel[field] if strict, but local state might have drifted.
        // We'll just save.
        handleAutoSave(field, value)
    }

    // Manual Save (Full form)
    const handleSave = async () => {
        if (!hotel) return
        if (!formData.name.trim()) {
            alert('Hotel Name is required')
            return
        }

        setSaving(true)
        try {
            const supabase = createClient()
            const updateData = {
                name: formData.name,
                city: formData.city,
                country: formData.country,
                description: formData.description,
                google_place_id: formData.google_place_id,
                tripadvisor_url: formData.tripadvisor_url,
                booking_url: formData.booking_url,
                agoda_url: formData.agoda_url,
                brand_voice: formData.brand_voice,
                key_selling_points: formData.key_selling_points,
                default_language: formData.default_language,
                google_review_url: formData.google_review_url,
                direct_booking_url: formData.direct_booking_url,
                reply_to_email: formData.reply_to_email,
                whatsapp_number: formData.whatsapp_number,
                phone_number: formData.phone_number,
                sign_off_name: formData.sign_off_name,
                address: formData.address,
            }

            const { error } = await supabase
                .from('hotels')
                .update(updateData)
                .eq('id', hotel.id)

            if (error) throw error

            alert('Settings saved successfully!')
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    // Handlers for Brand Voice
    const updateBrandVoice = (voiceId: string, additional: string) => {
        let final = voiceId
        if (additional.trim()) {
            final = final ? `${final} | ${additional.trim()}` : additional.trim()
        }
        setFormData(prev => ({ ...prev, brand_voice: final }))
        handleAutoSave('brand_voice', final)
    }

    const handleVoiceSelect = (id: string) => {
        setSelectedVoice(id)
        updateBrandVoice(id, additionalVoice)
    }

    const handleAdditionalVoiceBlur = () => {
        updateBrandVoice(selectedVoice, additionalVoice)
    }

    // Handlers for Key Selling Points
    const updateSellingPoints = (points: string[]) => {
        const final = points.join(', ')
        setSellingPoints(points)
        setFormData(prev => ({ ...prev, key_selling_points: final }))
        handleAutoSave('key_selling_points', final)
    }

    const handleAddPoint = (point: string) => {
        if (!sellingPoints.includes(point) && sellingPoints.length < 10) {
            updateSellingPoints([...sellingPoints, point])
        }
    }

    const handleRemovePoint = (pointToRemove: string) => {
        updateSellingPoints(sellingPoints.filter(p => p !== pointToRemove))
    }

    const handleCustomPointAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && customPoint.trim()) {
            e.preventDefault()
            handleAddPoint(customPoint.trim())
            setCustomPoint('')
        }
    }

    const handleDeleteHotel = async () => {
        if (!confirm('Are you sure you want to permanently DELETE your hotel? This will remove all reviews and data. This action cannot be undone.')) return

        // In a real app we might ask them to type the hotel name to confirm
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('hotels')
                .delete()
                .eq('id', hotel?.id)

            if (error) throw error

            alert('Hotel deleted. You will be redirected.')
            window.location.href = '/'
        } catch (error) {
            console.error('Error deleting hotel:', error)
            alert('Failed to delete hotel')
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
                title="Hotel Settings"
                subtitle="Manage your hotel profile and AI preferences"
            />

            <div className="p-8 max-w-4xl mx-auto space-y-8">

                {/* Hotel Information */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
                            <Building className="w-5 h-5 text-brand-600" />
                            <h2 className="text-lg font-semibold text-dark">Hotel Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="hotelName" className="text-sm font-medium text-dark block mb-1">Hotel Name <span className="text-red-500">*</span></label>
                                <Input
                                    id="hotelName"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    onBlur={() => handleBlur('name', formData.name)}
                                    placeholder="e.g. The Grand Hotel"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="country" className="text-sm font-medium text-dark block mb-1">Country</label>
                                <Select
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, country: e.target.value }))
                                        handleAutoSave('country', e.target.value)
                                    }}
                                    options={COUNTRIES.map(c => ({ value: c, label: c }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium text-dark block mb-1">Address</label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    onBlur={() => handleBlur('address', formData.address)}
                                    placeholder="e.g. 123 Jalan Ampang"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium text-dark block mb-1">City</label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                    onBlur={() => handleBlur('city', formData.city)}
                                    placeholder="e.g. Kuala Lumpur"
                                />
                            </div>
                        </div>



                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-dark block mb-1">Hotel Description</label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                onBlur={() => handleBlur('description', formData.description)}
                                placeholder="Brief description of your hotel for AI context..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Platform & Email Links */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
                            <LinkIcon className="w-5 h-5 text-brand-600" />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-dark">Links & Connections</h2>
                                <p className="text-sm text-muted font-normal mt-0.5">
                                    URLs for review platforms and email actions
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Critical Email Links */}
                            <div className="bg-brand-50 rounded-xl p-4 space-y-4 border border-brand-100">
                                <h3 className="text-sm font-semibold text-brand-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Important for Guest Emails
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="google_review_url" className="text-sm font-medium text-dark block mb-1">
                                            Google Review Link (for Requests)
                                        </label>
                                        <Input
                                            id="google_review_url"
                                            value={formData.google_review_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, google_review_url: e.target.value }))}
                                            onBlur={() => handleBlur('google_review_url', formData.google_review_url)}
                                            placeholder="https://g.page/r/YOUR_ID/review"
                                        />
                                        <p className="text-xs text-muted">Direct link for guests to leave a review.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="direct_booking_url" className="text-sm font-medium text-dark block mb-1">
                                            Direct Booking Link (for Promos)
                                        </label>
                                        <Input
                                            id="direct_booking_url"
                                            value={formData.direct_booking_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, direct_booking_url: e.target.value }))}
                                            onBlur={() => handleBlur('direct_booking_url', formData.direct_booking_url)}
                                            placeholder="https://yourhotel.com/book"
                                        />
                                        <p className="text-xs text-muted">Where guests should go to book with offers.</p>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="reply_to_email" className="text-sm font-medium text-dark block mb-1">
                                            Reply-To Email (Optional)
                                        </label>
                                        <Input
                                            id="reply_to_email"
                                            value={formData.reply_to_email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, reply_to_email: e.target.value }))}
                                            onBlur={() => handleBlur('reply_to_email', formData.reply_to_email)}
                                            placeholder="reservations@yourhotel.com"
                                        />
                                        <p className="text-xs text-muted">Where guest replies will be sent. If empty, uses noreply.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="whatsapp_number" className="text-sm font-medium text-dark block mb-1">
                                            WhatsApp Number
                                        </label>
                                        <Input
                                            id="whatsapp_number"
                                            value={formData.whatsapp_number}
                                            onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                                            onBlur={() => handleBlur('whatsapp_number', formData.whatsapp_number)}
                                            placeholder="e.g. 60123456789 (No + or spaces)"
                                        />
                                        <p className="text-xs text-muted">Used for 'Book via WhatsApp' buttons.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone_number" className="text-sm font-medium text-dark block mb-1">
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phone_number"
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                            onBlur={() => handleBlur('phone_number', formData.phone_number)}
                                            placeholder="e.g. +60 3-2141 2222"
                                        />
                                        <p className="text-xs text-muted">Displayed for 'Call to Book'.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-surface-100" />

                            {/* Standard Profile Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="google_place_id" className="text-sm font-medium text-dark block mb-1">Google Maps / Place ID</label>
                                    <Input
                                        id="google_place_id"
                                        value={formData.google_place_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, google_place_id: e.target.value }))}
                                        onBlur={() => handleBlur('google_place_id', formData.google_place_id)}
                                        placeholder="Place ID or Maps Link"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="tripadvisor_url" className="text-sm font-medium text-dark block mb-1">TripAdvisor URL</label>
                                    <Input
                                        id="tripadvisor_url"
                                        value={formData.tripadvisor_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tripadvisor_url: e.target.value }))}
                                        onBlur={() => handleBlur('tripadvisor_url', formData.tripadvisor_url)}
                                        placeholder="https://tripadvisor.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="booking_url" className="text-sm font-medium text-dark block mb-1">Booking.com URL</label>
                                    <Input
                                        id="booking_url"
                                        value={formData.booking_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, booking_url: e.target.value }))}
                                        onBlur={() => handleBlur('booking_url', formData.booking_url)}
                                        placeholder="https://booking.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="agoda_url" className="text-sm font-medium text-dark block mb-1">Agoda URL</label>
                                    <Input
                                        id="agoda_url"
                                        value={formData.agoda_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, agoda_url: e.target.value }))}
                                        onBlur={() => handleBlur('agoda_url', formData.agoda_url)}
                                        placeholder="https://agoda.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Response Settings */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
                            <Sparkles className="w-5 h-5 text-brand-600" />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-dark">AI Response Settings</h2>
                                <p className="text-sm text-muted font-normal mt-0.5">
                                    Customize how the AI writes replies
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Brand Voice Section */}
                            <div>
                                <label className="text-sm font-medium text-dark block mb-4">Brand Voice & Tone</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {BRAND_VOICE_OPTIONS.map((option) => {
                                        const isSelected = selectedVoice === option.id
                                        return (
                                            <div
                                                key={option.id}
                                                onClick={() => handleVoiceSelect(option.id)}
                                                className={cn(
                                                    'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-soft group',
                                                    isSelected
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-surface-200 bg-white hover:border-brand-200'
                                                )}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="text-2xl">{option.emoji}</div>
                                                    <div className="flex-1">
                                                        <h3 className={cn(
                                                            'font-semibold mb-1',
                                                            isSelected ? 'text-brand-900' : 'text-surface-900'
                                                        )}>
                                                            {option.title}
                                                        </h3>
                                                        <p className={cn(
                                                            'text-sm leading-tight',
                                                            isSelected ? 'text-brand-700' : 'text-surface-500'
                                                        )}>
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="bg-brand-500 text-white rounded-full p-1">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="max-w-xl">
                                    <label className="text-xs text-muted block mb-1">Additional Preferences (Optional)</label>
                                    <Input
                                        placeholder="e.g. Always mention our rooftop pool"
                                        value={additionalVoice}
                                        onChange={(e) => setAdditionalVoice(e.target.value)}
                                        onBlur={handleAdditionalVoiceBlur}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-surface-100 my-6"></div>

                            {/* Key Selling Points Section */}
                            <div>
                                <label className="text-sm font-medium text-dark block mb-2">Key Selling Points</label>
                                <p className="text-xs text-muted mb-3">The AI will mention these when relevant to the review.</p>

                                <div className="border border-surface-200 rounded-xl p-4 bg-surface-50/50">
                                    {/* Active Chips */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {sellingPoints.map((point) => (
                                            <div key={point} className="inline-flex items-center gap-1 bg-white border border-surface-200 shadow-sm px-3 py-1.5 rounded-full text-sm font-medium text-surface-700">
                                                {point}
                                                <button onClick={() => handleRemovePoint(point)} className="text-surface-400 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="inline-flex items-center min-w-[150px]">
                                            <Plus className="w-4 h-4 text-surface-400 mr-2" />
                                            <input
                                                type="text"
                                                className="bg-transparent border-none focus:ring-0 p-0 text-sm placeholder:text-surface-400 w-full"
                                                placeholder="Add custom..."
                                                value={customPoint}
                                                onChange={(e) => setCustomPoint(e.target.value)}
                                                onKeyDown={handleCustomPointAdd}
                                            />
                                        </div>
                                    </div>

                                    {/* Suggestions */}
                                    <div>
                                        <p className="text-xs font-medium text-surface-500 mb-2 uppercase tracking-wider">Suggestions</p>
                                        <div className="flex flex-wrap gap-2">
                                            {KEY_SELLING_POINTS_SUGGESTIONS.map((suggestion) => {
                                                if (sellingPoints.includes(suggestion)) return null
                                                return (
                                                    <button
                                                        key={suggestion}
                                                        onClick={() => handleAddPoint(suggestion)}
                                                        className="px-3 py-1 rounded-full bg-white border border-surface-200 text-xs font-medium text-surface-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
                                                    >
                                                        + {suggestion}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-surface-100 my-6"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="default_language" className="text-sm font-medium text-dark block mb-1">Response Language</label>
                                    <Select
                                        id="default_language"
                                        value={formData.default_language}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, default_language: e.target.value }))
                                            handleAutoSave('default_language', e.target.value)
                                        }}
                                        options={LANGUAGES}
                                    />
                                    <p className="text-xs text-muted">Default language for generated replies.</p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="sign_off_name" className="text-sm font-medium text-dark block mb-1">Sign-off Name</label>
                                    <Input
                                        id="sign_off_name"
                                        value={formData.sign_off_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sign_off_name: e.target.value }))}
                                        onBlur={() => handleBlur('sign_off_name', formData.sign_off_name)}
                                        placeholder="E.g., The Grand Hotel Team"
                                    />
                                    <p className="text-xs text-muted">How responses should be signed.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-red-600">
                                This will permanently delete your hotel and all associated reviews. This action cannot be undone.
                            </p>
                            <Button
                                variant="danger"
                                onClick={handleDeleteHotel}
                            >
                                Delete Hotel
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end pt-4 pb-12">
                    <Button
                        size="lg"
                        loading={saving}
                        onClick={handleSave}
                        className="w-full md:w-auto min-w-[150px]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>

            </div>
        </div>
    )
}
