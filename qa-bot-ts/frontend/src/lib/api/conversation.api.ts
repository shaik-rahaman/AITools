import { apiClient } from '../../config/api.config'
import { HealthResponse } from '../../types/api.types'

export const conversationAPI = {
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get('/health')
    return response.data
  },
}
