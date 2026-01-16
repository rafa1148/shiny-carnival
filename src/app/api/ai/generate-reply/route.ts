import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 [AI Reply] Incoming request body:', JSON.stringify(body, null, 2))

    const {
      reviewText,
      reviewerName,
      rating,
      platform,
      hotelName,
      brandVoice = 'professional and friendly',
      replyLanguage = 'en',
      sentiment,
      topics = [],
    } = body

    // Ensure topics is actually an array (handle null vs undefined)
    const safeTopics = Array.isArray(topics) ? topics : []

    if (!reviewText || !reviewerName) {
      console.warn('⚠️ [AI Reply] Missing required fields')
      return NextResponse.json(
        { error: 'Review text and reviewer name are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('🔑 [AI Reply] API Key exists:', !!apiKey)
    console.log('🔑 [AI Reply] API Key prefix:', apiKey?.substring(0, 10))

    if (!apiKey) {
      console.error('❌ [AI Reply] Missing ANTHROPIC_API_KEY')
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are an expert hotel manager writing responses to guest reviews. Your goal is to be warm, professional, and solution-oriented.

Tone Guidelines:
- Be warm, professional, and hospitable at all times. Avoid sounding corporate or stiff.
- Address specific points mentioned in the review.
- Start by thanking the guest for their feedback.
- Format properly with paragraphs for readability.
- Be concise (80-150 words).

Handling Negative Feedback:
- Express genuine concern without being overly dramatic or apologetic.
- Avoid phrases like 'troubles me greatly', 'deeply sorry', or 'sincerely apologize' for minor complaints.
- Instead use phrases like: 'Thank you for your feedback', 'We appreciate you bringing this to our attention', 'We'd love to hear more about your experience'.
- Focus on inviting dialogue and offering to make things right.
- For staff complaints specifically: Acknowledge the feedback, mention you'll review with the team, and invite them to share more details.
- Never be defensive or make excuses.

Closing:
- Sign off warmly but not excessively (e.g., "Warm regards", "Kind regards").
- Invite them to reach out directly if further discussion is needed.

Context:
Hotel Name: ${hotelName || 'our hotel'}
Brand Voice: ${brandVoice}
Response Language: ${replyLanguage === 'en' ? 'English' : replyLanguage}

${replyLanguage !== 'en' ? `IMPORTANT: Write the entire response in ${replyLanguage}. Do not include any English.` : ''}`

    const userPrompt = `Write a response to this ${platform} review:

Reviewer: ${reviewerName}
Rating: ${rating}/5 stars
${sentiment ? `Sentiment: ${sentiment}` : ''}
${safeTopics.length > 0 ? `Key topics: ${safeTopics.join(', ')}` : ''}

Review:
"${reviewText}"

Write a personalized response that addresses their specific feedback.`

    console.log('🚀 [AI Reply] Sending request to Anthropic API...')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ [AI Reply] Anthropic API error:', response.status, JSON.stringify(data, null, 2))
        return NextResponse.json(
          { error: data.error?.message || 'Anthropic API error' },
          { status: response.status }
        )
      }

      console.log('✅ [AI Reply] Anthropic API success')

      // @ts-ignore
      const reply = data.content[0]?.text || ''

      return NextResponse.json({ reply })

    } catch (fetchError) {
      console.error('❌ [AI Reply] Fetch error:', fetchError)
      throw fetchError // Re-throw to be caught by outer try-catch
    }

  } catch (error: any) {
    console.error('❌ [AI Reply] Internal Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate reply' },
      { status: 500 }
    )
  }
}
