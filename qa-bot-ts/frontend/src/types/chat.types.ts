export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ConversationalQueryResult {
  response: string
  conversationId: string
  messageCount: number
  model: string
  provider: string
  searchResults?: Array<{
    name: string
    email: string
    phoneNumber: string
    score: number
    matchType?: string
    extractedInfo?: {
      currentCompany?: string
      location?: string
      skills?: string[]
      experience?: string
      keyHighlights?: string[]
    }
    llmReasoning?: string
  }>
  searchMetadata?: {
    query: string
    searchType: string
    resultCount: number
    duration?: number
  }
}

export interface ConversationHistoryResult {
  conversationId: string
  messages: ChatMessage[]
  messageCount: number
}
