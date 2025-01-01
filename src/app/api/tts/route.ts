import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const userId = process.env.PLAYHT_USER_ID
    const apiKey = process.env.PLAYHT_API_KEY

    if (!userId || !apiKey) {
      console.error('PlayHT credentials not configured')
      return NextResponse.json(
        { error: 'TTS service not configured' },
        { status: 500 }
      )
    }

    // Optimize request body for lowest latency using Play3.0-mini
    const requestBody = {
      text,
      voice: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
      voice_engine: "Play3.0-mini", // Using the low-latency model
      output_format: "mp3",  // MP3 for smaller size and faster transfer
      quality: "draft", // Draft quality for faster generation
      sample_rate: 24000,
      speed: 1.0 // Normal speed for better quality/speed balance
    }

    console.log('Making request to PlayHT with:', {
      text: text.substring(0, 50) + '...',
      userId: userId.substring(0, 5) + '...',
      apiKeyLength: apiKey.length,
      engine: requestBody.voice_engine
    })

    const response = await fetch('https://api.play.ht/api/v2/tts/stream', {
      method: 'POST',
      headers: {
        'X-USER-ID': userId,
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PlayHT API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      return NextResponse.json(
        { 
          error: `PlayHT API error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      )
    }

    // Get the audio data as a stream
    const audioData = await response.arrayBuffer()
    
    if (!audioData || audioData.byteLength === 0) {
      console.error('PlayHT returned empty audio data')
      return NextResponse.json(
        { error: 'Generated audio is empty' },
        { status: 500 }
      )
    }

    console.log('Successfully generated audio:', {
      byteLength: audioData.byteLength,
      contentType: response.headers.get('Content-Type'),
      engine: requestBody.voice_engine
    })
    
    // Return the audio data with proper headers for streaming
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
        'Cache-Control': 'no-store, no-cache',
        'Transfer-Encoding': 'chunked',
        'Accept-Ranges': 'bytes'
      }
    })
  } catch (error) {
    console.error('Error in TTS API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 