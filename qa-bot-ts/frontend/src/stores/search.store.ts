import { create } from 'zustand'
import { SearchMode, Candidate, SearchFilter } from '../types/search.types'

interface SearchStore {
  searchMode: SearchMode
  results: Candidate[]
  filters: SearchFilter
  isLoading: boolean
  error: string | null

  // Actions
  setSearchMode: (mode: SearchMode) => void
  setResults: (results: Candidate[]) => void
  setFilters: (filters: SearchFilter) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearResults: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchMode: 'hybrid',
  results: [],
  filters: {},
  isLoading: false,
  error: null,

  setSearchMode: (mode: SearchMode) => set({ searchMode: mode }),

  setResults: (results: Candidate[]) => set({ results }),

  setFilters: (filters: SearchFilter) => set({ filters }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearResults: () => set({ results: [], filters: {} }),
}))
