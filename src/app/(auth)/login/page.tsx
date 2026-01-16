'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, Button, Input } from '@/components/ui'
import { Hotel, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            setError('An unexpected error occurred')
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                    <Hotel className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-surface-900">HoteliaOS</span>
            </div>

            <Card>
                <CardContent className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
                        <p className="text-surface-500 mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-coral-50 text-coral-700 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@hotel.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-surface-500">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-xs text-surface-400 mt-6">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    )
}
