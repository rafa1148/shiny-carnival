'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/components/ui'
import {
    User,
    Shield,
    CreditCard,
    Zap,
    Mail,
    CheckCircle,
    AlertTriangle,
    LogOut,
    Loader2,
    Trash2,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import type { User as UserType } from '@/types/database'

export default function AccountPage() {
    const { user, signOut } = useAuth()
    const [profile, setProfile] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [user])

    const fetchProfile = async () => {
        if (!user) return
        try {
            setLoading(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error
            if (data) {
                setProfile(data)
                setNewName(data.full_name || '')
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateName = async () => {
        if (!user) return
        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: newName })
                .eq('id', user.id)

            if (error) throw error
            setProfile(prev => prev ? { ...prev, full_name: newName } : null)
            setIsEditingName(false)
        } catch (error) {
            console.error('Error updating name:', error)
            alert('Failed to update name')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you ABSOLUTELY SURE? This action cannot be undone. This will permanently delete your account, hotels, and remove your data from our servers.')) {
            return
        }
        // In a real app, this would likely be an API call to a secure endpoint that handles deletion
        // For now, we will just sign out as we don't have a backend deletion route yet
        alert('Account deletion requires contacting support in this demo.')
    }

    const getPlanDetails = (plan: string) => {
        switch (plan) {
            case 'pro':
                return { name: 'Pro Plan', limitAi: 'Unlimited', limitEmail: 'Unlimited', price: '$29' }
            case 'enterprise':
                return { name: 'Enterprise Plan', limitAi: 'Unlimited', limitEmail: 'Unlimited', price: '$99' }
            default:
                return { name: 'Free Plan', limitAi: 10, limitEmail: 20, price: '$0' }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        )
    }

    const plan = profile?.subscription_plan || 'free'
    const details = getPlanDetails(plan)

    // Calculate usage percentages for Free plan
    const aiUsage = profile?.ai_responses_used || 0
    const emailUsage = profile?.guest_emails_used || 0
    const aiLimit = typeof details.limitAi === 'number' ? details.limitAi : 100 // Visual fallback for unlimited
    const emailLimit = typeof details.limitEmail === 'number' ? details.limitEmail : 100

    const aiPercent = typeof details.limitAi === 'number' ? Math.min((aiUsage / details.limitAi) * 100, 100) : 0
    const emailPercent = typeof details.limitEmail === 'number' ? Math.min((emailUsage / details.limitEmail) * 100, 100) : 0

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Header
                title="Account Settings"
                subtitle="Manage your profile and subscription"
            />

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-brand-600" />
                        Profile Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-surface-700">Email Address</label>
                            <Input value={user?.email || ''} disabled className="bg-surface-50" />
                            <p className="text-xs text-surface-500">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-surface-700">Full Name</label>
                            <div className="flex gap-2">
                                <Input
                                    value={isEditingName ? newName : (profile?.full_name || '')}
                                    onChange={(e) => setNewName(e.target.value)}
                                    disabled={!isEditingName}
                                    placeholder="Your Name"
                                />
                                {isEditingName ? (
                                    <div className="flex gap-2">
                                        <Button onClick={handleUpdateName} disabled={saving} size="sm">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                                        </Button>
                                        <Button variant="ghost" onClick={() => setIsEditingName(false)} size="sm">Cancel</Button>
                                    </div>
                                ) : (
                                    <Button variant="secondary" onClick={() => setIsEditingName(true)} size="sm">Edit</Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 flex items-center gap-2">
                        <Button variant="secondary" className="text-surface-600" onClick={() => alert('Password reset email sent!')}>
                            Change Password
                        </Button>
                        {(user as any)?.subscription_plan && (
                            <Badge variant="default" className="text-surface-600 bg-surface-100">{(user as any).subscription_plan}</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Current Plan Section */}
            <Card className="border-brand-200 shadow-brand-500/5">
                <CardHeader className="bg-brand-50/50 border-b border-brand-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-brand-900">
                            <CreditCard className="w-5 h-5 text-brand-600" />
                            Current Subscription
                        </CardTitle>
                        <Badge variant={plan === 'free' ? 'default' : 'brand'} className="uppercase">
                            {plan}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* AI Usage */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 font-medium text-surface-700">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    AI Responses
                                </span>
                                <span className="text-surface-500">
                                    {details.limitAi === 'Unlimited' ? 'Unlimited' : `${aiUsage} / ${details.limitAi}`} used
                                </span>
                            </div>
                            {typeof details.limitAi === 'number' && (
                                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-500"
                                        style={{ width: `${aiPercent}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Email Usage */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 font-medium text-surface-700">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    Guest Emails
                                </span>
                                <span className="text-surface-500">
                                    {details.limitEmail === 'Unlimited' ? 'Unlimited' : `${emailUsage} / ${details.limitEmail}`} used
                                </span>
                            </div>
                            {typeof details.limitEmail === 'number' && (
                                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${emailPercent}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-surface-500 bg-surface-50 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-brand-600" />
                        <span>Usage resets on {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} (Monthly)</span>
                    </div>
                </CardContent>
            </Card>

            {/* Plan Comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <Card className={`relative ${plan === 'free' ? 'border-primary-500 ring-2 ring-primary-500 shadow-xl scale-105 z-10' : 'hover:scale-105 transition-transform duration-300'}`}>
                    {plan === 'free' && (
                        <div className="absolute top-0 right-0 left-0 bg-primary-600 text-white text-xs font-bold text-center py-1.5 rounded-t-[2rem]">
                            CURRENT PLAN
                        </div>
                    )}
                    <CardHeader className={plan === 'free' ? 'pt-10' : ''}>
                        <CardTitle className="text-xl font-bold">Free Plan</CardTitle>
                        <p className="text-3xl font-bold text-surface-900 mt-2">$0<span className="text-sm font-normal text-surface-500">/mo</span></p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ul className="space-y-3 text-sm text-surface-600">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-500" /> 1 Hotel</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-500" /> 10 AI Responses/mo</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-500" /> 20 Guest Emails/mo</li>
                        </ul>
                        {plan === 'free' ? (
                            <Button variant="secondary" className="w-full pointer-events-none opacity-100 font-semibold" disabled>Current Plan</Button>
                        ) : (
                            <Button variant="secondary" className="w-full" disabled title="Downgrades not available via self-serve">Downgrade</Button>
                        )}
                    </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card className={`relative ${plan === 'pro' ? 'border-primary-500 ring-2 ring-primary-500 shadow-xl scale-105 z-10' : 'hover:scale-105 transition-transform duration-300 border-purple-100'}`}>
                    {plan === 'pro' && (
                        <div className="absolute top-0 right-0 left-0 bg-primary-600 text-white text-xs font-bold text-center py-1.5 rounded-t-[2rem]">
                            CURRENT PLAN
                        </div>
                    )}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        MOST POPULAR
                    </div>
                    <CardHeader className={plan === 'pro' ? 'pt-10' : ''}>
                        <CardTitle className="text-xl font-bold text-purple-900">Pro Plan</CardTitle>
                        <p className="text-3xl font-bold text-surface-900 mt-2">$29<span className="text-sm font-normal text-surface-500">/mo</span></p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ul className="space-y-3 text-sm text-surface-600">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> 1 Hotel</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Unlimited AI Responses</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Unlimited Guest Emails</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Priority Support</li>
                        </ul>
                        {plan === 'pro' ? (
                            <Button variant="secondary" className="w-full pointer-events-none" disabled>Current Plan</Button>
                        ) : (
                            <Button variant="primary" className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600" disabled title="Coming soon">Upgrade to Pro</Button>
                        )}
                    </CardContent>
                </Card>

                {/* Enterprise Plan */}
                <Card className={`relative ${plan === 'enterprise' ? 'border-primary-500 ring-2 ring-primary-500 shadow-xl scale-105 z-10' : 'hover:scale-105 transition-transform duration-300'}`}>
                    {plan === 'enterprise' && (
                        <div className="absolute top-0 right-0 left-0 bg-primary-600 text-white text-xs font-bold text-center py-1.5 rounded-t-[2rem]">
                            CURRENT PLAN
                        </div>
                    )}
                    <CardHeader className={plan === 'enterprise' ? 'pt-10' : ''}>
                        <CardTitle className="text-xl font-bold">Enterprise</CardTitle>
                        <p className="text-3xl font-bold text-surface-900 mt-2">$99<span className="text-sm font-normal text-surface-500">/mo</span></p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ul className="space-y-3 text-sm text-surface-600">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-surface-900" /> Up to 5 Hotels</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-surface-900" /> Unlimited AI Responses</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-surface-900" /> Unlimited Guest Emails</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-surface-900" /> API Access & Dedicated Support</li>
                        </ul>
                        {plan === 'enterprise' ? (
                            <Button variant="secondary" className="w-full pointer-events-none" disabled>Current Plan</Button>
                        ) : (
                            <Button variant="secondary" className="w-full" disabled title="Coming soon">Contact Sales</Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Danger Zone */}
            <Card className="border-red-100">
                <CardHeader className="bg-red-50/50 border-b border-red-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-900">
                        <Shield className="w-5 h-5 text-red-600" />
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-white">
                        <div>
                            <p className="font-medium text-surface-900">Log Out</p>
                            <p className="text-sm text-surface-500">Sign out of your account on this device</p>
                        </div>
                        <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={signOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Log Out
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50/30">
                        <div>
                            <p className="font-medium text-red-900">Delete Account</p>
                            <p className="text-sm text-red-700/80">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="danger" onClick={handleDeleteAccount}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
