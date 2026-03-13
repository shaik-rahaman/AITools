import { apiClient } from '../../config/api.config'
import { SearchRequest, SearchResponse } from '../../types/api.types'

export const searchAPI = {
  search: async (request: SearchRequest): Promise<SearchResponse> => {
    const response = await apiClient.post('/search/resumes', request)
    return response.data
  },
}
