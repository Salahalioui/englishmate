'use client'

import { useState, useCallback, useEffect } from 'react'
import { FaMicrophone, FaStop } from 'react-icons/fa'

interface VoiceInputProps {
  onRecordingComplete: (audioBlob: Blob) => void
  isLoading: boolean
}

export function VoiceInput({ onRecordingComplete, isLoading }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission and setup
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(audioStream)
      
      const recorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm',
      })
      
      const chunks: Blob[] = []
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        onRecordingComplete(audioBlob)
        // Clean up
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          setStream(null)
        }
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }, [onRecordingComplete, stream])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
      // Clean up the stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }
  }, [mediaRecorder, isRecording, stream])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isLoading}
      className={`p-2 sm:p-3 rounded-full transition-all transform active:scale-95 ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white disabled:opacity-50 disabled:cursor-not-allowed relative`}
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <>
          <FaStop className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full animate-ping" />
        </>
      ) : (
        <FaMicrophone className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  )
} 