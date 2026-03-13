import type { FC } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
}

interface EducationSectionProps {
  education: EducationItem[];
}

/**
 * Education section for candidate modal
 * Displays degrees, institutions, and fields of study
 */
export const EducationSection: FC<EducationSectionProps> = ({ education }) => {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <GraduationCap className="w-4 h-4 text-blue-400" />
        Education
      </h3>

      <div className="space-y-3">
        {education.map((edu, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.05 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{edu.degree}</h4>
                <p className="text-xs text-blue-400">{edu.institution}</p>
                {edu.field && (
                  <p className="text-xs text-slate-500 mt-1">
                    <Award className="inline w-3 h-3 mr-1" />
                    {edu.field}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
