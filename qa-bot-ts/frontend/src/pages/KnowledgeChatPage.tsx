import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import ChatContainer from '../components/chat/ChatContainer'
import ChatInput from '../components/chat/ChatInput'
import SuggestionChips from '../components/chat/SuggestionChips'
import { KnowledgeResultsList } from '../components/knowledge'
import { useChatStore } from '../stores/chat.store'
import { useSearchStore } from '../stores/search.store'
import { useUIStore } from '../stores/ui.store'
import { useConversation } from '../hooks/useConversation'
import { conversationAPI } from '../lib/api/conversation.api'
import { Candidate } from '../types/search.types'

const SUGGESTION_QUERIES = [
  'Find Python developers with ML experience',
  'Show React engineers with AWS knowledge',
  'DevOps engineers with Kubernetes expertise',
  'Senior Backend developers in San Francisco',
]

export default function KnowledgeChatPage() {
  const { messages, isLoading: storeLoading } = useChatStore()
  const { results: searchResults, isLoading: searchLoading } = useSearchStore()
  const { setSelectedCandidate, openDocumentModal } = useUIStore()
  const { sendMessage, isLoading: hookLoading } = useConversation()

  const isLoading = storeLoading || hookLoading || searchLoading

  // Debug logging
  useEffect(() => {
    console.log('Search Results:', searchResults)
  }, [searchResults])

  useEffect(() => {
    // Check backend health on mount
    conversationAPI.checkHealth().catch((err) => {
      console.error('Backend health check failed:', err)
    })
  }, [])


  const handleSendMessage = (message: string) => {
    sendMessage(message)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    openDocumentModal(candidate)
  }

  return (
    <div className="h-full flex flex-col bg-[#0B1220]">
      {/* Welcome Section or Chat Container */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            {/* Icon */}
            <div className="p-4 rounded-full bg-[#2563EB]/10 w-fit mb-6">
              <Sparkles className="w-8 h-8 text-[#2563EB]" />
            </div>

            {/* Title & Description */}
            <h1 className="text-4xl font-bold text-[#E5E7EB] mb-3">
              Resume Intelligence Platform
            </h1>
            <p className="text-[#9CA3AF] mb-12">
              Search candidates using AI-powered retrieval. Ask natural language
              questions to find the perfect candidates for your roles.
            </p>

            {/* Suggestion Chips */}
            <SuggestionChips
              suggestions={SUGGESTION_QUERIES}
              onSelect={handleSuggestionClick}
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer messages={messages} isLoading={isLoading} />

          {/* Search Results - shown after chat messages */}
          {searchResults.length > 0 && (
            <div className="px-6 pb-6 overflow-y-auto">
              <KnowledgeResultsList
                candidates={searchResults}
                isLoading={isLoading}
                onSelectCandidate={handleSelectCandidate}
              />
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSubmit={handleSendMessage}
        isLoading={isLoading}
        placeholder="Search candidates or ask a question..."
      />
    </div>
  )
}
