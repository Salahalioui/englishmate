import { useState, FormEvent } from 'react'
import { VoiceInput } from './VoiceInput'

type ChatInputProps = {
  onSendMessage: (message: string) => void
  onSendVoiceMessage?: (audioBlob: Blob) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, onSendVoiceMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-2 sm:p-4 bg-white">
      <div className="flex gap-2 sm:gap-4 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        {onSendVoiceMessage && (
          <VoiceInput 
            onRecordingComplete={onSendVoiceMessage}
            isLoading={isLoading}
          />
        )}
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
} 