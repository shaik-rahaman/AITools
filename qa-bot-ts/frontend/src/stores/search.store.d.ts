import { SearchMode, Candidate, SearchFilter } from '../types/search.types';
interface SearchStore {
    searchMode: SearchMode;
    results: Candidate[];
    filters: SearchFilter;
    isLoading: boolean;
    error: string | null;
    setSearchMode: (mode: SearchMode) => void;
    setResults: (results: Candidate[]) => void;
    setFilters: (filters: SearchFilter) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearResults: () => void;
}
export declare const useSearchStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SearchStore>>;
export {};
//# sourceMappingURL=search.store.d.ts.map