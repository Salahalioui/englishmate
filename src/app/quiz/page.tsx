'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { QuizService, QuizQuestion, QuizResult } from '@/lib/quiz'
import Link from 'next/link'
import { FaArrowLeft, FaLightbulb, FaRedo, FaTrophy, FaCheck, FaTimes, FaChevronRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuizPage() {
  const [level, setLevel] = useState<string>('Beginner')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [wordExplanation, setWordExplanation] = useState<string>('')
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)

  const quizService = useMemo(() => new QuizService(), [])

  const startQuiz = useCallback(async () => {
    setLoading(true)
    try {
      const newQuestions = await quizService.generateQuiz(level)
      setQuestions(newQuestions)
      setCurrentQuestion(0)
      setUserAnswers([])
      setQuizResult(null)
      setShowExplanation(false)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } catch (error) {
      console.error('Error starting quiz:', error)
    } finally {
      setLoading(false)
    }
  }, [level, quizService])

  const handleLevelChange = async (newLevel: string) => {
    setLevel(newLevel)
    await startQuiz()
  }

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)

    // Wait for 1.5 seconds to show feedback
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newAnswers = [...userAnswers, answer]
    setUserAnswers(newAnswers)
    setShowFeedback(false)
    setSelectedAnswer(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      const result = quizService.calculateQuizResult(questions, newAnswers)
      setQuizResult(result)
    }
  }

  const showWordExplanation = async (word: string) => {
    setLoading(true)
    try {
      const explanation = await quizService.getWordExplanation(word)
      setWordExplanation(explanation)
      setShowExplanation(true)
    } catch (error) {
      console.error('Error getting word explanation:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    startQuiz()
  }, [startQuiz])

  const getLevelColor = (selectedLevel: string) => {
    switch (selectedLevel) {
      case 'Beginner': return 'bg-green-500 hover:bg-green-600'
      case 'Intermediate': return 'bg-blue-500 hover:bg-blue-600'
      case 'Advanced': return 'bg-purple-500 hover:bg-purple-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Quiz</h2>
          <p className="text-gray-600">We&apos;re crafting the perfect questions for your level...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              value={level}
              onChange={(e) => handleLevelChange(e.target.value)}
              className={`${getLevelColor(level)} text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium transition-colors cursor-pointer`}
              disabled={loading}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {quizResult && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startQuiz()}
                className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-md text-sm sm:text-base"
              >
                <FaRedo className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">New Quiz</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <AnimatePresence mode="wait">
          {questions.length > 0 && !quizResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg sm:shadow-xl"
            >
              {/* Progress Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {Math.round((currentQuestion + 1) / questions.length * 100)}%
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    className="h-full bg-blue-500 rounded-full"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  What is the meaning of &ldquo;{questions[currentQuestion].word}&rdquo;?
                </h2>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                  <p className="text-sm sm:text-base text-gray-700 italic">
                    Example: {questions[currentQuestion].example}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="grid gap-3 sm:gap-4">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = showFeedback && option === questions[currentQuestion].correctAnswer
                  const isWrong = showFeedback && isSelected && !isCorrect

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => !showFeedback && handleAnswer(option)}
                      disabled={showFeedback}
                      className={`
                        text-left px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all
                        flex items-center justify-between group
                        ${isSelected ? 'border-blue-500' : 'border-gray-200'}
                        ${isCorrect ? 'bg-green-50 border-green-500' : ''}
                        ${isWrong ? 'bg-red-50 border-red-500' : ''}
                        ${showFeedback ? '' : 'hover:border-blue-500 hover:bg-blue-50'}
                      `}
                    >
                      <span className={`flex-1 text-sm sm:text-base ${isCorrect ? 'text-green-700' : isWrong ? 'text-red-700' : 'text-gray-700'}`}>
                        {option}
                      </span>
                      {showFeedback ? (
                        isCorrect ? (
                          <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        ) : isWrong ? (
                          <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        ) : null
                      ) : (
                        <FaChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {quizResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg sm:shadow-xl"
            >
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                <p className="text-sm sm:text-base text-gray-600">Here&apos;s how you did:</p>
              </div>
              
              {/* Score Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">
                    {Math.round(quizResult.score)}%
                  </div>
                  <div className="flex justify-center items-center gap-4 text-sm sm:text-base text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      {quizResult.correctAnswers} correct
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      {quizResult.incorrectAnswers} incorrect
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Section */}
              {quizResult.reviewWords.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Words to Review</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {quizResult.reviewWords.map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">{word.word}</h4>
                            <p className="text-sm text-gray-600 mb-2">{word.definition}</p>
                            <p className="text-sm text-gray-500 italic">{word.example}</p>
                          </div>
                          <button
                            onClick={() => showWordExplanation(word.word)}
                            className="flex-shrink-0 text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            title="Learn more"
                          >
                            <FaLightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Word Explanation Modal */}
        {showExplanation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Word Explanation</h3>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="prose prose-sm sm:prose max-w-none">
                {wordExplanation.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
} 