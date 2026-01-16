import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 [Translate] Incoming request')

    const { text, targetLanguage = 'en', sourceLanguage } = body

    if (!text) {
      console.warn('⚠️ [Translate] Missing text')
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('❌ [Translate] Missing API Key')
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      )
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      th: 'Thai',
      id: 'Indonesian',
      vi: 'Vietnamese',
      ja: 'Japanese',
      zh: 'Chinese (Simplified)',
      ko: 'Korean',
      ms: 'Malay',
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage
    const sourceLangName = sourceLanguage ? languageNames[sourceLanguage] || sourceLanguage : 'the source language'

    console.log(`🚀 [Translate] Translating to ${targetLangName}...`)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', // Using user-requested futuristic model name
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Translate the following text from ${sourceLangName} to ${targetLangName}. 
Only provide the translation, no explanations or notes.

Text to translate:
"${text}"`
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ [Translate] API Error:', response.status, JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: data.error?.message || 'Translation failed' },
        { status: response.status }
      )
    }

    // @ts-ignore
    const translatedText = data.content[0]?.text || ''

    console.log('✅ [Translate] Success')

    return NextResponse.json({
      translatedText,
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
    })
  } catch (error: any) {
    console.error('❌ [Translate] Internal Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to translate' },
      { status: 500 }
    )
  }
}
