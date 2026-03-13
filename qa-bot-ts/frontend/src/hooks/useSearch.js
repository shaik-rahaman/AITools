import { useMutation } from '@tanstack/react-query';
import { searchAPI } from '../lib/api/search.api';
import { useSearchStore } from '../stores/search.store';
export const useSearch = () => {
    const { setResults, setLoading, setError, searchMode, filters } = useSearchStore();
    const searchMutation = useMutation({
        mutationFn: async (query) => {
            setLoading(true);
            setError(null);
            try {
                const request = {
                    query,
                    searchType: searchMode,
                    topK: 10,
                };
                return await searchAPI.search(request);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Search failed';
                setError(errorMsg);
                throw error;
            }
            finally {
                setLoading(false);
            }
        },
        onSuccess: (response) => {
            // Transform results and apply client-side filters
            let results = response.results;
            // Apply filters
            if (filters.skills && filters.skills.length > 0) {
                results = results.filter((r) => {
                    const content = r.content.toLowerCase();
                    return filters.skills.some((skill) => content.includes(skill.toLowerCase()));
                });
            }
            if (filters.location) {
                results = results.filter((r) => r.content.toLowerCase().includes(filters.location.toLowerCase()));
            }
            setResults(results.map((r) => ({
                ...r,
                id: `${r.email}-${r.score}-${r.name}`,
            })));
        },
    });
    return {
        search: (query) => searchMutation.mutate(query),
        isLoading: searchMutation.isPending,
        error: searchMutation.error,
        isError: searchMutation.isError,
    };
};
//# sourceMappingURL=useSearch.js.map