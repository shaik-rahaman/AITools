import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, X } from 'lucide-react';

interface CandidateModalActionsProps {
  email?: string;
  phone?: string;
  onClose: () => void;
}

/**
 * Action buttons for candidate modal
 * Provides quick actions like email, call, and close
 */
export const CandidateModalActions: FC<CandidateModalActionsProps> = ({ email, phone, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3"
    >
      {email && (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={`mailto:${email}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors min-h-11"
          aria-label={`Email ${email}`}
        >
          <Mail className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Email</span>
        </motion.a>
      )}

      {phone && (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={`tel:${phone}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors min-h-11"
          aria-label={`Call ${phone}`}
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Call</span>
        </motion.a>
      )}

      {(email || phone) && (
        <div className="flex-1 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors min-h-11"
            aria-label="View on LinkedIn"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">LinkedIn</span>
          </motion.button>
        </div>
      )}

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="flex-1 sm:flex-none p-2.5 sm:p-3 hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-slate-200 transition-colors min-h-11 min-w-11 flex items-center justify-center"
        aria-label="Close candidate profile"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};
