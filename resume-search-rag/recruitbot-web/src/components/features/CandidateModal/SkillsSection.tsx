import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap } from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
}

/**
 * Skills section for candidate modal
 * Displays skills as colorful badges
 */
export const SkillsSection: FC<SkillsSectionProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return null;
  }

  const skillColors = [
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'bg-amber-500/20 text-amber-300 border-amber-500/30',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <Code2 className="w-4 h-4 text-emerald-400" />
        Skills ({skills.length})
      </h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + idx * 0.02 }}
            className={`inline-block text-xs font-medium px-3 py-1.5 rounded-full border ${
              skillColors[idx % skillColors.length]
            } hover:scale-105 transition-transform`}
          >
            <Zap className="inline w-3 h-3 mr-1" />
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
