import type { FC } from 'react';
import { motion } from 'framer-motion';

/**
 * Loading indicator with animated typing dots
 */
export const LoadingIndicator: FC = () => {
  const dotVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: -8,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    }),
  };

  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={dotVariants}
          initial="hidden"
          animate="visible"
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
  );
};

export default LoadingIndicator;
