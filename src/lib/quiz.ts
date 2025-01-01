import { GeminiService } from './gemini'

export interface QuizQuestion {
  word: string
  definition: string
  options: string[]
  correctAnswer: string
  example: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  reviewWords: { word: string; definition: string; example: string }[]
}

export class QuizService {
  private geminiService: GeminiService

  constructor() {
    this.geminiService = new GeminiService()
  }

  async generateQuiz(level: string, numberOfQuestions: number = 5): Promise<QuizQuestion[]> {
    const topics = this.getTopicsByLevel(level)
    const randomTopics = this.getRandomElements(topics, 2) // Get 2 random topics
    
    const prompt = `Generate a vocabulary quiz with ${numberOfQuestions} questions for ${level} level English learners.
    Focus on words related to these topics: ${randomTopics.join(', ')}.
    For each word:
    1. Choose words that are appropriate for ${level} level
    2. Provide a clear definition
    3. Create a natural example sentence
    4. Generate 4 multiple choice options (one correct, three plausible but incorrect)
    5. Ensure the options are distinct and unambiguous
    6. Make sure each word is different from the others
    
    Return the response in the following JSON format, without any markdown formatting or additional text:
    [
      {
        "word": "example",
        "definition": "a representative form or pattern",
        "options": ["a representative form", "a type of fruit", "a kind of weather", "a piece of furniture"],
        "correctAnswer": "a representative form",
        "example": "This diagram serves as an example of how the system works.",
        "level": "${level}"
      }
    ]`

    try {
      const response = await this.geminiService.sendMessage(prompt)
      
      // Clean up the response by removing any markdown formatting
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      
      try {
        const questions = JSON.parse(cleanResponse) as QuizQuestion[]
        return questions
      } catch (parseError) {
        console.error('Error parsing quiz response:', parseError)
        console.log('Raw response:', cleanResponse)
        throw new Error('Failed to parse quiz questions')
      }
    } catch (error) {
      console.error('Error generating quiz:', error)
      throw new Error('Failed to generate quiz questions')
    }
  }

  private getTopicsByLevel(level: string): string[] {
    switch (level) {
      case 'Beginner':
        return [
          'daily routines',
          'family and friends',
          'food and drinks',
          'hobbies and interests',
          'weather and seasons',
          'basic emotions',
          'colors and shapes',
          'numbers and time',
          'house and furniture',
          'clothes and accessories'
        ]
      case 'Intermediate':
        return [
          'work and careers',
          'travel and transportation',
          'health and fitness',
          'technology and internet',
          'environment and nature',
          'education and learning',
          'arts and entertainment',
          'shopping and money',
          'social media and communication',
          'sports and recreation'
        ]
      case 'Advanced':
        return [
          'business and economics',
          'science and research',
          'politics and government',
          'philosophy and ethics',
          'psychology and behavior',
          'literature and writing',
          'law and justice',
          'medicine and healthcare',
          'technology trends',
          'global issues'
        ]
      default:
        return ['general vocabulary']
    }
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  async getWordExplanation(word: string): Promise<string> {
    const prompt = `Explain the word "${word}" in detail, including:
    1. Definition
    2. Common usage
    3. Example sentences
    4. Synonyms and antonyms
    5. Any idioms or phrases that use this word`

    try {
      const response = await this.geminiService.sendMessage(prompt)
      return response
    } catch (error) {
      console.error('Error getting word explanation:', error)
      throw new Error('Failed to get word explanation')
    }
  }

  calculateQuizResult(questions: QuizQuestion[], userAnswers: string[]): QuizResult {
    const correctAnswers = questions.reduce((count, question, index) => {
      return question.correctAnswer === userAnswers[index] ? count + 1 : count
    }, 0)

    const incorrectAnswers = questions.length - correctAnswers
    const score = (correctAnswers / questions.length) * 100

    const reviewWords = questions
      .filter((question, index) => question.correctAnswer !== userAnswers[index])
      .map(question => ({
        word: question.word,
        definition: question.definition,
        example: question.example
      }))

    return {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      reviewWords
    }
  }

  async suggestNextLevel(currentLevel: string, quizResult: QuizResult): Promise<string> {
    const prompt = `Based on a quiz result where the user scored ${quizResult.score}% at ${currentLevel} level:
    1. Should they stay at the same level or move up/down?
    2. What specific areas should they focus on?
    Provide the response as a JSON object with properties: recommendedLevel and feedback.`

    try {
      const response = await this.geminiService.sendMessage(prompt)
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      const recommendation = JSON.parse(cleanResponse)
      return recommendation.recommendedLevel
    } catch (error) {
      console.error('Error getting level recommendation:', error)
      return currentLevel // Default to keeping the same level if there's an error
    }
  }
} 