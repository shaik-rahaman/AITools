// API response types
export interface SearchRequest {
  query: string
  searchType: 'keyword' | 'vector' | 'hybrid'
  topK?: number
}

export interface SearchResult {
  name: string
  email: string
  phoneNumber: string
  content: string
  score: number
  matchType?: 'keyword' | 'vector' | 'hybrid'
}

export interface SearchResponse {
  query: string
  searchType: string
  topK: number
  resultCount: number
  duration: number
  results: SearchResult[]
  metadata?: {
    hybridWeights?: {
      vector: number
      keyword: number
    }
    traceId?: string
  }
}

export interface ErrorResponse {
  error: string
  details?: string
  timestamp: string
}

// Health check
export interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  model: {
    provider: string
    model: string
  }
  retrievalPipeline: string
  activeConversations: number
}
