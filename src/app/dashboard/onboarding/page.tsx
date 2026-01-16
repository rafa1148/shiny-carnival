'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, Button, Input, Select, Textarea } from '@/components/ui'
import { Header } from '@/components/layout'
import {
    Hotel,
    MapPin,
    Globe,
    MessageSquare,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Building2,
    Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAND_VOICE_OPTIONS } from '@/lib/constants'

// Step definitions
const STEPS = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Platform Links', icon: Globe },
    { id: 3, title: 'Brand Voice', icon: MessageSquare },
]

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        country: 'Malaysia',
        website: '',
        google_place_id: '',
        tripadvisor_url: '',
        booking_url: '',
        agoda_url: '',
        brand_voice: '', // Stores the ID: e.g. "friendly_warm"
        additional_voice: '', // Stores optional text
    })

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        // Validation per step
        if (currentStep === 1) {
            if (!formData.name.trim() || !formData.city.trim()) {
                setError('Please fill in all required fields.')
                return
            }
        }

        if (currentStep === 3) {
            if (!formData.brand_voice) {
                setError('Please select a brand voice.')
                return
            }
        }

        if (currentStep < 3) {
            setError('')
            setCurrentStep((prev) => prev + 1)
        } else {
            handleSubmit()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setError('')
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleSubmit = async () => {
        if (!user) return
        setIsLoading(true)
        setError('')

        try {
            const supabase = createClient()

            // Combine selected voice + additional preferences
            // e.g. "friendly_warm | Always mention pool"
            let finalVoice = formData.brand_voice
            if ((formData as any).additional_voice?.trim()) {
                finalVoice = `${finalVoice} | ${(formData as any).additional_voice.trim()}`
            }

            const { error: insertError } = await supabase.from('hotels').insert({
                user_id: user.id,
                name: formData.name,
                city: formData.city,
                country: formData.country,
                website: formData.website || null,
                google_place_id: formData.google_place_id || null,
                tripadvisor_url: formData.tripadvisor_url || null,
                booking_url: formData.booking_url || null,
                agoda_url: formData.agoda_url || null,
                brand_voice: finalVoice,
            })

            if (insertError) throw insertError

            // Redirect to dashboard on success
            router.push('/dashboard')
            router.refresh()

        } catch (err: any) {
            console.error('Error creating hotel:', err)
            setError(err.message || 'Failed to create hotel profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">
                                    Hotel Name <span className="text-accent">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Grand Hyatt Kuala Lumpur"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="bg-surface-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        City <span className="text-accent">*</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. Kuala Lumpur"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        icon={<MapPin className="w-4 h-4" />}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-2">
                                        Country
                                    </label>
                                    <Select
                                        value={formData.country}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                        options={[
                                            { value: 'Malaysia', label: 'Malaysia' },
                                            { value: 'Singapore', label: 'Singapore' },
                                            { value: 'Thailand', label: 'Thailand' },
                                            { value: 'Indonesia', label: 'Indonesia' },
                                            { value: 'Vietnam', label: 'Vietnam' },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">
                                    Website <span className="text-xs text-muted-foreground">(Optional)</span>
                                </label>
                                <Input
                                    placeholder="https://..."
                                    value={formData.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    icon={<Globe className="w-4 h-4" />}
                                />
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-primary-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <p className="text-sm text-primary-900">
                                Connecting your platform links helps us automatically import reviews and track your ratings. You can assume these are optional for now.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">
                                    Google Place ID / Maps URL
                                </label>
                                <Input
                                    placeholder="e.g. ChIJ..."
                                    value={formData.google_place_id}
                                    onChange={(e) => handleChange('google_place_id', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">
                                    TripAdvisor URL
                                </label>
                                <Input
                                    placeholder="https://www.tripadvisor.com/..."
                                    value={formData.tripadvisor_url}
                                    onChange={(e) => handleChange('tripadvisor_url', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">
                                    Booking.com URL
                                </label>
                                <Input
                                    placeholder="https://www.booking.com/..."
                                    value={formData.booking_url}
                                    onChange={(e) => handleChange('booking_url', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">
                                    Agoda URL
                                </label>
                                <Input
                                    placeholder="https://www.agoda.com/..."
                                    value={formData.agoda_url}
                                    onChange={(e) => handleChange('agoda_url', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-surface-50 p-4 rounded-xl border border-surface-100">
                            <p className="text-sm text-muted">
                                Our AI uses your brand voice to generate review replies that sound exactly like you.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-4">
                                Choose your Brand Voice
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {BRAND_VOICE_OPTIONS.map((option) => {
                                    const isSelected = formData.brand_voice === option.id
                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => handleChange('brand_voice', option.id)}
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
                                                        'text-sm leading-relaxed',
                                                        isSelected ? 'text-brand-700' : 'text-surface-500 group-hover:text-surface-600'
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

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-muted mb-2">
                                    Any additional preferences? <span className="text-xs text-muted-foreground">(Optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g. Always mention our rooftop pool"
                                    value={(formData as any).additional_voice || ''}
                                    onChange={(e) => handleChange('additional_voice', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div>
            <Header
                title="Setup Your Hotel"
                subtitle="Step-by-step wizard to configure your property."
            />

            <div className="p-8 flex justify-center">
                <div className="max-w-2xl w-full">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            {/* Connecting Line */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-100 -z-10 rounded-full" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
                                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                            />

                            {STEPS.map((step) => {
                                const isActive = step.id === currentStep
                                const isCompleted = step.id < currentStep

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 bg-canvas px-2">
                                        <div
                                            className={cn(
                                                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-canvas',
                                                isActive
                                                    ? 'bg-primary text-white shadow-lg scale-110'
                                                    : isCompleted
                                                        ? 'bg-primary text-white'
                                                        : 'bg-surface-200 text-surface-500'
                                            )}
                                        >
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                                        </div>
                                        <span
                                            className={cn(
                                                'text-xs font-medium transition-colors duration-300',
                                                isActive ? 'text-primary' : 'text-muted'
                                            )}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Form Card */}
                    <Card className="overflow-hidden">
                        <CardContent className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-dark mb-1">{STEPS[currentStep - 1].title}</h2>
                                <p className="text-muted text-sm">Step {currentStep} of {STEPS.length}</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-accent-50 text-accent-700 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="min-h-[300px]">
                                {renderStepContent()}
                            </div>

                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={currentStep === 1 || isLoading}
                                    className={cn(currentStep === 1 && 'invisible')}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    loading={isLoading}
                                    className="min-w-[140px]"
                                >
                                    {currentStep === 3 ? (
                                        <>
                                            Complete Setup
                                            {!isLoading && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
