import { create } from 'zustand';
export const useSearchStore = create((set) => ({
    searchMode: 'hybrid',
    results: [],
    filters: {},
    isLoading: false,
    error: null,
    setSearchMode: (mode) => set({ searchMode: mode }),
    setResults: (results) => set({ results }),
    setFilters: (filters) => set({ filters }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearResults: () => set({ results: [], filters: {} }),
}));
//# sourceMappingURL=search.store.js.map