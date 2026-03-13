import { create } from 'zustand';
export const useChatStore = create((set) => ({
    messages: [],
    conversationId: null,
    isLoading: false,
    error: null,
    setConversationId: (id) => set({ conversationId: id }),
    addUserMessage: (content) => set((state) => ({
        messages: [
            ...state.messages,
            {
                role: 'user',
                content,
                timestamp: new Date().toISOString(),
            },
        ],
    })),
    addAssistantMessage: (content) => set((state) => ({
        messages: [
            ...state.messages,
            {
                role: 'assistant',
                content,
                timestamp: new Date().toISOString(),
            },
        ],
    })),
    addMessages: (messages) => set((state) => ({
        messages: [...state.messages, ...messages],
    })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearMessages: () => set({ messages: [] }),
    clearConversation: () => set({ messages: [], conversationId: null, error: null }),
}));
//# sourceMappingURL=chat.store.js.map