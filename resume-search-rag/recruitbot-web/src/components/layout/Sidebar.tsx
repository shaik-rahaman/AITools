import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useUIStore } from '@/lib/stores/ui.store';
import { useChatStore } from '@/lib/stores/chat.store';
import { cn } from '@/lib/utils/helpers';
import {
  Menu,
  X,
  Grid3x3,
  BookOpen,
  Sliders,
  Sparkles,
  Trash2,
  ChevronDown,
  Zap,
} from 'lucide-react';

/**
 * Sidebar component with search mode selection and controls
 * Phase 2: Enhanced styling, animations, and interactive controls
 */
export const Sidebar: FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const {
    searchMode,
    setSearchMode,
    topK,
    setTopK,
    vectorWeight,
    setVectorWeight,
    enableRerank,
    setEnableRerank,
    enableSummarize,
    setEnableSummarize,
    clearMessages,
  } = useChatStore();

  const sidebarVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    closed: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  const buttonVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  const getSearchModeIcon = (mode: string) => {
    switch (mode) {
      case 'vector':
        return <Zap size={16} />;
      case 'bm25':
        return <BookOpen size={16} />;
      case 'hybrid':
        return <Grid3x3 size={16} />;
      default:
        return null;
    }
  };

  const getSearchModeDescription = (mode: string) => {
    switch (mode) {
      case 'vector':
        return 'Semantic similarity';
      case 'bm25':
        return 'Keyword matching';
      case 'hybrid':
        return 'Combined search';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Sidebar Container */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="bg-card border-r border-border flex flex-col w-sidebar overflow-hidden shadow-lg relative z-40"
          >
            {/* Close button (mobile) */}
            <motion.button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface transition-all md:hidden z-50"
              aria-label="Close sidebar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} className="text-text-muted" />
            </motion.button>

            {/* Scrollable content */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 scrollbar-thin">
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ rotate: 12 }}
                  className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-accent rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg"
                >
                  RB
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-bold text-lg text-white truncate">RecruitBot</h1>
                  <p className="text-xs text-text-muted truncate">Resume Search AI</p>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-border via-border to-transparent" />

              {/* Search Mode Selection */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-primary" />
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                    Search Mode
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  {(['vector', 'bm25', 'hybrid'] as const).map((m, idx) => (
                    <motion.button
                      key={m}
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      onClick={() => setSearchMode(m)}
                      className={cn(
                        'px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative group',
                        searchMode === m
                          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/50'
                          : 'bg-surface text-text-muted hover:bg-surface/80 border border-border/40'
                      )}
                    >
                      <span className="text-lg">{getSearchModeIcon(m)}</span>
                      <span className="flex-1 text-left">{m.charAt(0).toUpperCase() + m.slice(1)}</span>
                      {searchMode === m && (
                        <motion.div
                          layoutId="activeMode"
                          className="absolute inset-0 rounded-lg border-2 border-white/30 pointer-events-none"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-base px-2 py-1 rounded text-text-muted">
                        {getSearchModeDescription(m)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Top K Control */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronDown size={14} className="text-accent" />
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                      Results Limit
                    </label>
                  </div>
                  <motion.span
                    key={topK}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-primary bg-surface px-2.5 py-0.5 rounded-md"
                  >
                    {topK}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-surface rounded-lg appearance-none cursor-pointer slider-thumb accent-primary"
                  aria-label="Set number of results"
                />
                <div className="flex justify-between text-xs text-text-muted px-1">
                  <span>1</span>
                  <span>50</span>
                </div>
              </motion.div>

              {/* Hybrid Weights (Conditional) */}
              <AnimatePresence>
                {searchMode === 'hybrid' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 border-l-2 border-accent pl-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders size={14} className="text-accent" />
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                        Search Weights
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">Vector (Semantic)</span>
                        <motion.span
                          key={Math.round(vectorWeight * 100)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-xs font-bold text-primary"
                        >
                          {Math.round(vectorWeight * 100)}%
                        </motion.span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={vectorWeight}
                        onChange={(e) => setVectorWeight(parseFloat(e.target.value))}
                        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider-thumb accent-primary"
                        aria-label="Vector search weight"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-xs text-text-muted">BM25 (Keywords)</span>
                      <motion.span
                        key={Math.round((1 - vectorWeight) * 100)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs font-bold text-accent"
                      >
                        {Math.round((1 - vectorWeight) * 100)}%
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" />
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                    AI Features
                  </label>
                </div>

                {/* Smart Rerank Toggle */}
                <motion.button
                  onClick={() => setEnableRerank(!enableRerank)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group',
                    enableRerank
                      ? 'bg-gradient-to-r from-primary/80 to-purple-600/80 text-white shadow-md'
                      : 'bg-surface text-text-muted border border-border/40 hover:bg-surface/80'
                  )}
                  aria-label={`${enableRerank ? 'Disable' : 'Enable'} smart reranking`}
                >
                  <motion.span
                    animate={{ rotate: enableRerank ? 360 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Zap size={16} />
                  </motion.span>
                  <span className="flex-1 text-left">Smart Rerank</span>
                  <motion.div
                    className={cn(
                      'w-5 h-3 rounded-full transition-colors',
                      enableRerank ? 'bg-white/30' : 'bg-white/10'
                    )}
                    animate={{ opacity: enableRerank ? 1 : 0.5 }}
                  />
                </motion.button>

                {/* Summarize Toggle */}
                <motion.button
                  onClick={() => setEnableSummarize(!enableSummarize)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group',
                    enableSummarize
                      ? 'bg-gradient-to-r from-accent/80 to-pink-600/80 text-white shadow-md'
                      : 'bg-surface text-text-muted border border-border/40 hover:bg-surface/80'
                  )}
                  aria-label={`${enableSummarize ? 'Disable' : 'Enable'} AI summarization`}
                >
                  <motion.span
                    animate={{ rotate: enableSummarize ? 360 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Sparkles size={16} />
                  </motion.span>
                  <span className="flex-1 text-left">AI Summary</span>
                  <motion.div
                    className={cn(
                      'w-5 h-3 rounded-full transition-colors',
                      enableSummarize ? 'bg-white/30' : 'bg-white/10'
                    )}
                    animate={{ opacity: enableSummarize ? 1 : 0.5 }}
                  />
                </motion.button>
              </motion.div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Clear History Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                onClick={clearMessages}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-red-950/30 text-red-400 hover:bg-red-950/50 transition-all duration-200 flex items-center justify-center gap-2 border border-red-900/50"
                aria-label="Clear conversation history"
              >
                <Trash2 size={16} />
                Clear History
              </motion.button>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="border-t border-border p-4 text-center space-y-1"
            >
              <p className="text-xs font-medium text-text-muted">RecruitBot</p>
              <p className="text-xs text-text-muted/60">v1.0.0 • Phase 2</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Toggle Button (Visible when sidebar closed) */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            key="toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-6 left-6 p-3 rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all z-30"
            aria-label="Open sidebar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
