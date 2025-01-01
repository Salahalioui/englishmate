interface PlayHTConfig {
  userId: string;
  apiKey: string;
}

interface PlayHTError {
  error: string;
  details?: string;
}

export class PlayHTService {
  private userId: string;
  private apiKey: string;

  constructor(config: PlayHTConfig) {
    this.userId = config.userId;
    this.apiKey = config.apiKey;
  }

  async textToSpeech(text: string): Promise<ArrayBuffer> {
    try {
      if (!text?.trim()) {
        throw new Error('Text is required');
      }

      console.log('Sending TTS request for text:', text.substring(0, 50) + '...');

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      const contentType = response.headers.get('Content-Type');

      if (!response.ok) {
        let errorMessage: string;
        if (contentType?.includes('application/json')) {
          const errorData: PlayHTError = await response.json();
          errorMessage = errorData.details || errorData.error;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      if (!contentType?.includes('audio/')) {
        throw new Error('Invalid response format: expected audio, got ' + contentType);
      }

      const audioBuffer = await response.arrayBuffer();
      if (audioBuffer.byteLength === 0) {
        throw new Error('Generated audio is empty');
      }

      console.log('Successfully received audio:', {
        byteLength: audioBuffer.byteLength,
        contentType
      });

      return audioBuffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error instanceof Error ? error : new Error('Failed to generate speech');
    }
  }
} 