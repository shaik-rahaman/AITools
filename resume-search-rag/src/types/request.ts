// src/types/request.ts

export interface HealthCheckRequest {
    // No body required for health check
}

export interface EmbeddingRequest {
    model?: string; // Optional model name, defaults to config
    input: string; // Text to generate embedding for
}

export interface BM25SearchRequest {
    query: string; // Search query
    topK?: number; // Number of top results to return
    filters?: {
        minYearsExperience?: number; // Optional filter for minimum years of experience
    };
}

export interface VectorSearchRequest {
    query: string; // Search query
    topK?: number; // Number of top results to return
}

export interface HybridSearchRequest {
    query: string; // Search query
    topK?: number; // Number of top results to return
    filters?: {
        minYearsExperience?: number; // Optional filter for minimum years of experience
    };
}

export interface RerankRequest {
    query: string; // Search query
    candidates: Array<{
        resumeId: string; // ID of the candidate resume
        snippet: string; // Snippet of the candidate resume
    }>;
    topK?: number; // Number of top results to return
}

export interface SummarizeRequest {
    query: string; // Role description or job description
    candidate: {
        resumeId: string; // ID of the candidate resume
        snippet: string; // Snippet of the candidate resume
    };
    style?: 'short' | 'detailed'; // Optional style for the summary
    maxTokens?: number; // Optional maximum tokens for the summary
}

export interface EndToEndSearchRequest {
    query: string; // Search query
    filters?: {
        minYearsExperience?: number; // Optional filter for minimum years of experience
    };
    summarize?: boolean; // Flag to indicate if summarization is requested
}