import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, rating } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `IMPORTANT RULES FOR TOPIC EXTRACTION:
1. ONLY extract topics that are EXPLICITLY mentioned in the review text
2. Do NOT infer or assume topics that aren't directly stated
3. If the review says 'bad staff' - extract 'staff'. If it says 'nice room' - extract 'room'
4. Do NOT add common hotel topics (pool, breakfast, parking) unless they are actually written in the review
5. Return an empty array [] if no clear topics are mentioned
6. Maximum 5 topics per review
7. Use simple, lowercase single words: 'staff', 'room', 'location', 'breakfast', 'noise', 'cleanliness', 'service', 'food', 'bed', 'bathroom', 'wifi', 'parking', 'view', 'price', 'value'

Examples:
- Review: 'Bad staff' → topics: ['staff']
- Review: 'Great location, quiet rooms' → topics: ['location', 'room', 'noise']  
- Review: 'Nice hotel' → topics: [] (too vague, no specific topic)
- Review: 'The breakfast was amazing and staff were friendly' → topics: ['breakfast', 'staff']

DO NOT make up topics. Only extract what is explicitly written.

Analyze this hotel review${rating ? ` (Guest rating: ${rating}/5 stars)` : ''}:

Review:
"${text}"

Respond in JSON format only:
{
  "sentiment": "positive|neutral|negative",
  "topics": ["topic1", "topic2"],
  "language": "code (e.g. en, th)"
}`
        }
      ],
    })

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : '{}'

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse sentiment analysis' },
        { status: 500 }
      )
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}
