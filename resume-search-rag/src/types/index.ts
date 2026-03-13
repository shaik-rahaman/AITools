// src/types/index.ts

export interface HealthCheckResponse {
    appName: string;
    version: string;
    uptime: number;
}

export interface EmbeddingRequest {
    model?: string;
    input: string;
}

export interface SearchBM25Request {
    query: string;
    topK?: number;
    filters?: {
        minYearsExperience?: number;
    };
}

export interface VectorSearchRequest {
    query: string;
    topK?: number;
}

export interface HybridSearchRequest {
    query: string;
    topK?: number;
    filters?: {
        minYearsExperience?: number;
    };
}

export interface RerankRequest {
    query: string;
    candidates: Array<{
        resumeId: string;
        snippet: string;
    }>;
    topK?: number;
}

export interface SummarizeRequest {
    query: string;
    candidate: {
        resumeId: string;
        snippet: string;
    };
    style?: "short" | "detailed";
    maxTokens?: number;
}

export interface Resume {
    _id: string;
    text: string;
    embedding: number[];
    name: string;
    email: string;
    phone: string;
    location: string;
    company: string;
    role: string;
    education: string;
    total_Experience: number;
    relevant_Experience: number;
    skills: string[];
}

export interface Candidate {
    resumeId: string;
    snippet: string;
}

export interface SummarizationOptions {
    style?: 'short' | 'detailed';
    maxTokens?: number;
}