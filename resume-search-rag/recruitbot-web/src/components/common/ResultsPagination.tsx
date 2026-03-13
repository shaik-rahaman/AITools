import type { FC } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchStore } from '@/lib/stores/search.store';

interface ResultsPaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * Pagination controls for search results
 * Allows navigation between result pages
 */
export const ResultsPagination: FC<ResultsPaginationProps> = ({ currentPage, totalPages }) => {
  const { setCurrentPage } = useSearchStore();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to results top
      document.querySelector('.max-w-3xl')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to results top
      document.querySelector('.max-w-3xl')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2"
    >
      {/* Previous button */}
      <motion.button
        whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 rounded border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => (
          <motion.button
            key={idx}
            whileHover={page !== '...' && page !== currentPage ? { scale: 1.1 } : {}}
            whileTap={page !== '...' && page !== currentPage ? { scale: 0.9 } : {}}
            onClick={() => {
              if (page !== '...' && typeof page === 'number') {
                setCurrentPage(page);
              }
            }}
            disabled={page === '...'}
            className={`
              px-3 py-1.5 rounded text-sm font-medium transition-all
              ${
                page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : page === '...'
                    ? 'text-slate-500 cursor-default'
                    : 'border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500'
              }
            `}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next button */}
      <motion.button
        whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};
