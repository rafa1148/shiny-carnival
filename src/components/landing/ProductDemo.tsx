'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Star, RefreshCw, Copy, Check } from 'lucide-react'
import { Button, Badge } from '@/components/ui'

const SAMPLE_RESPONSE = "Dear Chen Wei Ming, thank you for your feedback. We sincerely apologize for the AC noise and breakfast issues you experienced. This does not meet our usual standards. We have alerted our maintenance and kitchen teams immediately to rectify this. We hope to have another chance to provide you with the flawless stay you deserve."

export function ProductDemo() {
    const [loading, setLoading] = useState(false)
    const [generated, setGenerated] = useState(false)
    const [displayedText, setDisplayedText] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (generated && displayedText.length < SAMPLE_RESPONSE.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(SAMPLE_RESPONSE.slice(0, displayedText.length + 1))
            }, 15) // Typing speed
            return () => clearTimeout(timeout)
        }
    }, [generated, displayedText])

    const handleGenerate = () => {
        setLoading(true)
        setGenerated(false)
        setDisplayedText('')

        setTimeout(() => {
            setLoading(false)
            setGenerated(true)
        }, 1500)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(SAMPLE_RESPONSE)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="py-20 px-6 bg-surface-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-surface-900 mb-4">See It In Action</h2>
                    <p className="text-lg text-surface-600">Generate professional review responses in seconds</p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 relative">
                    {/* Left: Bad Review */}
                    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-surface-200 transition-all duration-500 ease-in-out">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Booking.com</span>
                            <div className="flex text-amber-400">
                                {[1, 2, 3].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                {[4, 5].map(i => <Star key={i} className="w-3 h-3 text-surface-200 fill-current" />)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                                CW
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-surface-900">Chen Wei Ming</p>
                                <p className="text-xs text-surface-500">China</p>
                            </div>
                        </div>
                        <p className="text-surface-600 text-sm italic mb-4">
                            "The room was okay but the AC was noisy and breakfast was cold. Staff didn't seem to care properly when we complained."
                        </p>
                        <div className="flex gap-2">
                            <Badge variant="default" className="text-xs text-surface-500 bg-white border border-surface-200">Cleanliness</Badge>
                            <Badge variant="default" className="text-xs text-surface-500 bg-white border border-surface-200">Service</Badge>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="z-10 flex flex-col items-center gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || (generated && !loading)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${loading ? 'bg-surface-100 cursor-wait' :
                                generated ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-brand-600 hover:bg-brand-700 hover:scale-105'
                                }`}
                        >
                            {loading ? (
                                <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
                            ) : generated ? (
                                <RefreshCw className="w-6 h-6 text-white" /> // Icon to regenerate
                            ) : (
                                <Sparkles className="w-6 h-6 text-white" />
                            )}
                        </button>
                        <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">
                            {loading ? 'Generating...' : generated ? '' : 'Click Me'}
                        </span>
                    </div>

                    {/* Right: AI Response */}
                    <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl border border-brand-100 relative overflow-hidden transition-all duration-500 ${generated ? 'opacity-100 translate-x-0' : 'opacity-50'}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-500"></div>

                        {generated || loading ? (
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-brand-500" />
                                        <span className="text-sm font-bold text-surface-900">AI Response</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="brand" className="text-[10px] bg-brand-50 text-brand-700">English</Badge>
                                        <Badge variant="info" className="text-[10px] bg-purple-50 text-purple-700">Professional</Badge>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 bg-surface-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-surface-100 rounded w-full"></div>
                                        <div className="h-4 bg-surface-100 rounded w-5/6"></div>
                                        <div className="h-4 bg-surface-100 rounded w-4/5"></div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-surface-700 text-sm leading-relaxed min-h-[120px]">
                                            {displayedText}
                                            <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-brand-400 animate-pulse"></span>
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-surface-100 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <span className="text-xs text-surface-500">
                                                Generated in <span className="text-surface-900 font-medium font-mono">1.2s</span>
                                            </span>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={handleGenerate} title="Regenerate">
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={handleCopy}>
                                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                    <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-center h-[300px]">
                                <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles className="w-8 h-8 text-surface-300" />
                                </div>
                                <h3 className="text-surface-900 font-medium mb-1">Ready to Generate</h3>
                                <p className="text-surface-500 text-sm">Click the magic button to see HoteliaOS in action.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="flex justify-center gap-8 mt-12 text-surface-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-500" />
                        ~30s generation time
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-brand-500" />
                        7+ languages
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        ∞ unique responses
                    </div>
                </div>
            </div>
        </section>
    )
}

function Clock({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function Globe({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
