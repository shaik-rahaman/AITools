import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Chat } from '@/components/features/Chat';
import { Results } from '@/components/common/Results';
import { useSearchStore } from '@/lib/stores/search.store';

/**
 * Home page - main chat/search interface with results
 * Phase 7: Mobile-optimized layout with accessibility improvements
 */
export const HomePage: FC = () => {
  const { results } = useSearchStore();
  const hasResults = results.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-base via-base to-surface/30">
      {/* Main content area with responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Chat Section - Takes full width on mobile, left side on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col overflow-hidden transition-all duration-300 ${
            hasResults
              ? 'lg:w-1/2 lg:border-r lg:border-slate-700/50'
              : 'w-full'
          }`}
          role="region"
          aria-label="Chat interface"
        >
          <Chat />
        </motion.div>

        {/* Results Section - Hidden on mobile when no results, full width on desktop with results */}
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col overflow-hidden lg:w-1/2 bg-slate-900/20 backdrop-blur-sm"
            role="region"
            aria-label="Search results"
          >
            {/* Results Header */}
            <div className="px-3 sm:px-4 py-3 border-b border-slate-700/50 bg-slate-900/50 shrink-0">
              <h2 className="text-sm font-semibold text-slate-200">Results</h2>
              <p className="text-xs text-slate-500 mt-1">
                Click on any result to view the full profile
              </p>
            </div>

            {/* Results Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 sm:px-4 py-4">
                <Results />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
