import { ChatMessage } from '../types/chat.types';
interface ChatStore {
    messages: ChatMessage[];
    conversationId: string | null;
    isLoading: boolean;
    error: string | null;
    setConversationId: (id: string) => void;
    addUserMessage: (content: string) => void;
    addAssistantMessage: (content: string) => void;
    addMessages: (messages: ChatMessage[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearMessages: () => void;
    clearConversation: () => void;
}
export declare const useChatStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ChatStore>>;
export {};
//# sourceMappingURL=chat.store.d.ts.map