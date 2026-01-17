import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const emailTemplates = {
  review_request: {
    subject: 'We hope you enjoyed your stay! 🌟',
    generateHtml: (guestName: string, hotelName: string, links: any, bookingMethod: string = 'booking_engine', selectedOffers: string[] = [], discountAmount: string = '15', includeOffer: boolean = false) => {

      let offerSection = ''
      if (includeOffer && selectedOffers.length > 0) {
        let offerText = ''
        const parts = []
        let promoCode = ''

        if (selectedOffers.includes('Percentage Discount')) parts.push(`${discountAmount}% off your next booking`)
        if (selectedOffers.includes('Free Breakfast')) parts.push('complimentary breakfast')
        if (selectedOffers.includes('Early Check-in')) parts.push('free early check-in')
        if (selectedOffers.includes('Late Check-out')) parts.push('free late check-out')
        if (selectedOffers.includes('Room Upgrade')) parts.push('a complimentary room upgrade')

        if (parts.length > 0) {
          const last = parts.pop()
          offerText = parts.length > 0 ? `Enjoy ${parts.join(', ')} and ${last} on your next stay!` : `Enjoy ${last} on your next stay!`

          // Promo Code Logic
          if (selectedOffers.length > 1) {
            if (selectedOffers.includes('Percentage Discount')) promoCode = `COMBO${discountAmount}`
            else promoCode = 'SPECIALGIFT'
          } else {
            const offer = selectedOffers[0]
            if (offer === 'Percentage Discount') promoCode = `WELCOME${discountAmount}`
            else if (offer === 'Free Breakfast') promoCode = 'FREEBREAKFAST'
            else if (offer === 'Early Check-in') promoCode = 'EARLYBIRD'
            else if (offer === 'Late Check-out') promoCode = 'LATECHECKOUT'
            else if (offer === 'Room Upgrade') promoCode = 'UPGRADE'
          }

          offerSection = `
            <div style="background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 10px; font-size: 16px; color: #166534;"><strong>${offerText}</strong> when you book directly with us!</p>
                <p style="margin: 0 0 5px; font-size: 12px; color: #666;">Your exclusive discount code:</p>
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #16a34a;">${promoCode}</p>
                <div style="margin-top: 15px;">
                     ${(() => {
              const buttonStyle = "display: inline-block; background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;"
              const whatsappStyle = "display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;"

              const whatsappLink = links.whatsappNumber ? `https://wa.me/${links.whatsappNumber.replace(/[^0-9]/g, '')}` : '#'
              const phoneLink = links.phoneNumber ? `tel:${links.phoneNumber}` : '#'

              if (bookingMethod === 'booking_engine') {
                return `<a href="${links.directBookingUrl || '#'}" style="${buttonStyle}">Book Now & Save</a>`
              } else if (bookingMethod === 'whatsapp') {
                return `<a href="${whatsappLink}" style="${whatsappStyle}">Book via WhatsApp</a>`
              } else if (bookingMethod === 'phone') {
                return `<div style="margin-top: 10px; padding: 10px; background: #f3f4f6; border-radius: 8px; display: inline-block;"><strong>Call to Book:</strong> <a href="${phoneLink}" style="color: #16a34a;">${links.phoneNumber || 'Contact Hotel'}</a></div>`
              } else if (bookingMethod === 'email') {
                return `<div style="margin-top: 10px; padding: 10px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px;"><strong>Reply to this email</strong> to claim!</div>`
              }
              return ''
            })()}
                </div>
                 <p style="font-size: 12px; color: #9ca3af; font-style: italic; margin-top: 15px;">
                    *Offers are subject to availability. Please contact us directly to confirm your booking and offer eligibility.
                 </p>
            </div>`
        }
      }

      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #16a34a; margin: 0;">Thank you for staying with us!</h1>
  </div>
  
  <p>Dear ${guestName},</p>
  
  <p>We hope you had a wonderful stay at <strong>${hotelName}</strong>! Your comfort and satisfaction are our top priorities, and we'd love to hear about your experience.</p>
  
  <p>Would you take a moment to share your thoughts? Your feedback helps us improve and helps other travelers make informed decisions.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${links.googleReviewUrl || '#'}" style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Leave a Review on Google</a>
  </div>
  
  ${offerSection}
  
  <p>It only takes a minute, and we truly appreciate it!</p>
  
  <p>Warm regards,<br><strong>The ${hotelName} Team</strong></p>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
  <p style="font-size: 12px; color: #888; text-align: center;">
    You received this email because you recently stayed at ${hotelName}. 
  </p>
</body>
</html>`
    },
  },

  return_promo: {
    subject: 'A special offer just for you! 🎁',
    generateHtml: (guestName: string, hotelName: string, links: any, bookingMethod: string = 'booking_engine', selectedOffers: string[] = [], discountAmount: string = '20') => {
      let callToAction = ''
      const buttonStyle = "display: inline-block; background-color: #16a34a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;"
      const whatsappStyle = "display: inline-block; background-color: #25D366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;"

      const whatsappLink = links.whatsappNumber ? `https://wa.me/${links.whatsappNumber.replace(/[^0-9]/g, '')}` : '#'
      const phoneLink = links.phoneNumber ? `tel:${links.phoneNumber}` : '#'

      if (bookingMethod === 'booking_engine') {
        callToAction = `<a href="${links.directBookingUrl || '#'}" style="${buttonStyle}">Book Now</a>`
      } else if (bookingMethod === 'whatsapp') {
        callToAction = `<a href="${whatsappLink}" style="${whatsappStyle}">Book via WhatsApp</a>`
      } else if (bookingMethod === 'phone') {
        callToAction = `
          <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px; display: inline-block;">
            <strong>Call to Book:</strong> <a href="${phoneLink}" style="color: #16a34a; font-size: 18px;">${links.phoneNumber || 'Contact Hotel'}</a>
          </div>`
      } else if (bookingMethod === 'email') {
        callToAction = `
          <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px;">
            <strong>Reply to this email</strong> with your desired dates to claim this offer!
          </div>`
      }

      // Logic for Offer Text
      let offerText = 'an exclusive offer'
      let promoCode = 'WELCOMEBACK'

      const parts = []
      if (selectedOffers.length > 0) {
        if (selectedOffers.includes('Percentage Discount')) parts.push(`${discountAmount}% discount`)
        if (selectedOffers.includes('Free Breakfast')) parts.push('complimentary breakfast')
        if (selectedOffers.includes('Early Check-in')) parts.push('free early check-in')
        if (selectedOffers.includes('Late Check-out')) parts.push('free late check-out')
        if (selectedOffers.includes('Room Upgrade')) parts.push('complimentary room upgrade')

        if (parts.length > 0) {
          const last = parts.pop() || ''
          offerText = parts.length > 0 ? `${parts.join(', ')} and ${last}` : last
        }

        // Promo Code Logic
        if (selectedOffers.length > 1) {
          if (selectedOffers.includes('Percentage Discount')) promoCode = `COMBO${discountAmount}`
          else promoCode = 'SPECIALGIFT'
        } else {
          const offer = selectedOffers[0]
          if (offer === 'Percentage Discount') promoCode = `COMEBACK${discountAmount}`
          else if (offer === 'Free Breakfast') promoCode = 'FREEBREAKFAST'
          else if (offer === 'Early Check-in') promoCode = 'EARLYBIRD'
          else if (offer === 'Late Check-out') promoCode = 'LATECHECKOUT'
          else if (offer === 'Room Upgrade') promoCode = 'UPGRADE'
        }
      }


      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #16a34a; margin: 0;">We Miss You!</h1>
  </div>
  
  <p>Dear ${guestName},</p>
  
  <p>It's been a while since your last visit to <strong>${hotelName}</strong>, and we wanted to reach out with a special offer just for you.</p>
  
  <p>Book your next stay directly with us and enjoy <strong>${offerText}</strong>!</p>
  
  <div style="background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Your exclusive discount code:</p>
    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #16a34a;">${promoCode}</p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    ${callToAction}
  </div>
  
  <p style="font-size: 12px; color: #9ca3af; font-style: italic; text-align: center; margin-bottom: 20px;">
    *Offers are subject to availability. Please contact us directly to confirm your booking and offer eligibility.
  </p>
  
  <p>This offer is valid for the next 30 days. We can't wait to welcome you back!</p>
  
  <p>Warm regards,<br><strong>The ${hotelName} Team</strong></p>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
  <p style="font-size: 12px; color: #888; text-align: center;">
    You received this email because you previously stayed at ${hotelName}. 
  </p>
</body>
</html>`
    },
  },
}

import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  if (!resend) {
    return NextResponse.json(
      { error: 'Resend API key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const {
      guestName,
      guestEmail,
      templateType,
      hotelName = 'Our Hotel',
      hotelId,
      bookingMethod,
      includeOffer, // boolean
      selectedOffers, // array
      discountAmount,
    } = body

    if (!guestName || !guestEmail || !templateType) {
      return NextResponse.json(
        { error: 'Guest name, email, and template type are required' },
        { status: 400 }
      )
    }

    const template = emailTemplates[templateType as keyof typeof emailTemplates]
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid template type' },
        { status: 400 }
      )
    }

    // Fetch Hotel Links
    let googleReviewUrl = ''
    let directBookingUrl = ''
    let replyToEmail = ''
    let whatsappNumber = ''
    let phoneNumber = ''

    if (hotelId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for server-side
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: hotelData } = await supabase
        .from('hotels')
        .select('google_review_url, direct_booking_url, reply_to_email, whatsapp_number, phone_number')
        .eq('id', hotelId)
        .single()

      if (hotelData) {
        googleReviewUrl = hotelData.google_review_url || ''
        directBookingUrl = hotelData.direct_booking_url || ''
        replyToEmail = hotelData.reply_to_email || ''
        whatsappNumber = hotelData.whatsapp_number || ''
        phoneNumber = hotelData.phone_number || ''
      }
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'HoteliaOS <noreply@hoteliaos.com>',
      to: [guestEmail],
      replyTo: replyToEmail || undefined,
      subject: template.subject,
      html: template.generateHtml(
        guestName,
        hotelName,
        { googleReviewUrl, directBookingUrl, whatsappNumber, phoneNumber },
        bookingMethod || 'booking_engine',
        selectedOffers, // Updated: passed as array
        discountAmount,
        // includeOffer matches the last parameter of review_request generateHtml
        // typeof offerType === 'boolean' ? offerType : !!offerType 
        includeOffer || false
      ),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
