import type { FC } from 'react';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/lib/stores/search.store';
import { ResultCard } from './ResultCard';
import { ResultsPagination } from './ResultsPagination';
import { AlertCircle, Search } from 'lucide-react';

/**
 * Results display component
 * Shows paginated search results with filtering and sorting
 */
export const Results: FC = () => {
  const { results, currentPage, resultsPerPage, setSelectedResultId, minScore } = useSearchStore();

  // Filter results by minimum score
  const filteredResults = useMemo(
    () => results.filter((r) => r.score >= minScore),
    [results, minScore]
  );

  // Paginate results
  const paginatedResults = useMemo(() => {
    const startIdx = (currentPage - 1) * resultsPerPage;
    return filteredResults.slice(startIdx, startIdx + resultsPerPage);
  }, [filteredResults, currentPage, resultsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  // Show empty state
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto py-12 text-center"
      >
        <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">No results yet</h3>
        <p className="text-sm text-slate-500">
          Search for candidates using the chat interface above
        </p>
      </motion.div>
    );
  }

  // Show filtered empty state
  if (filteredResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto py-12 text-center"
      >
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">No matches with current filters</h3>
        <p className="text-sm text-slate-500">
          Try adjusting the minimum score filter in the sidebar
        </p>
      </motion.div>
    );
  }

  // Calculate result indices for ranking
  const startRank = (currentPage - 1) * resultsPerPage + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Results header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-1">
            Results ({filteredResults.length})
          </h2>
          <p className="text-xs text-slate-500">
            Showing {startRank}-{Math.min(startRank + resultsPerPage - 1, filteredResults.length)} of{' '}
            {filteredResults.length}
          </p>
        </div>
        {filteredResults.length > resultsPerPage && (
          <div className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Results list */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {paginatedResults.map((result, idx) => (
            <ResultCard
              key={result._id}
              result={result}
              rank={startRank + idx}
              onSelect={(selectedResult) => setSelectedResultId(selectedResult._id)}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <ResultsPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </motion.div>
  );
};
