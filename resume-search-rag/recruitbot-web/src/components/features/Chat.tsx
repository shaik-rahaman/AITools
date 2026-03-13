import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/stores/chat.store';
import { useSearchStore } from '@/lib/stores/search.store';
import { ChatMessage } from '../common/ChatMessage';
import { ChatInput } from '../common/ChatInput';
import { ChatEmptyState } from '../common/ChatEmptyState';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { SuggestionChips } from '../common/SuggestionChips';
import { searchService } from '@/lib/api/search';

/**
 * Main chat interface component
 * Manages message display, input, and auto-scroll
 */
export const Chat: FC = () => {
  const {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    searchMode,
    enableRerank,
    enableSummarize,
  } = useChatStore();

  const { setResults, setCurrentPage } = useSearchStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(messages.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
    {
      icon: '🔍',
      label: 'Python Developers',
      query: 'Find Python developers with 3+ years experience',
    },
    {
      icon: '💼',
      label: 'Finance Roles',
      query: 'Show me candidates with finance experience',
    },
    {
      icon: '🎓',
      label: 'MBA Graduates',
      query: 'MBA graduates in tech',
    },
    {
      icon: '🚀',
      label: 'Startups',
      query: 'Experienced startup founders or early employees',
    },
  ];

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    addMessage('user', message);
    setShowSuggestions(false);
    setIsLoading(true);
    setError(null);
    setCurrentPage(1); // Reset to first page on new search

    try {
      // Call backend search API
      const results = await searchService.search(message, {
        searchType: searchMode,
        topK: 20,
      });

      // Update search results store
      setResults(results);

      // Add assistant response with result count
      addMessage(
        'assistant',
        `Found ${results.length} candidates matching "${message}" using ${searchMode} search${
          enableRerank ? ' (with reranking)' : ''
        }${enableSummarize ? ' (with AI summarization)' : ''}.`,
        results.length
      );

      setIsLoading(false);
    } catch (err: any) {
      console.error('Search error:', err);
      const errorMsg =
        err?.response?.data?.error?.message ||
        err?.message ||
        'Failed to search. Please try again.';
      setError(errorMsg);
      addMessage('assistant', `Error: ${errorMsg}`);
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (query: string) => {
    handleSubmit(query);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-base via-base to-surface/30 overflow-hidden">
      {/* Messages Container */}
      <motion.div
        className="flex-1 overflow-y-auto px-4 pt-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <ChatEmptyState />
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              {/* Chat messages */}
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  type={msg.type}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  resultCount={msg.resultCount}
                />
              ))}

              {/* Error state */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Loading state */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-3 mb-4"
                >
                  <div className="bg-surface border border-border rounded-xl rounded-bl-none">
                    <LoadingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestion Chips */}
      <AnimatePresence>
        {showSuggestions && messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-4 border-t border-border"
          >
            <SuggestionChips
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
