import { create } from 'zustand'
import { ChatMessage } from '../types/chat.types'

interface ChatStore {
  messages: ChatMessage[]
  conversationId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  setConversationId: (id: string) => void
  addUserMessage: (content: string) => void
  addAssistantMessage: (content: string) => void
  addMessages: (messages: ChatMessage[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearMessages: () => void
  clearConversation: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  conversationId: null,
  isLoading: false,
  error: null,

  setConversationId: (id: string) => set({ conversationId: id }),

  addUserMessage: (content: string) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  addAssistantMessage: (content: string) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  addMessages: (messages: ChatMessage[]) =>
    set((state) => ({
      messages: [...state.messages, ...messages],
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearMessages: () => set({ messages: [] }),

  clearConversation: () =>
    set({ messages: [], conversationId: null, error: null }),
}))
