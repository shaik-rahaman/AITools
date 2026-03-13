import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ChatMessageProps {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  resultCount?: number;
}

/**
 * Individual chat message component
 * Displays user or assistant messages with timestamps
 */
export const ChatMessage: FC<ChatMessageProps> = ({
  type,
  content,
  timestamp,
  resultCount,
}) => {
  const isUser = type === 'user';

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3 mb-4`}
    >
      {/* Message bubble */}
      <div
        className={`flex flex-col max-w-md ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <motion.div
          layout
          className={`px-4 py-3 rounded-xl ${
            isUser
              ? 'bg-gradient-to-r from-primary to-purple-500 text-white rounded-br-none'
              : 'bg-surface border border-border text-text rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed">{content}</p>

          {/* Result count badge */}
          {resultCount !== undefined && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium bg-white/10 px-2 py-1 rounded"
            >
              <span>✓</span>
              <span>{resultCount} results found</span>
            </motion.div>
          )}
        </motion.div>

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 mt-1 text-xs text-text-muted"
        >
          <Clock size={12} />
          <span>{formatTime(timestamp)}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
