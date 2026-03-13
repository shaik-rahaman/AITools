import type { FC } from 'react';
import { motion } from 'framer-motion';

interface SuggestionChip {
  icon: string;
  label: string;
  query: string;
}

interface SuggestionChipsProps {
  suggestions: SuggestionChip[];
  onSelect: (query: string) => void;
}

/**
 * Quick-action suggestion chips
 */
export const SuggestionChips: FC<SuggestionChipsProps> = ({
  suggestions,
  onSelect,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2 justify-center px-4"
    >
      {suggestions.map((chip, idx) => (
        <motion.button
          key={idx}
          variants={chipVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(chip.query)}
          className="px-4 py-2 bg-surface/50 hover:bg-surface border border-border/50 hover:border-border rounded-full text-sm font-medium text-text-muted hover:text-text transition-all flex items-center gap-2 group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">
            {chip.icon}
          </span>
          {chip.label}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionChips;
