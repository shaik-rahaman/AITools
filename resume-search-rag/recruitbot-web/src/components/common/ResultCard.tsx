import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Star, Briefcase, Code2, ChevronRight } from 'lucide-react';
import type { ResumeSearchResult } from '@/types/api.types';
import { useSearchStore } from '@/lib/stores/search.store';
import { useUIStore } from '@/lib/stores/ui.store';

interface ResultCardProps {
  result: ResumeSearchResult;
  rank: number;
  onSelect?: (result: ResumeSearchResult) => void;
}

/**
 * Individual result card component
 * Displays candidate info with ranking badge and score pill
 */
export const ResultCard: FC<ResultCardProps> = ({ result, rank, onSelect }) => {
  const { setSelectedResultId } = useSearchStore();
  const { setCandidateModalOpen } = useUIStore();
  // Defensive normalization to avoid crashes from malformed data
  const normalizedId = (result && (result._id ?? (result.id ?? ''))) || '';

  const normalizedSkills: string[] = (() => {
    try {
      if (Array.isArray(result.skills)) return result.skills as string[];
      if (typeof result.skills === 'string') {
        try {
          const parsed = JSON.parse(result.skills);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // fallthrough to comma/newline split
        }
        return result.skills.replace(/[\[\]"]+/g, '').split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
      }
      if (result.skills == null) return [];
      return [String(result.skills)];
    } catch (e) {
      return [];
    }
  })();

  const firstExperience: any = Array.isArray(result.experience)
    ? result.experience[0]
    : result.experience ?? undefined;

  const scoreNum = typeof result.score === 'number' ? result.score : Number(result.score) || 0;

  const handleClick = () => {
    setSelectedResultId(normalizedId);
    setCandidateModalOpen(true);
    onSelect?.(result);
  };

  // Normalize score to 0-100 for display
  const displayScore = Math.round(Math.min(100, Math.max(0, scoreNum * 100)));
  const scoreColor =
    displayScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
    displayScore >= 60 ? 'bg-blue-500/20 text-blue-400' :
    displayScore >= 40 ? 'bg-amber-500/20 text-amber-400' :
    'bg-red-500/20 text-red-400';

  const containerVariants = {
    initial: { opacity: 0, y: 10, x: -20 },
    animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.3, delay: rank * 0.05 } },
    hover: { x: 8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' },
  };

  const getRankColor = (index: number) => {
    if (index === 1) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    if (index === 2) return 'bg-gradient-to-r from-slate-400 to-slate-500';
    if (index === 3) return 'bg-gradient-to-r from-amber-700 to-orange-700';
    return 'bg-indigo-600';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={handleClick}
      className="group rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-4 cursor-pointer transition-all duration-200 hover:border-indigo-500/50"
    >
      {/* Header with rank badge and score */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div
            className={`${getRankColor(rank)} rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-sm shrink-0`}
          >
            #{rank}
          </div>

          {/* Name and title */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
              {result.name}
            </h3>
            {firstExperience?.role && (
              <p className="text-xs text-slate-400">{firstExperience.role}</p>
            )}
          </div>
        </div>

        {/* Score Pill */}
        <div className={`${scoreColor} rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap`}>
          {displayScore}%
        </div>
      </div>

      {/* Summary/Description */}
      {(result.summary || result.snippet) && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
          {(result.summary ?? result.snippet ?? '').toString().slice(0, 150)}...
        </p>
      )}

      {/* Skills */}
      {normalizedSkills && normalizedSkills.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Code2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-400">Top Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {normalizedSkills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30"
              >
                {skill}
              </span>
            ))}
            {normalizedSkills.length > 4 && (
              <span className="inline-block text-xs text-slate-500 px-2 py-1">
                +{normalizedSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-700/50 pt-2">
        {firstExperience?.company && (
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{firstExperience.company}</span>
          </div>
        )}
        {result.email && (
          <div className="flex items-center gap-1 hover:text-slate-300">
            <a href={`mailto:${result.email}`} className="hover:underline">
              {result.email}
            </a>
          </div>
        )}
        <div className="flex items-center gap-1 text-slate-600 text-xs">
          <Star className="w-3 h-3" fill="currentColor" />
          {result.searchMode}
        </div>
      </div>
    </motion.div>
  );
};
