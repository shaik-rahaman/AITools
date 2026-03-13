import { apiClient } from './client';
import type { ResumeSearchResult } from '@/types/api.types';

/**
 * Search service for interacting with the backend search API
 */
export const searchService = {
  /**
   * Execute a hybrid search query
   */
  async search(query: string, params?: {
    searchType?: 'vector' | 'bm25' | 'hybrid';
    topK?: number;
    hybridWeights?: { vectorWeight: number; bm25Weight: number };
  }): Promise<ResumeSearchResult[]> {
    try {
      const searchType = params?.searchType || 'hybrid';
      const topK = params?.topK || 20;

      const requestBody: any = {
        query,
        topK,
      };

      if (searchType === 'hybrid' && params?.hybridWeights) {
        requestBody.hybridWeights = params.hybridWeights;
      }

      const response = await apiClient.post(`/v1/search/${searchType}`, requestBody);

      // Handle API response - for hybrid search, merge bm25 and vector results
      if (response.data.success && response.data.data?.results) {
        const results = response.data.data.results;
        
        // If hybrid search returns { bm25: [...], vector: [...] } structure, merge them
        if (results.bm25 || results.vector) {
          const merged: ResumeSearchResult[] = [];
          const seen = new Set<string>();
          
          // Add BM25 results first
          if (Array.isArray(results.bm25)) {
            for (const item of results.bm25) {
              const id = item._id?.toString() || item.id;
              if (id && !seen.has(id)) {
                merged.push(item);
                seen.add(id);
              }
            }
          }
          
          // Add vector results (if available and not already in set)
          if (Array.isArray(results.vector)) {
            for (const item of results.vector) {
              const id = item._id?.toString() || item.id;
              if (id && !seen.has(id)) {
                merged.push(item);
                seen.add(id);
              }
            }
          }
          
          return merged;
        }
        
        const finalResults = Array.isArray(results) ? results : merged;

        // Normalize results to avoid rendering crashes (e.g. skills as JSON string)
        const normalize = (item: any) => {
          if (!item) return item;
          // Ensure _id exists in a predictable place
          if (!item._id && item.id) item._id = item.id;

          // Normalize skills: accept arrays, JSON strings, or comma-separated strings
          if (item.skills) {
            if (typeof item.skills === 'string') {
              try {
                const parsed = JSON.parse(item.skills);
                if (Array.isArray(parsed)) item.skills = parsed;
                else item.skills = String(item.skills).split(/[,\n]+/).map((s: string) => s.trim()).filter(Boolean);
              } catch (e) {
                item.skills = String(item.skills).replace(/[\[\]"]+/g, '').split(/[,\n]+/).map((s: string) => s.trim()).filter(Boolean);
              }
            } else if (!Array.isArray(item.skills)) {
              item.skills = [String(item.skills)];
            }
          } else {
            item.skills = [];
          }

          // Ensure snippet/summary are strings
          if (item.snippet && typeof item.snippet !== 'string') item.snippet = String(item.snippet);
          if (item.summary && typeof item.summary !== 'string') item.summary = String(item.summary);

          return item;
        };

        return finalResults.map(normalize);
      } else if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('[Search Service] Error:', error);
      throw error;
    }
  },

  /**
   * BM25 (keyword) search
   */
  async bm25Search(query: string, topK = 20): Promise<ResumeSearchResult[]> {
    return this.search(query, { searchType: 'bm25', topK });
  },

  /**
   * Vector (semantic) search
   */
  async vectorSearch(query: string, topK = 20): Promise<ResumeSearchResult[]> {
    return this.search(query, { searchType: 'vector', topK });
  },

  /**
   * Hybrid search combining BM25 and vector
   */
  async hybridSearch(
    query: string,
    topK = 20,
    weights?: { vectorWeight: number; bm25Weight: number }
  ): Promise<ResumeSearchResult[]> {
    return this.search(query, {
      searchType: 'hybrid',
      topK,
      hybridWeights: weights,
    });
  },

  /**
   * Rerank results using LLM
   */
  async rerank(query: string, candidates: ResumeSearchResult[], topK = 20): Promise<ResumeSearchResult[]> {
    try {
      const response = await apiClient.post('/v1/search/rerank', {
        query,
        candidates,
        topK,
      });

      if (response.data.success && response.data.data?.results) {
        return response.data.data.results;
      }

      return [];
    } catch (error) {
      console.error('[Search Service] Rerank error:', error);
      throw error;
    }
  },

  /**
   * Summarize a candidate's resume
   */
  async summarize(resumeId: string, query?: string): Promise<string> {
    try {
      const response = await apiClient.post('/v1/search/summarize', {
        resumeId,
        query,
      });

      if (response.data.success && response.data.data?.summary) {
        return response.data.data.summary;
      }

      return '';
    } catch (error) {
      console.error('[Search Service] Summarize error:', error);
      throw error;
    }
  },
};
