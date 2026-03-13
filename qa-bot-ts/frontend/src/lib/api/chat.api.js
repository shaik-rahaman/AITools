import { apiClient } from '../../config/api.config';
export const chatAPI = {
    sendMessage: async (request) => {
        const response = await apiClient.post('/chat', request);
        return response.data;
    },
    getHistory: async (conversationId) => {
        const response = await apiClient.post('/chat/history', { conversationId });
        return response.data;
    },
    deleteConversation: async (conversationId) => {
        await apiClient.delete(`/chat/${conversationId}`);
    },
};
//# sourceMappingURL=chat.api.js.map