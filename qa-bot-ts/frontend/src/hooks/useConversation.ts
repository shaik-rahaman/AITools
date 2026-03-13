import { useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { chatAPI } from '../lib/api/chat.api'
import { useChatStore } from '../stores/chat.store'
import { useSearchStore } from '../stores/search.store'

export const useConversation = () => {
  const { conversationId, setConversationId, addUserMessage, addAssistantMessage, setLoading, setError } = useChatStore()
  const { setResults } = useSearchStore()

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      addUserMessage(message)
      setLoading(true)
      try {
        const result = await chatAPI.sendMessage({
          message,
          conversationId: conversationId ?? undefined,
          topK: 10,
          includeHistory: true,
        })
        
        // Set conversation ID if it's new
        if (!conversationId) {
          setConversationId(result.conversationId)
        }
        
        return result
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
        setError(errorMsg)
        throw error
      } finally {
        setLoading(false)
      }
    },
    onSuccess: (result: any) => {
      addAssistantMessage(result.response)
      // Extract and set search results if available in response
      if (result.searchResults && Array.isArray(result.searchResults)) {
        setResults(
          result.searchResults.map((r: any) => ({
            id: r.id || `${r.email || 'unknown'}-${r.score ?? 0}-${r.fileName || r.name || ''}`,
            // Prefer explicit name, then backend fileName, then use email local part as fallback
            name: r.name || r.fileName || (r.email ? r.email.split('@')[0] : 'Unknown'),
            email: r.email || '',
            phoneNumber: r.phoneNumber || '',
            // content fallback: content, text, or join keyHighlights
            content: r.content || r.text || (r.extractedInfo?.keyHighlights ? r.extractedInfo.keyHighlights.join(' ') : ''),
            score: r.score || 0,
            matchType: r.matchType || 'hybrid',
            extractedInfo: r.extractedInfo,
            llmReasoning: r.llmReasoning,
          }))
        )
      }
    },
  })

  // Get conversation history query
  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => {
      if (!conversationId) return null
      return chatAPI.getHistory(conversationId)
    },
    enabled: !!conversationId,
  })

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => chatAPI.deleteConversation(id),
  })

  const deleteConversation = useCallback(async () => {
    if (conversationId) {
      await deleteConversationMutation.mutateAsync(conversationId)
      setConversationId('')
    }
  }, [conversationId, deleteConversationMutation, setConversationId])

  return {
    conversationId,
    sendMessage: (message: string) => sendMessageMutation.mutate(message),
    isLoading: sendMessageMutation.isPending || isLoadingHistory,
    history,
    deleteConversation,
  }
}
