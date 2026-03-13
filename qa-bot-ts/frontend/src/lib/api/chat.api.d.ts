import { ConversationalQueryResult, ConversationHistoryResult } from '../../types/chat.types';
export interface ChatRequest {
    message: string;
    conversationId?: string;
    includeHistory?: boolean;
    topK?: number;
}
export declare const chatAPI: {
    sendMessage: (request: ChatRequest) => Promise<ConversationalQueryResult>;
    getHistory: (conversationId: string) => Promise<ConversationHistoryResult>;
    deleteConversation: (conversationId: string) => Promise<void>;
};
//# sourceMappingURL=chat.api.d.ts.map