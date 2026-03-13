import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_TOP_K } from '@/config/constants';

export type SearchMode = 'vector' | 'bm25' | 'hybrid';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  resultCount?: number;
}

interface ChatStoreState {
  // Messages
  messages: ChatMessage[];
  addMessage: (type: 'user' | 'assistant', content: string, resultCount?: number) => void;
  clearMessages: () => void;

  // Search params
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  topK: number;
  setTopK: (k: number) => void;

  // Hybrid search settings
  vectorWeight: number;
  setVectorWeight: (w: number) => void;

  // Options
  enableRerank: boolean;
  setEnableRerank: (enabled: boolean) => void;
  enableSummarize: boolean;
  setEnableSummarize: (enabled: boolean) => void;

  // State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStoreState>()(
  devtools(
    (set) => ({
      // Messages
      messages: [],
      addMessage: (type, content, resultCount) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              type,
              content,
              timestamp: new Date(),
              resultCount,
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),

      // Search params
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchMode: 'hybrid' as SearchMode,
      setSearchMode: (mode) => set({ searchMode: mode }),
      topK: DEFAULT_TOP_K,
      setTopK: (k) => set({ topK: k }),

      // Hybrid weights
      vectorWeight: 0.5,
      setVectorWeight: (w) => set({ vectorWeight: w }),

      // Options
      enableRerank: true,
      setEnableRerank: (enabled) => set({ enableRerank: enabled }),
      enableSummarize: true,
      setEnableSummarize: (enabled) => set({ enableSummarize: enabled }),

      // State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
    }),
    { name: 'ChatStore' }
  )
);
