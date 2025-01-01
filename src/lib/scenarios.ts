import { GeminiService } from './gemini'

export interface Scenario {
  id: string
  title: string
  description: string
  context: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  vocabulary: {
    word: string
    definition: string
    example: string
  }[]
  suggestedResponses: string[]
}

export interface FeedbackResponse {
  overall: string
  pronunciation: {
    score: number
    issues: string[]
    improvements: string[]
  }
  grammar: {
    score: number
    issues: string[]
    corrections: string[]
  }
  vocabulary: {
    score: number
    goodUsage: string[]
    suggestions: string[]
  }
  naturalness: {
    score: number
    positives: string[]
    improvements: string[]
  }
}

export class ScenarioService {
  private geminiService: GeminiService

  constructor() {
    this.geminiService = new GeminiService()
  }

  private readonly categories = {
    'Academic': [
      'Research Discussion',
      'Thesis Defense',
      'Literature Review',
      'Conference Presentation',
      'Peer Review',
      'Grant Proposal',
      'Academic Writing',
      'Journal Publication',
      'Research Methodology',
      'Data Analysis',
      'Academic Collaboration',
      'Research Ethics',
      'Lab Work Discussion',
      'Academic Mentoring',
      'Scholarly Debate'
    ],
    'Education': [
      'Class participation',
      'Group projects',
      'Academic advising',
      'Library research',
      'Student services',
      'Exam preparation',
      'Study groups',
      'Online learning',
      'Teacher conferences',
      'Course registration',
      'Assignment Discussion',
      'Presentation Skills',
      'Note-taking Strategies',
      'Time Management',
      'Peer Tutoring'
    ],
    'Restaurant': [
      'Ordering food',
      'Making a reservation',
      'Dealing with dietary restrictions',
      'Complaining about service',
      'Asking for recommendations',
      'Special occasions',
      'Fast food ordering',
      'Food allergies discussion'
    ],
    'Travel': [
      'Checking into a hotel',
      'Buying train tickets',
      'Airport check-in',
      'Asking for directions',
      'Booking a tour',
      'Lost luggage',
      'Travel insurance claims',
      'Tourist attractions',
      'Public transportation',
      'Car rental'
    ],
    'Business': [
      'Job interview',
      'Business meeting',
      'Presentation',
      'Negotiation',
      'Networking',
      'Client calls',
      'Performance review',
      'Project management',
      'Team collaboration',
      'Email communication'
    ],
    'Healthcare': [
      'Doctor appointment',
      'Emergency room',
      'Pharmacy',
      'Describing symptoms',
      'Mental health consultation',
      'Dental visit',
      'Medical insurance',
      'Specialist referral',
      'Medical history',
      'Vaccination'
    ],
    'Social': [
      'Meeting new people',
      'Party conversation',
      'Dating',
      'Making plans with friends',
      'Small talk',
      'Cultural events',
      'Sports discussion',
      'Family gatherings',
      'Social media',
      'Hobbies'
    ],
    'Shopping': [
      'Clothes shopping',
      'Grocery store',
      'Returns and exchanges',
      'Bargaining at a market',
      'Online shopping issues',
      'Electronics store',
      'Gift shopping',
      'Size and fitting',
      'Price comparison',
      'Customer service'
    ],
    'Technology': [
      'Tech support',
      'Software troubleshooting',
      'Device setup',
      'Digital services',
      'Online security',
      'App usage',
      'Smart home',
      'Social media',
      'Digital payments',
      'Virtual meetings'
    ],
    'Entertainment': [
      'Movie discussion',
      'Concert tickets',
      'Book club',
      'Game night',
      'TV shows',
      'Music festivals',
      'Theater performance',
      'Sports events',
      'Art gallery',
      'Streaming services'
    ]
  }

  async generateScenario(category: string, level: string, subcategory?: string): Promise<Scenario> {
    const prompt = `
Generate a highly detailed and realistic conversation scenario for English learners at the ${level} level in the category "${category}"${subcategory ? ` with a focus on "${subcategory}"` : ''}. The output must be challenging yet suitable for learners at the specified level.

**Include the following sections:**
1. **Scenario Title**: A concise, engaging title.
2. **Description**: A brief, clear explanation of the scenario's objective and relevance.
3. **Context**: A vivid, detailed description of the situation, including participants, location, and the learner's role in the scenario.
4. **Level**: Indicate that this is for "${level}" level learners.
5. **Category**: The primary category "${category}" and any subcategory "${subcategory}".
6. **Key Vocabulary**: Provide a list of 5-7 important words or phrases. For each:
   - **Word/Phrase**: The term.
   - **Definition**: A clear and concise explanation of its meaning.
   - **Example**: A sentence showing realistic and correct usage.
7. **Suggested Responses**: Include 3-4 natural, context-appropriate responses or phrases that a learner might use in this scenario.

**Ensure:**
- The scenario context is realistic, engaging, and relevant to learners' potential real-life situations.
- Vocabulary terms are useful and directly applicable to the context provided.
- Suggested responses reflect common expressions, idiomatic usage (if applicable), and language structures suitable for the specified level.

**Output format (strict JSON):**
{
  "id": "unique-id",
  "title": "Scenario title",
  "description": "Brief description",
  "context": "Detailed situation description",
  "level": "${level}",
  "category": "${category}",
  "vocabulary": [
    {
      "word": "example",
      "definition": "clear explanation",
      "example": "usage in context"
    }
  ],
  "suggestedResponses": [
    "appropriate response 1",
    "appropriate response 2",
    "appropriate response 3"
  ]
}

**Validation Instructions:**
- Ensure all fields are populated appropriately.
- Vocabulary terms must include clear examples relevant to the context.
- Avoid overly simplistic or vague suggestions.

Do not include any code blocks, extraneous commentary, or formatting outside the JSON structure. Return only the completed JSON.`

    try {
      const response = await this.geminiService.sendMessage(prompt)
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanResponse)
    } catch (error) {
      console.error('Error generating scenario:', error)
      throw new Error('Failed to generate scenario')
    }
  }

  async getPracticeResponse(scenario: Scenario, userResponse: string): Promise<FeedbackResponse> {
    const prompt = `
As a professional English language tutor, evaluate the following user response in a ${scenario.level} level conversation. The focus is on providing detailed and actionable feedback to help the learner improve.

**Scenario Context:**
"${scenario.context}"

**User's Response:**
"${userResponse}"

**Feedback Requirements:**
1. **Overall Feedback**:
   - Provide a concise summary of the overall quality of the user's response.
   - Highlight strengths and key areas for improvement.

2. **Pronunciation (if inferred from text)**:
   - Assume typical mispronunciation issues based on written text and common learner challenges at this level.
   - Suggest improvements, such as stress patterns or intonation in sentences.

3. **Grammar**:
   - Assign a score (0-100) for grammar usage.
   - Identify specific grammar issues, if any.
   - Provide corrected versions for each identified issue.

4. **Vocabulary**:
   - Assign a score (0-100) for vocabulary usage.
   - Highlight good usage of vocabulary in the response.
   - Suggest additional or alternative words/phrases to improve lexical variety or precision.

5. **Naturalness**:
   - Assign a score (0-100) for how natural the response sounds.
   - Highlight any positive natural expressions used.
   - Provide actionable suggestions to make the response sound more natural or fluent.

**Output format (strict JSON):**
{
  "overall": "Overall feedback summary",
  "pronunciation": {
    "score": null,
    "issues": ["specific pronunciation issues or inferred problems based on text"],
    "improvements": ["suggested pronunciation improvements"]
  },
  "grammar": {
    "score": 0-100,
    "issues": ["identified grammar issues"],
    "corrections": ["corrected versions"]
  },
  "vocabulary": {
    "score": 0-100,
    "goodUsage": ["well-used words/phrases"],
    "suggestions": ["suggested alternatives or additions"]
  },
  "naturalness": {
    "score": 0-100,
    "positives": ["natural expressions used"],
    "improvements": ["ways to sound more natural"]
  }
}

**Additional Instructions:**
- Assume no voice input; base pronunciation feedback on common challenges for this level.
- Avoid overly vague feedback. Be specific and actionable in your suggestions.
- Use realistic examples relevant to the context of the scenario.
- Ensure JSON output is complete, with no missing fields or placeholders.`

    try {
      const response = await this.geminiService.sendMessage(prompt)
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanResponse)
    } catch (error) {
      console.error('Error getting feedback:', error)
      throw new Error('Failed to get response feedback')
    }
  }

  getCategories(): { [key: string]: string[] } {
    return this.categories
  }

  async getSuggestedScenarios(level: string, interests: string[]): Promise<Scenario[]> {
    const scenarios: Scenario[] = []
    for (const interest of interests) {
      try {
        const scenario = await this.generateScenario(interest, level)
        scenarios.push(scenario)
      } catch (error) {
        console.error(`Error generating scenario for ${interest}:`, error)
      }
    }
    return scenarios
  }
} 