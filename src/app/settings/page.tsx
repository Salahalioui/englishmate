'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaKey, FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string>('')
  const [showApiKey, setShowApiKey] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedApiKey = localStorage.getItem('gemini_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    }
  }, [])

  const validateApiKey = (key: string): boolean => {
    // Basic validation: Check if it matches the Gemini API key format
    return /^AIza[0-9A-Za-z-_]{35}$/.test(key)
  }

  const handleSave = async () => {
    if (!apiKey) {
      setErrorMessage('API key is required')
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    if (!validateApiKey(apiKey)) {
      setErrorMessage('Invalid API key format')
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsSaving(true)
    try {
      // Store API key in localStorage
      localStorage.setItem('gemini_api_key', apiKey)
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch {
      setErrorMessage('Failed to save API key')
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Settings</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg sm:shadow-xl"
        >
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 text-gray-800 mb-6">
              <FaKey className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl sm:text-2xl font-bold">API Settings</h2>
            </div>

            <div className="space-y-6">
              {/* API Key Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-12
                      text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-500">
                  Get your API key from{' '}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 text-sm sm:text-base">
                <h3 className="font-medium text-blue-800 mb-2">How to get your API key:</h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>Visit Google AI Studio</li>
                  <li>Sign in with your Google account</li>
                  <li>Go to the API Keys section</li>
                  <li>Click &quot;Create API Key&quot;</li>
                  <li>Copy and paste your API key here</li>
                </ol>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm sm:text-base
                    hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save API Key'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg
                flex items-center gap-2"
            >
              <FaCheck className="w-4 h-4" />
              <span>API key saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg
                flex items-center gap-2"
            >
              <FaTimes className="w-4 h-4" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
} 