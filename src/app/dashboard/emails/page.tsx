'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardContent, CardHeader, Button, Badge, Input, Textarea, Select } from '@/components/ui'
import {
  Mail,
  Send,
  Star,
  Gift,
  Heart,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MousePointer,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  Link as LinkIcon,
} from 'lucide-react'
import { useHotel } from '@/lib/hooks/use-hotel'
import { createClient } from '@/lib/supabase'
import type { GuestEmail } from '@/types/database'
import { useAuth } from '@/lib/auth-context'

const emailTemplates = [
  {
    id: 'review_request',
    name: 'Post-Stay Review Request',
    icon: Star,
    description: 'Ask for a review and optionally offer a return discount',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    id: 'return_promo',
    name: 'Return Guest Promo',
    icon: Gift,
    description: 'Special offers for previous guests',
    color: 'text-brand-500 bg-brand-50',
  },
]

export default function EmailsPage() {
  const { hotel, loading: hotelLoading } = useHotel()
  const { user } = useAuth()
  const [emails, setEmails] = useState<GuestEmail[]>([])
  const [loadingEmails, setLoadingEmails] = useState(true)

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  // Booking Method & Offer State
  // Booking Method & Offer State
  const [bookingMethod, setBookingMethod] = useState<'booking_engine' | 'email' | 'whatsapp' | 'phone'>('booking_engine')
  const [includeOffer, setIncludeOffer] = useState(false)
  const [selectedOffers, setSelectedOffers] = useState<string[]>([])
  const [discountAmount, setDiscountAmount] = useState<string>('15')

  // Validation Logic
  const getValidationWarning = () => {
    if (!hotel) return null
    if (selectedTemplate === 'return_promo') {
      if (bookingMethod === 'booking_engine' && !hotel.direct_booking_url) {
        return 'Direct Booking URL is missing in Settings. Please add it to enable this method.'
      }
      if (bookingMethod === 'whatsapp' && !hotel.whatsapp_number) {
        return 'WhatsApp Number is missing in Settings. Please add it to enable this method.'
      }
      if (bookingMethod === 'phone' && !hotel.phone_number) {
        return 'Phone Number is missing in Settings. Please add it to enable this method.'
      }
    }
    return null
  }

  const validationWarning = getValidationWarning()
  const isSendDisabled = !guestName || !guestEmail || !selectedTemplate || isSending || !!validationWarning

  // Fetch Emails
  const fetchEmails = async () => {
    if (!hotel) return
    setLoadingEmails(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('guest_emails')
      .select('*')
      .eq('hotel_id', hotel.id)
      .order('sent_at', { ascending: false })

    if (error) {
      console.error('Error fetching emails:', error)
    } else {
      setEmails(data || [])
    }
    setLoadingEmails(false)
  }

  useEffect(() => {
    fetchEmails()
  }, [hotel])

  const handleSend = async () => {
    if (!hotel || !user || !selectedTemplate) return
    setIsSending(true)
    setSendError(null)

    try {
      // 1. Send via API
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          guestEmail,
          templateType: selectedTemplate,
          hotelName: hotel.name,
          hotelId: hotel.id,
          bookingMethod,
          includeOffer,
          selectedOffers,
          discountAmount,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to send email')

      // 2. Insert into DB
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from('guest_emails')
        .insert({
          hotel_id: hotel.id,
          guest_name: guestName,
          guest_email: guestEmail,
          template_type: selectedTemplate,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

      if (insertError) throw insertError

      // Success
      alert('Email sent successfully!')
      setShowCompose(false)
      setGuestName('')
      setGuestEmail('')
      setSelectedTemplate(null)
      setBookingMethod('booking_engine')
      setIncludeOffer(false)
      setSelectedOffers([])
      setDiscountAmount('15') // Reset
      fetchEmails()

    } catch (err: any) {
      console.error('Error sending email:', err)
      setSendError(err.message || 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="info"><Clock className="w-3 h-3 mr-1" />Sent</Badge>
      case 'opened':
        return <Badge variant="success"><Eye className="w-3 h-3 mr-1" />Opened</Badge>
      case 'clicked':
        return <Badge variant="success"><MousePointer className="w-3 h-3 mr-1" />Clicked</Badge>
      case 'failed':
        return <Badge variant="error"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      case 'draft':
        return <Badge variant="default">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTemplateInfo = (templateId: string) => {
    return emailTemplates.find(t => t.id === templateId)
  }

  const getPromoCode = () => {
    if (selectedOffers.length === 0) return ''

    // Logic: If multiple, simplify. If single, be specific.
    if (selectedOffers.length > 1) {
      if (selectedOffers.includes('Percentage Discount')) return `COMBO${discountAmount}`
      return 'SPECIALGIFT'
    }

    const offer = selectedOffers[0]
    if (offer === 'Percentage Discount') return `WELCOME${discountAmount}`
    if (offer === 'Free Breakfast') return 'FREEBREAKFAST'
    if (offer === 'Early Check-in') return 'EARLYBIRD'
    if (offer === 'Late Check-out') return 'LATECHECKOUT'
    if (offer === 'Room Upgrade') return 'UPGRADE'

    return 'WELCOMEBACK'
  }

  const getOfferText = () => {
    if (selectedOffers.length === 0) return ''

    const parts = []
    if (selectedOffers.includes('Percentage Discount')) parts.push(`${discountAmount}% off your next booking`)
    if (selectedOffers.includes('Free Breakfast')) parts.push('complimentary breakfast')
    if (selectedOffers.includes('Early Check-in')) parts.push('free early check-in')
    if (selectedOffers.includes('Late Check-out')) parts.push('free late check-out')
    if (selectedOffers.includes('Room Upgrade')) parts.push('a complimentary room upgrade')

    if (parts.length === 0) return ''
    if (parts.length === 1) return `Enjoy ${parts[0]} on your next stay!`

    // Join with commas and 'and'
    const last = parts.pop()
    return `Enjoy ${parts.join(', ')} and ${last} on your next stay!`
  }

  // Calculated Stats
  const emailsThisMonth = emails.filter(e => {
    if (!e.sent_at) return false
    const date = new Date(e.sent_at)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  const reviewRequests = emails.filter(e => e.template_type === 'review_request').length

  return (
    <div className="relative">
      <Header
        title="Guest Emails"
        subtitle="Send review requests and promotional emails to guests"
        action={{
          label: 'Compose Email',
          onClick: () => setShowCompose(true),
        }}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sent */}
          <Card className="bg-brand-50 border-brand-100">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="p-3 bg-brand-100 rounded-full text-brand-600">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-900">{emails.length}</p>
                <p className="text-sm text-brand-700 font-medium">Total Emails Sent</p>
              </div>
            </CardContent>
          </Card>

          {/* Emails This Month */}
          <Card className="bg-sky-50 border-sky-100">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-full text-sky-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-900">{emailsThisMonth}</p>
                <p className="text-sm text-sky-700 font-medium">Emails This Month</p>
              </div>
            </CardContent>
          </Card>

          {/* Review Requests */}
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">{reviewRequests}</p>
                <p className="text-sm text-amber-700 font-medium">Review Requests Sent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Templates */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-surface-900">Email Templates</h3>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <Card
                  key={template.id}
                  hover
                  className={`cursor-pointer transition-all hover:shadow-md border-transparent ring-1 ring-surface-200`}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setShowCompose(true)
                  }}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${template.color}`}>
                        <template.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-surface-900">{template.name}</h4>
                        <p className="text-sm text-surface-500">{template.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Emails List - Always Visible */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-surface-900">Recent Emails</h3>
              </CardHeader>
              <CardContent className="p-0">
                {loadingEmails ? (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : emails.length === 0 ? (
                  <div className="p-8 text-center text-muted">
                    <Mail className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No emails sent yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-100">
                    {emails.map((email) => {
                      const template = getTemplateInfo(email.template_type)
                      return (
                        <div key={email.id} className="flex items-center justify-between p-4 hover:bg-surface-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${template?.color || 'bg-surface-100'}`}>
                              {template?.icon ? <template.icon className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-medium text-surface-900">{email.guest_name}</p>
                              <p className="text-sm text-surface-500">{email.guest_email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-surface-500 mb-1">
                              {email.sent_at ? new Date(email.sent_at).toLocaleDateString() : '-'}
                            </p>
                            {getStatusBadge(email.status)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Compose Slide-over Sheet */}
      {showCompose && (
        <>
          <div
            className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setShowCompose(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-canvas shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/50 flex flex-col">
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-100 bg-white/50 backdrop-blur-md">
              <h2 className="text-xl font-bold text-dark">Compose Email</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 hover:bg-surface-100 rounded-full text-muted hover:text-dark transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Sheet Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {sendError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> {sendError}
                </div>
              )}
              {validationWarning && (
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-sm flex items-start gap-2 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{validationWarning}</span>
                </div>
              )}

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Select Template
                </label>
                <div className="space-y-2">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedTemplate === template.id
                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                        : 'border-surface-200 hover:border-brand-200 hover:bg-surface-50'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        <template.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${selectedTemplate === template.id ? 'text-brand-900' : 'text-surface-900'}`}>
                          {template.name}
                        </p>
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="w-4 h-4 text-brand-600 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Info */}
              <div className="space-y-4">
                <Input
                  label="Guest Name"
                  placeholder="e.g. Sarah Smith"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Guest Email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>

              {/* Offer Configuration (For Return Promo & Post-Stay w/ Toggle) */}

              {(selectedTemplate === 'return_promo' || (selectedTemplate === 'review_request' && includeOffer)) && (
                <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 space-y-3">
                  <div className="flex items-center gap-2 text-brand-800 font-medium">
                    <Gift className="w-4 h-4" />
                    Offer Customization
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-brand-900">
                      Select Offers (Multi-select)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Percentage Discount', 'Free Breakfast', 'Early Check-in', 'Late Check-out', 'Room Upgrade'].map((offer) => (
                        <div key={offer} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={offer}
                            checked={selectedOffers.includes(offer)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOffers([...selectedOffers, offer])
                              } else {
                                setSelectedOffers(selectedOffers.filter(o => o !== offer))
                              }
                            }}
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <label htmlFor={offer} className="text-sm text-gray-700 select-none cursor-pointer">
                            {offer}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOffers.includes('Percentage Discount') && (
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-brand-900 mb-1">
                        Discount Percentage (%)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        placeholder="e.g. 15"
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Toggle for Review Request to show Offer options */}
              {selectedTemplate === 'review_request' && !includeOffer && (
                <div
                  className="p-3 bg-surface-50 border border-dashed border-surface-300 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => setIncludeOffer(true)}
                >
                  <div className="flex items-center gap-2 text-surface-600">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">Add a promotional offer?</span>
                  </div>
                  <Plus className="w-4 h-4 text-surface-400" />
                </div>
              )}

              {selectedTemplate === 'review_request' && includeOffer && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIncludeOffer(false)
                      setSelectedOffers([])
                    }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove Offer
                  </button>
                </div>
              )}


              {/* Booking Method Selector (For Return Promo & Post-Stay w/ Offer) */}
              {(selectedTemplate === 'return_promo' || (selectedTemplate === 'review_request' && includeOffer)) && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-3">
                  <div className="flex items-center gap-2 text-purple-800 font-medium">
                    <LinkIcon className="w-4 h-4" />
                    Booking Method
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-1">
                      How should they book?
                    </label>
                    <Select
                      value={bookingMethod}
                      onChange={(e) => setBookingMethod(e.target.value as any)}
                      options={[
                        { value: 'booking_engine', label: 'Link to Booking Engine' },
                        { value: 'whatsapp', label: 'WhatsApp Button' },
                        { value: 'phone', label: 'Call to Book' },
                        { value: 'email', label: 'Reply to Book' },
                      ]}
                    />
                    <p className="text-xs text-purple-700 mt-1">
                      {bookingMethod === 'booking_engine' && "Button will link to your Direct Booking URL found in Settings."}
                      {bookingMethod === 'whatsapp' && "Button will open WhatsApp to your configured number."}
                      {bookingMethod === 'phone' && "Shows your hotel phone number to call."}
                      {bookingMethod === 'email' && "Instructs guest to reply to this email."}
                    </p>
                  </div>
                </div>
              )}

              {/* Preview */}
              {selectedTemplate && (
                <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
                  <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                    <Eye className="w-3 h-3" /> Live Preview
                  </div>
                  <div className="bg-white rounded-lg p-5 shadow-sm space-y-3">
                    <p className="font-serif text-lg text-brand-900 border-b border-surface-100 pb-2">
                      {selectedTemplate === 'review_request' && 'How was your stay? 🌟'}
                      {selectedTemplate === 'post_stay' && 'Thank you for visiting! ❤️'}
                      {selectedTemplate === 'return_promo' && 'A special gift for you 🎁'}
                    </p>
                    <div className="text-sm text-surface-600 space-y-2">
                      <p>Dear {guestName || 'Guest'},</p>
                      <p>
                        {selectedTemplate === 'review_request' &&
                          'We loved having you with us! deeply appreciate your feedback.'}
                        {selectedTemplate === 'return_promo' &&
                          'We miss you! Here is an exclusive offer for your next stay.'}
                      </p>

                      {/* Offer Text */}
                      {(selectedTemplate === 'return_promo' || (selectedTemplate === 'review_request' && includeOffer)) && selectedOffers.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded p-3 text-center my-3">
                          <p className="text-green-800 font-medium mb-1">{getOfferText()}</p>
                          <p className="text-xs text-green-600">Code: <span className="font-bold">{getPromoCode()}</span></p>
                        </div>
                      )}


                      {/* Dynamic CTA Preview */}
                      <div className="pt-2 text-center">
                        {(selectedTemplate === 'return_promo' || (selectedTemplate === 'review_request' && includeOffer)) ? (
                          <>
                            {bookingMethod === 'booking_engine' && (
                              <div className="inline-block bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                {selectedTemplate === 'review_request' ? 'Book Now & Save' : 'Book Now'}
                              </div>
                            )}
                            {bookingMethod === 'whatsapp' && (
                              <div className="inline-block bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-medium">Book on WhatsApp</div>
                            )}
                            {bookingMethod === 'phone' && (
                              <div className="text-brand-700 font-bold border border-brand-200 bg-brand-50 px-3 py-2 rounded-lg inline-block">📞 {hotel?.phone_number || 'Call to Book'}</div>
                            )}
                            {bookingMethod === 'email' && (
                              <div className="text-sm text-surface-500 italic">"Reply directly to this email to redeem..."</div>
                            )}
                          </>
                        ) : selectedTemplate === 'review_request' ? (
                          <div className="inline-block bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Rate on Google</div>
                        ) : (
                          // Post stay usually just thank you or maybe return link
                          <div className="text-sm text-surface-400 italic">No specific action required</div>
                        )}
                      </div>

                      {/* Availability Disclaimer */}
                      {(selectedTemplate === 'return_promo' || (selectedTemplate === 'review_request' && includeOffer)) && (
                        <p className="text-[10px] text-surface-400 italic text-center mt-4 border-t border-surface-100 pt-2">
                          *Offers are subject to availability. Please contact us directly to confirm your booking and offer eligibility.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Sheet Footer */}
            <div className="p-6 border-t border-surface-100 bg-white/50 backdrop-blur-md">
              <Button
                onClick={handleSend}
                size="lg"
                className="w-full shadow-xl shadow-brand-500/20"
                disabled={isSendDisabled}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>

        </>
      )}
    </div>
  )
}
