import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { CandidateModal } from '../features/CandidateModal/CandidateModal';

/**
 * Main application shell layout
 * Provides sidebar + main content area with responsive layout
 */
export const AppShell: FC = () => {
  return (
    <div className="flex h-screen w-full bg-base text-text overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <motion.main
        className="flex-1 overflow-hidden flex flex-col relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>

      {/* Candidate Modal */}
      <CandidateModal />
    </div>
  );
};

export default AppShell;
