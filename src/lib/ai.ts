import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ReviewAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  topics: {
    topic: string
    sentiment: 'positive' | 'negative'
    quote: string
  }[]
  translatedText?: string
  detectedLanguage?: string
}

export interface GeneratedReply {
  reply: string
  analysis: ReviewAnalysis
}

// Detect language and translate if needed
export async function analyzeAndTranslate(reviewText: string): Promise<{
  originalLanguage: string
  translatedText: string | null
  needsTranslation: boolean
}> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this hotel review text and respond in JSON format:

Review: "${reviewText}"

Respond with ONLY valid JSON in this format:
{
  "originalLanguage": "ISO 639-1 code (e.g., 'en', 'th', 'id', 'ja')",
  "languageName": "Full language name",
  "isEnglish": true/false,
  "translatedText": "English translation if not English, null if already English"
}`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  const result = JSON.parse(content.text)
  
  return {
    originalLanguage: result.originalLanguage,
    translatedText: result.isEnglish ? null : result.translatedText,
    needsTranslation: !result.isEnglish,
  }
}

// Analyze sentiment and extract topics
export async function analyzeSentiment(
  reviewText: string,
  translatedText?: string
): Promise<ReviewAnalysis> {
  const textToAnalyze = translatedText || reviewText

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this hotel review for sentiment and key topics. Be thorough but concise.

Review: "${textToAnalyze}"

Respond with ONLY valid JSON in this format:
{
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": 0.0 to 1.0 (0 = very negative, 0.5 = neutral, 1.0 = very positive),
  "topics": [
    {
      "topic": "Topic name (e.g., 'Cleanliness', 'Staff', 'Location', 'Value', 'Room Quality', 'Food', 'Amenities')",
      "sentiment": "positive" | "negative",
      "quote": "Brief relevant quote from review"
    }
  ]
}

Extract 2-5 key topics mentioned in the review.`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return JSON.parse(content.text)
}

// Generate AI reply to a review
export async function generateReply(
  reviewText: string,
  rating: number,
  hotelName: string,
  brandVoice?: string,
  replyLanguage: string = 'en',
  translatedText?: string
): Promise<string> {
  const textToReplyTo = translatedText || reviewText
  
  const brandVoiceInstruction = brandVoice
    ? `\n\nBrand voice guidelines: ${brandVoice}`
    : '\n\nUse a warm, professional, and genuine tone.'

  const languageInstruction = replyLanguage !== 'en'
    ? `\n\nIMPORTANT: Write the reply in ${getLanguageName(replyLanguage)} language.`
    : ''

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a hotel manager responding to a guest review. Write a professional, personalized reply.

Hotel Name: ${hotelName}
Guest Rating: ${rating}/5 stars
Guest Review: "${textToReplyTo}"
${brandVoiceInstruction}
${languageInstruction}

Guidelines:
- Thank the guest for their feedback
- Address specific points they mentioned (both positive and negative)
- If negative feedback, apologize sincerely and explain how you'll improve
- If positive, express genuine gratitude
- Keep it concise (2-4 sentences for simple reviews, up to 5-6 for detailed ones)
- Don't be overly formal or use clichés
- Sign off naturally (no need for full signature)
- DO NOT use phrases like "Dear Valued Guest" - use their name if available, or a natural greeting

Write ONLY the reply, no explanations or alternatives.`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return content.text.trim()
}

// Full review processing pipeline
export async function processReview(
  reviewText: string,
  rating: number,
  hotelName: string,
  brandVoice?: string,
  replyLanguage: string = 'en'
): Promise<GeneratedReply> {
  // Step 1: Detect language and translate if needed
  const { originalLanguage, translatedText, needsTranslation } = 
    await analyzeAndTranslate(reviewText)

  // Step 2: Analyze sentiment
  const analysis = await analyzeSentiment(reviewText, translatedText || undefined)
  
  if (needsTranslation && translatedText) {
    analysis.translatedText = translatedText
    analysis.detectedLanguage = originalLanguage
  }

  // Step 3: Generate reply
  const reply = await generateReply(
    reviewText,
    rating,
    hotelName,
    brandVoice,
    replyLanguage,
    translatedText || undefined
  )

  return {
    reply,
    analysis,
  }
}

// Helper: Get language name from code
function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    th: 'Thai',
    id: 'Indonesian',
    ms: 'Malay',
    vi: 'Vietnamese',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    fr: 'French',
    de: 'German',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ar: 'Arabic',
    hi: 'Hindi',
  }
  return languages[code] || 'English'
}

// Translate reply to a different language
export async function translateReply(
  reply: string,
  targetLanguage: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Translate this hotel review reply to ${getLanguageName(targetLanguage)}. 
Maintain the same tone and professionalism.

Reply to translate:
"${reply}"

Write ONLY the translation, nothing else.`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return content.text.trim()
}
