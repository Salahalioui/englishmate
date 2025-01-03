export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type ChatState = {
  messages: Message[]
  isLoading: boolean
} 