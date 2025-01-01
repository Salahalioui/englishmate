'use client'

import Link from 'next/link'
import { FaMicrophone, FaRobot, FaPlay, FaBook, FaQuestionCircle, FaTheaterMasks, FaCog } from 'react-icons/fa'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">EnglishMate</h1>
          <Link
            href="/settings"
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <FaCog className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Practice English with AI
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Get real-time pronunciation feedback and improve your English speaking skills through natural conversations and interactive quizzes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <Link
            href="/conversation"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Start Practice
            <FaPlay className="w-4 h-4" />
          </Link>
          <Link
            href="/quiz"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Take Quiz
            <FaQuestionCircle className="w-4 h-4" />
          </Link>
          <Link
            href="/scenarios"
            className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            Practice Scenarios
            <FaTheaterMasks className="w-4 h-4" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaMicrophone className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Voice Recognition
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Practice speaking naturally with advanced voice recognition technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FaRobot className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              AI Feedback
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get detailed pronunciation analysis and improvement suggestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FaBook className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Vocabulary Quizzes
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Learn new words with AI-generated quizzes tailored to your level.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FaTheaterMasks className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Real-life Scenarios
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Practice English in realistic situations with guided conversations and feedback.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md mx-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto mb-4 font-semibold">
                1
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Choose Your Activity</h4>
              <p className="text-sm text-gray-600">
                Start a conversation or take a vocabulary quiz at your level.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto mb-4 font-semibold">
                2
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Get Instant Feedback</h4>
              <p className="text-sm text-gray-600">
                Receive detailed analysis and learn from your mistakes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto mb-4 font-semibold">
                3
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">
                See your improvement and unlock new difficulty levels.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} EnglishMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
