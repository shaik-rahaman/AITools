import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ResumeSearchResult } from '@/types/api.types';

interface SearchStoreState {
  // Results
  results: ResumeSearchResult[];
  setResults: (results: ResumeSearchResult[]) => void;
  clearResults: () => void;

  // Selected result
  selectedResultId: string | null;
  setSelectedResultId: (id: string | null) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resultsPerPage: number;

  // Filters
  minScore: number;
  setMinScore: (score: number) => void;
}

export const useSearchStore = create<SearchStoreState>()(
  devtools(
    (set) => ({
      // Results
      results: [],
      setResults: (results) => set({ results }),
      clearResults: () => set({ results: [], currentPage: 1 }),

      // Selected result
      selectedResultId: null,
      setSelectedResultId: (id) => set({ selectedResultId: id }),

      // Pagination
      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),
      resultsPerPage: 10,

      // Filters
      minScore: 0,
      setMinScore: (score) => set({ minScore: score }),
    }),
    { name: 'SearchStore' }
  )
);
