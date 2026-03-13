import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage as ChatMessageType } from '../../types/chat.types'
import ChatMessage from './ChatMessage'
import LoadingSpinner from '../ui/LoadingSpinner'

interface ChatContainerProps {
  messages: ChatMessageType[]
  isLoading: boolean
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {messages.map((msg, idx) => (
            <motion.div
              key={`${idx}-${msg.timestamp}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>
    </div>
  )
}
