import { apiClient } from '../../config/api.config';
export const conversationAPI = {
    checkHealth: async () => {
        const response = await apiClient.get('/health');
        return response.data;
    },
};
//# sourceMappingURL=conversation.api.js.map