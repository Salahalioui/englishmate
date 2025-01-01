'use client'

import { useState, useMemo } from 'react'
import { ScenarioService, Scenario, FeedbackResponse } from '@/lib/scenarios'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowLeft,
  FaPlay,
  FaMicrophone,
  FaStop,
  FaLightbulb,
  FaCheck,
  FaRedo,
  FaTimes,
  FaFire,
  FaTrophy,
  FaStar,
  FaChevronRight,
  FaBookOpen
} from 'react-icons/fa'

export default function ScenariosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [level, setLevel] = useState<string>('Beginner')
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [userResponse, setUserResponse] = useState<string>('')
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [showVocabulary, setShowVocabulary] = useState<boolean>(false)
  const [streak, setStreak] = useState<number>(0)
  const [dailyProgress, setDailyProgress] = useState<number>(0)
  const [showCelebration, setShowCelebration] = useState<boolean>(false)

  const scenarioService = useMemo(() => new ScenarioService(), [])
  const categories = useMemo(() => scenarioService.getCategories(), [scenarioService])

  const startNewScenario = async () => {
    if (!selectedCategory) return
    
    setLoading(true)
    try {
      const newScenario = await scenarioService.generateScenario(
        selectedCategory,
        level,
        selectedSubcategory
      )
      setScenario(newScenario)
      setUserResponse('')
      setFeedback(null)
    } catch (error) {
      console.error('Error starting scenario:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResponse = async () => {
    if (!scenario || !userResponse) return

    setLoading(true)
    try {
      const response = await scenarioService.getPracticeResponse(scenario, userResponse)
      setFeedback(response)
      
      // Update progress and streaks
      const averageScore = (
        response.pronunciation.score +
        response.grammar.score +
        response.vocabulary.score +
        response.naturalness.score
      ) / 4

      if (averageScore >= 70) {
        setStreak(prev => prev + 1)
        setDailyProgress(prev => Math.min(prev + 1, 10))
        if (streak === 4) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        setStreak(0)
      }
    } catch (error) {
      console.error('Error getting feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement voice recording logic here
  }

  const getLevelColor = (selectedLevel: string) => {
    switch (selectedLevel) {
      case 'Beginner': return 'bg-green-500 hover:bg-green-600'
      case 'Intermediate': return 'bg-blue-500 hover:bg-blue-600'
      case 'Advanced': return 'bg-purple-500 hover:bg-purple-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const renderFeedbackSection = (title: string, score: number, items: string[], type: 'positive' | 'negative' | 'suggestion') => {
    const getColorClass = (score: number) => {
      if (score >= 80) return 'text-green-500'
      if (score >= 60) return 'text-yellow-500'
      return 'text-red-500'
    }

    const getIcon = (type: string) => {
      switch (type) {
        case 'positive':
          return <FaCheck className="w-4 h-4 text-green-500" />
        case 'negative':
          return <FaTimes className="w-4 h-4 text-red-500" />
        default:
          return <FaLightbulb className="w-4 h-4 text-yellow-500" />
      }
    }

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <span className={`font-bold ${getColorClass(score)}`}>{score}/100</span>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              {getIcon(type)}
              <span className="text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Scenario</h2>
          <p className="text-gray-600">Creating a realistic conversation scenario...</p>
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
            {/* Progress Indicators */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-orange-500">
                <FaFire className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium text-sm sm:text-base">{streak}</span>
              </div>
              <div className="flex items-center gap-1 text-purple-500">
                <FaTrophy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium text-sm sm:text-base">{dailyProgress}/10</span>
              </div>
            </div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={`${getLevelColor(level)} text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium transition-colors cursor-pointer`}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </header>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-xl text-center max-w-sm w-full mx-4"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
                <FaStar className="w-full h-full text-yellow-400 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-600">{streak}</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Amazing Streak!</h3>
              <p className="text-sm sm:text-base text-gray-600">You&apos;re on fire! Keep it up!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {!scenario ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg sm:shadow-xl"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Choose a Scenario</h2>
            
            {/* Category Selection */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedSubcategory('')
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {Object.keys(categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any subcategory</option>
                    {categories[selectedCategory].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {Object.keys(categories).map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left group
                    ${selectedCategory === category 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      {categories[category].length} scenarios
                    </span>
                    <FaChevronRight className={`w-3 h-3 transition-colors
                      ${selectedCategory === category 
                        ? 'text-blue-500' 
                        : 'text-gray-400 group-hover:text-blue-500'}`} 
                    />
                  </div>
                  <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-1">{category}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    Practice {category.toLowerCase()} scenarios with realistic conversations
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Start Button */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8 flex justify-center"
              >
                <button
                  onClick={startNewScenario}
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium text-sm sm:text-base
                    hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                >
                  <FaPlay className="w-3 h-3 sm:w-4 sm:h-4" />
                  Start Scenario
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg sm:shadow-xl"
          >
            {/* Scenario Content */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{scenario.title}</h2>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getLevelColor(scenario.level)} text-white`}>
                  {scenario.level}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{scenario.description}</p>
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-2">Context</h3>
                <p className="text-sm sm:text-base text-gray-700">{scenario.context}</p>
              </div>
            </div>

            {/* Vocabulary Section */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => setShowVocabulary(!showVocabulary)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FaBookOpen className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm sm:text-base text-gray-800">Key Vocabulary</span>
                </div>
                <FaChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showVocabulary ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showVocabulary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3">
                      {scenario.vocabulary.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-800">{item.word}</h4>
                            <button
                              onClick={() => {/* Implement pronunciation playback */}}
                              className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            >
                              <FaPlay className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.definition}</p>
                          <p className="text-sm text-gray-500 italic">{item.example}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Response Section */}
            <div>
              <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-3">Your Response</h3>
              <div className="flex gap-2 sm:gap-3 mb-4">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="flex-1 min-h-[120px] rounded-lg border border-gray-200 p-3 text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={loading}
                />
                <button
                  onClick={toggleRecording}
                  disabled={loading}
                  className={`p-3 rounded-full transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {isRecording ? (
                    <FaStop className="w-5 h-5" />
                  ) : (
                    <FaMicrophone className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setScenario(null)
                    setUserResponse('')
                    setFeedback(null)
                  }}
                  className="px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim() || loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm sm:text-base
                    hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                >
                  Submit Response
                </button>
              </div>
            </div>

            {/* Feedback Section */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Feedback</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">{feedback.overall}</p>

                {renderFeedbackSection('Pronunciation', feedback.pronunciation.score, feedback.pronunciation.improvements, 'suggestion')}
                {renderFeedbackSection('Grammar', feedback.grammar.score, feedback.grammar.corrections, 'negative')}
                {renderFeedbackSection('Vocabulary', feedback.vocabulary.score, feedback.vocabulary.goodUsage, 'positive')}
                {renderFeedbackSection('Natural Flow', feedback.naturalness.score, feedback.naturalness.improvements, 'suggestion')}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={startNewScenario}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm sm:text-base
                      hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <FaRedo className="w-3 h-3 sm:w-4 sm:h-4" />
                    Try Another Scenario
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
} 