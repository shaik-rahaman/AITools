export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'RecruitBot';
export const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true';

export const SEARCH_MODES = {
  VECTOR: 'vector',
  BM25: 'bm25',
  HYBRID: 'hybrid',
} as const;

export const DEFAULT_TOP_K = 5;
export const MIN_TOP_K = 1;
export const MAX_TOP_K = 50;

export const DEFAULT_HYBRID_WEIGHT = 0.5;
export const DEFAULT_RERANK = true;
