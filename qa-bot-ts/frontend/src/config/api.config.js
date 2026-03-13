import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';
class APIClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add response interceptor for error handling
        this.client.interceptors.response.use((response) => response, (error) => {
            console.error('API Error:', error.message);
            return Promise.reject(error);
        });
    }
    getClient() {
        return this.client;
    }
    getBaseURL() {
        return API_BASE_URL;
    }
}
export const apiClient = new APIClient().getClient();
export const API_URL = new APIClient().getBaseURL();
//# sourceMappingURL=api.config.js.map