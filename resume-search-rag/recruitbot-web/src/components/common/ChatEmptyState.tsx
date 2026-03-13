import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Brain } from 'lucide-react';

/**
 * Empty state displayed when no messages
 * Shows welcome message and usage tips
 */
export const ChatEmptyState: FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Search by skills, experience, or keywords',
    },
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Intelligent ranking and summarization',
    },
    {
      icon: MessageCircle,
      title: 'Interactive',
      description: 'Conversational search interface',
    },
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center h-full px-4 py-12 gap-8 text-center"
    >
      {/* Title */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-text">
          Start Your Search
        </h2>
        <p className="text-text-muted text-sm sm:text-base">
          Ask questions or describe the ideal candidate
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="p-4 bg-surface/50 border border-border/50 rounded-lg hover:border-border transition-all"
          >
            <motion.div
              className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <feature.icon size={16} className="text-primary" />
            </motion.div>
            <p className="font-medium text-text text-sm">{feature.title}</p>
            <p className="text-xs text-text-muted mt-1">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tips */}
      <motion.div
        variants={itemVariants}
        className="text-xs text-text-muted/70 space-y-1"
      >
        <p>💡 Try asking: "Find Python developers with 5+ years experience"</p>
        <p>💡 Or: "Show me MBA graduates in finance"</p>
      </motion.div>
    </motion.div>
  );
};

export default ChatEmptyState;
