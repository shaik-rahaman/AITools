export type SearchMode = 'keyword' | 'vector' | 'hybrid'
export type UserRole = 'developer' | 'qa_engineer' | 'devops_engineer'

export interface Candidate {
  id: string
  name: string
  email: string
  phoneNumber: string
  content: string
  score: number
  matchType?: 'keyword' | 'vector' | 'hybrid'
  extractedInfo?: {
    currentCompany?: string
    location?: string
    skills?: string[]
    experience?: string
    keyHighlights?: string[]
  }
  llmReasoning?: string
}

export interface SearchFilter {
  skills?: string[]
  experience?: string
  location?: string
  currentCompany?: string
  education?: string
}
