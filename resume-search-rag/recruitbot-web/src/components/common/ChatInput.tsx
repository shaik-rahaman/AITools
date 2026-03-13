import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

/**
 * Chat input field with send button
 * Features text input with keyboard submit support
 */
export const ChatInput: FC<ChatInputProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="px-3 sm:px-4 pb-4 sm:pb-6 pt-3 sm:pt-4 shrink-0"
    >
      <div
        className={cn(
          'relative flex items-end gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-200',
          isFocused
            ? 'border-primary bg-input shadow-lg shadow-primary/10'
            : 'border-border bg-input/50 hover:bg-input'
        )}
      >
        {/* Input field */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for candidates, skills, experience..."
          className="flex-1 bg-transparent text-text placeholder-text-muted/60 resize-none focus:outline-none text-sm sm:text-base leading-relaxed"
          rows={1}
          disabled={isLoading}
          aria-label="Search input"
        />

        {/* Send button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex-shrink-0 p-2.5 sm:p-3 rounded-lg transition-all duration-200 flex items-center justify-center min-h-10 min-w-10',
            input.trim() && !isLoading
              ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-md hover:shadow-lg'
              : 'bg-surface text-text-muted cursor-not-allowed opacity-50'
          )}
          aria-label={isLoading ? 'Searching for candidates' : 'Send search'}
          title={isLoading ? 'Searching...' : 'Send search'}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles size={18} />
            </motion.div>
          ) : (
            <Send size={18} />
          )}
        </motion.button>
      </div>

      {/* Helper text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-text-muted/50 mt-2 text-center hidden sm:block"
      >
        Press Shift+Enter for new line
      </motion.p>
    </motion.div>
  );
};

export default ChatInput;
