import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

/**
 * Experience section for candidate modal
 * Displays work history with company, role, duration, and description
 */
export const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <Briefcase className="w-4 h-4 text-indigo-400" />
        Work Experience
      </h3>

      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.05 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{exp.role}</h4>
                <p className="text-xs text-indigo-400">{exp.company}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap ml-2">
                <Calendar className="w-3 h-3" />
                {exp.duration}
              </div>
            </div>
            {exp.description && (
              <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
