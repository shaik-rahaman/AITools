export declare const useConversation: () => {
    conversationId: string | null;
    sendMessage: (message: string) => void;
    isLoading: boolean;
    history: import("../types/chat.types").ConversationHistoryResult | null | undefined;
    deleteConversation: () => Promise<void>;
};
//# sourceMappingURL=useConversation.d.ts.map