import { apiClient } from '../../config/api.config'
import { ConversationalQueryResult, ConversationHistoryResult } from '../../types/chat.types'

export interface ChatRequest {
  message: string
  conversationId?: string
  includeHistory?: boolean
  topK?: number
}

export const chatAPI = {
  sendMessage: async (request: ChatRequest): Promise<ConversationalQueryResult> => {
    const response = await apiClient.post('/chat', request)
    return response.data
  },

  getHistory: async (conversationId: string): Promise<ConversationHistoryResult> => {
    const response = await apiClient.post('/chat/history', { conversationId })
    return response.data
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/chat/${conversationId}`)
  },
}
