import { Message } from '@/types/chat'
import { FaPlay, FaUser, FaRobot, FaMicrophone, FaExclamationTriangle, FaChartBar } from 'react-icons/fa'

interface ChatMessageProps {
  message: Message
  onPlay?: () => void
}

export function ChatMessage({ message, onPlay }: ChatMessageProps) {
  // Function to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })
  }

  // Function to render pronunciation score with visual meter
  const renderPronunciationScore = (text: string) => {
    const scoreMatch = text.match(/(\d+)\/100/)
    if (!scoreMatch) return null
    
    const score = parseInt(scoreMatch[1])
    const getScoreColor = (score: number) => {
      if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
      if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      return 'bg-red-100 text-red-800 border-red-200'
    }

    const getProgressColor = (score: number) => {
      if (score >= 90) return 'bg-green-500'
      if (score >= 70) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    return (
      <div className="space-y-2">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)} border`}>
          <FaChartBar className="mr-2" />
          Score: {score}/100
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getProgressColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    )
  }

  // Function to render word-level feedback
  const renderWordFeedback = (text: string) => {
    const words = text.split(' ')
    return words.map((word, index) => {
      const isHighlighted = word.includes('*')
      return (
        <span 
          key={index}
          className={`inline-block ${
            isHighlighted 
              ? 'bg-yellow-100 px-1 rounded border-b-2 border-yellow-400' 
              : ''
          }`}
        >
          {word.replace(/\*/g, '')} {' '}
        </span>
      )
    })
  }

  // Function to format and parse sections
  const formatContent = (content: string) => {
    if (message.role !== 'assistant') {
      if (content.startsWith('🎤')) {
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaMicrophone className="text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <p className="whitespace-pre-wrap">{content.replace('🎤', '')}</p>
          </div>
        )
      }
      return <p className="whitespace-pre-wrap">{content}</p>
    }

    // Split content into sections
    const sections = content.split('**').filter(Boolean)
    
    return sections.map((section, index) => {
      // Check if section is a header
      if (section.startsWith('1. Transcription:')) {
        const content = section.split(':')[1]
        return (
          <div key={index} className="mt-2 sm:mt-3 first:mt-0">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm mr-2">1</span>
              Transcription
            </h3>
            <div className="pl-6 sm:pl-8 border-l-2 border-blue-200">
              <div className="bg-blue-50 p-2 sm:p-3 rounded-md text-sm sm:text-base">
                {content.trim()}
              </div>
            </div>
          </div>
        )
      }

      if (section.startsWith('2. Pronunciation Analysis')) {
        const content = section.split(':')[1]
        return (
          <div key={index} className="mt-3 sm:mt-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs sm:text-sm mr-2">2</span>
              Pronunciation Analysis
            </h3>
            <div className="pl-6 sm:pl-8 border-l-2 border-purple-200">
              {renderPronunciationScore(content)}
              <div className="mt-3 sm:mt-4 bg-purple-50 p-2 sm:p-3 rounded-md text-sm sm:text-base">
                {renderWordFeedback(content.trim())}
              </div>
            </div>
          </div>
        )
      }

      if (section.startsWith('3. Arabic Approximation')) {
        const content = section.split(':')[1]
        return (
          <div key={index} className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm mr-2">3</span>
              Arabic Approximation
            </h3>
            <div className="pl-8 border-l-2 border-green-200">
              <div className="bg-green-50 p-3 rounded-md font-arabic">
                {content.trim()}
              </div>
            </div>
          </div>
        )
      }

      if (section.startsWith('4. Suggested Improvements')) {
        const content = section.split(':')[1]
        return (
          <div key={index} className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm mr-2">4</span>
              Suggested Improvements
            </h3>
            <div className="pl-8 border-l-2 border-yellow-200">
              {content.split('\n').map((improvement, i) => (
                improvement.trim() && (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                    <p>{improvement.trim()}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )
      }

      if (section.startsWith('5. Summary')) {
        const content = section.split(':')[1]
        return (
          <div key={index} className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm mr-2">5</span>
              Summary
            </h3>
            <div className="pl-8 border-l-2 border-indigo-200">
              <div className="bg-indigo-50 p-3 rounded-md">
                {content.trim()}
              </div>
            </div>
          </div>
        )
      }
      
      // Handle IPA notation
      if (section.includes('/') && section.includes('IPA')) {
        return (
          <div key={index} className="bg-gray-50 px-3 py-2 rounded-md my-2 font-mono text-sm">
            {section}
          </div>
        )
      }

      return <p key={index} className="whitespace-pre-wrap mb-2">{section}</p>
    })
  }

  return (
    <div
      className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 ${
        message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-100 relative">
        {message.role === 'assistant' ? (
          <>
            <FaRobot className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
            {onPlay && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 rounded-full flex items-center justify-center">
                <FaPlay className="text-blue-500 w-1.5 h-1.5 sm:w-2 sm:h-2" />
              </span>
            )}
          </>
        ) : (
          <FaUser className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </div>

      <div
        className={`flex-1 rounded-lg p-3 sm:p-4 ${
          message.role === 'assistant'
            ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
            : 'bg-blue-500 text-white'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm opacity-75">
            {formatTime(new Date(message.timestamp))}
          </span>
          {message.role === 'assistant' && onPlay && (
            <button
              onClick={onPlay}
              className="text-blue-500 hover:text-blue-600 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-blue-50 flex items-center gap-1 sm:gap-2 group"
              title="Play pronunciation"
            >
              <FaPlay className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium">Listen</span>
            </button>
          )}
        </div>

        <div className={`${message.role === 'assistant' ? 'text-gray-700' : 'text-white'} text-sm sm:text-base`}>
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  )
} 