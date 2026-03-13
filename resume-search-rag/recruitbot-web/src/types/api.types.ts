// Type definitions for API responses and requests
export interface ResumeSearchResult {
  _id: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
  }>;
  score: number;
  searchMode: 'vector' | 'bm25' | 'hybrid';
}

export interface SearchRequest {
  query: string;
  searchType: 'vector' | 'bm25' | 'hybrid';
  topK: number;
  hybridWeights?: {
    vectorWeight: number;
    bm25Weight: number;
  };
  rerank?: boolean;
  summarize?: boolean;
}

export interface SearchResponse {
  results: ResumeSearchResult[];
  totalResults: number;
  executionTime: number;
  meta: {
    searchType: string;
    topK: number;
    reranked: boolean;
    summarized: boolean;
  };
}

export interface ApiError {
  error: string;
  details?: unknown;
  timestamp: string;
}
