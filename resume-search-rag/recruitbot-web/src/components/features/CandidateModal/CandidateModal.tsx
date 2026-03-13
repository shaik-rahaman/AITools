import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/lib/stores/search.store';
import { useUIStore } from '@/lib/stores/ui.store';
import { CandidateModalHeader } from './CandidateModalHeader';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { CandidateModalActions } from './CandidateModalActions';

/**
 * Full-screen candidate profile modal
 * Displays complete resume information with all sections
 */
export const CandidateModal: FC = () => {
  const { results, selectedResultId, setSelectedResultId } = useSearchStore();
  const { candidateModalOpen, setCandidateModalOpen } = useUIStore();

  // Find selected candidate
  const selectedCandidate = results.find((r) => r._id === selectedResultId);

  const handleClose = () => {
    setCandidateModalOpen(false);
    setSelectedResultId(null);
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {candidateModalOpen && selectedCandidate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            onKeyDown={handleKeyDown}
            className="fixed inset-3 sm:inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="candidate-name"
          >
            {/* Header with scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8">
                {/* Candidate Header */}
                <CandidateModalHeader
                  name={selectedCandidate.name}
                  email={selectedCandidate.email}
                  phone={selectedCandidate.phone}
                  summary={selectedCandidate.summary}
                  score={selectedCandidate.score}
                  searchMode={selectedCandidate.searchMode}
                />

                {/* Experience */}
                <ExperienceSection experiences={selectedCandidate.experience} />

                {/* Education */}
                <EducationSection education={selectedCandidate.education} />

                {/* Skills */}
                <SkillsSection skills={selectedCandidate.skills} />

                {/* Additional Info */}
                {selectedCandidate.email || selectedCandidate.phone ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-xs text-slate-500"
                  >
                    <p className="mb-2 font-medium text-slate-400">Contact Information</p>
                    {selectedCandidate.email && (
                      <p className="mb-1">
                        <span className="text-slate-600">Email:</span>{' '}
                        <a href={`mailto:${selectedCandidate.email}`} className="text-indigo-400 hover:underline">
                          {selectedCandidate.email}
                        </a>
                      </p>
                    )}
                    {selectedCandidate.phone && (
                      <p>
                        <span className="text-slate-600">Phone:</span>{' '}
                        <a href={`tel:${selectedCandidate.phone}`} className="text-indigo-400 hover:underline">
                          {selectedCandidate.phone}
                        </a>
                      </p>
                    )}
                  </motion.div>
                ) : null}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-slate-700/50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-slate-900/50 backdrop-blur-sm shrink-0">
              <CandidateModalActions
                email={selectedCandidate.email}
                phone={selectedCandidate.phone}
                onClose={handleClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CandidateModal;
