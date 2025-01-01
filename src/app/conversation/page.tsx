'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { Message } from '@/types/chat'
import { GeminiService } from '@/lib/gemini'
import Link from 'next/link'
import { FaVolumeUp, FaArrowLeft } from 'react-icons/fa'

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: "Hello! I'm your English learning assistant. You can type or use voice messages to practice. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const geminiService = useRef<GeminiService>(new GeminiService())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const playAudioResponse = async (text: string) => {
    try {
      setIsPlaying(true);
      
      // Get the audio data
      const audioData = await geminiService.current.getAudioResponse(text);
      
      if (!audioData) {
        throw new Error('No audio data received');
      }

      // Create a blob and URL
      const blob = new Blob([audioData], { 
        type: 'audio/mpeg'
      });
      const audioUrl = URL.createObjectURL(blob);

      // Get audio element
      const audio = audioRef.current;
      if (!audio) {
        throw new Error('Audio element not found');
      }

      // Clean up previous URL if it exists
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }

      // Configure audio settings for better performance
      audio.preload = 'auto';
      audio.volume = 1.0;

      // Set up event listeners
      const handleCanPlayThrough = () => {
        audio.play().catch(error => {
          console.error('Error starting playback:', error);
          setIsPlaying(false);
        });
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audio.removeEventListener('ended', handleEnded);
      };

      const handleError = (e: Event) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      };

      // Add event listeners
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Set source and load
      audio.src = audioUrl;
      audio.load();

    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await geminiService.current.sendMessage(content)
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendVoiceMessage = async (audioBlob: Blob) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: '🎤 Voice message...',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await geminiService.current.sendVoiceMessage(audioBlob)

      // Update user message with transcription
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, content: '🎤 ' + response.split('\n')[0] }
            : msg
        )
      )

      // Add assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.split('\n').slice(1).join('\n'),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing voice message:', error)
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your voice message. Please try again or type your message.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 fixed top-0 left-0 right-0 z-10">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 font-medium text-sm sm:text-base"
        >
          <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Back
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold text-center flex-1 text-gray-800 truncate">
          English Conversation Practice
        </h1>
        <div className="w-[80px] sm:w-[100px] flex justify-end">
          {isPlaying && (
            <div className="animate-pulse flex items-center gap-1 sm:gap-2 text-blue-500">
              <FaVolumeUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="flex space-x-1">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-20 sm:pb-24 space-y-4 sm:space-y-6">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message}
            onPlay={message.role === 'assistant' ? () => playAudioResponse(message.content) : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 sm:p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onSendVoiceMessage={handleSendVoiceMessage}
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-lg flex items-center gap-2 sm:gap-3 mx-4">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-500" />
            <p className="text-gray-600 font-medium text-sm sm:text-base">Processing...</p>
          </div>
        </div>
      )}

      {/* Static audio element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
} 