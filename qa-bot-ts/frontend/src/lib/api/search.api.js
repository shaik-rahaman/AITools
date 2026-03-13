import { apiClient } from '../../config/api.config';
export const searchAPI = {
    search: async (request) => {
        const response = await apiClient.post('/search/resumes', request);
        return response.data;
    },
};
//# sourceMappingURL=search.api.js.map