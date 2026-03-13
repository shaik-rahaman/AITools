import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface CandidateModalHeaderProps {
  name: string;
  email?: string;
  phone?: string;
  summary?: string;
  score: number;
  searchMode: string;
}

/**
 * Header section for candidate modal
 * Displays candidate name, contact info, and summary
 */
export const CandidateModalHeader: FC<CandidateModalHeaderProps> = ({
  name,
  email,
  phone,
  summary,
  score,
  searchMode,
}) => {
  const displayScore = Math.round(Math.min(100, Math.max(0, score * 100)));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 pb-6 border-b border-slate-700/50"
    >
      {/* Header with name and score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 id="candidate-name" className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">
            {name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-wrap gap-1">
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 hover:underline truncate"
              >
                {email}
              </a>
            )}
            {email && phone && <span className="text-slate-600 hidden sm:inline">•</span>}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                {phone}
              </a>
            )}
          </div>
        </div>

        {/* Score badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex flex-col items-center gap-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-2.5 sm:p-3 min-w-20 shrink-0"
          aria-label={`Score: ${displayScore}%`}
        >
          <Star className="w-4 h-4 text-amber-300 fill-current" />
          <span className="text-lg sm:text-xl font-bold text-white">{displayScore}%</span>
          <span className="text-xs text-slate-300">{searchMode}</span>
        </motion.div>
      </div>

      {/* Summary */}
      {summary && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-400 leading-relaxed bg-slate-800/30 rounded-lg p-3 border border-slate-700/50"
        >
          {summary}
        </motion.p>
      )}
    </motion.div>
  );
};
