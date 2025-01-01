import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

export class GeminiService {
  private model: GenerativeModel
  private api: GoogleGenerativeAI

  constructor() {
    // Initialize with empty API key, it will be set when needed
    this.api = new GoogleGenerativeAI('')
    this.model = this.api.getGenerativeModel({ model: 'gemini-pro' })
  }

  private getApiKey(): string {
    const apiKey = localStorage.getItem('gemini_api_key')
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please add your API key in Settings.')
    }
    return apiKey
  }

  private initializeApi() {
    const apiKey = this.getApiKey()
    this.api = new GoogleGenerativeAI(apiKey)
    this.model = this.api.getGenerativeModel({ model: 'gemini-pro' })
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Initialize API with stored key before each request
      this.initializeApi()

      const result = await this.model.generateContent(message)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error sending message to Gemini:', error)
      if (error instanceof Error && error.message.includes('API key not found')) {
        throw error // Re-throw API key errors
      }
      throw new Error('Failed to get response from Gemini')
    }
  }

  async sendVoiceMessage(audioBlob: Blob): Promise<string> {
    try {
      // Initialize API with stored key before each request
      this.initializeApi()

      // Log the blob size for debugging
      console.log(`Processing voice message of size: ${audioBlob.size} bytes`)

      // Convert audio to text using your speech-to-text service
      // Then send the text to Gemini
      // This is a placeholder - implement actual audio processing
      throw new Error('Voice message processing not implemented yet')
    } catch (error) {
      console.error('Error processing voice message:', error)
      throw error
    }
  }

  async getAudioResponse(text: string): Promise<ArrayBuffer | null> {
    try {
      // Initialize API with stored key before each request
      this.initializeApi()

      // Log the text length for debugging
      console.log(`Generating audio for text of length: ${text.length}`)

      // Convert text to speech using your text-to-speech service
      // This is a placeholder - implement actual text-to-speech
      return null
    } catch (error) {
      console.error('Error getting audio response:', error)
      return null
    }
  }
} 