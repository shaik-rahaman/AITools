import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSubmit: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export default function ChatInput({
  onSubmit,
  isLoading,
  placeholder = 'Search candidates or ask a question...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSubmit(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#374151] bg-[#111827] px-6 py-4">
      <div className="max-w-3xl mx-auto flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg bg-[#1F2937] border border-[#374151] text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="px-6 py-3 rounded-lg bg-[#2563EB] text-white font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
      <p className="text-xs text-[#6B7280] mt-2 max-w-3xl mx-auto">
        Press Enter or click Send. Ask anything about the candidates or use filters.
      </p>
    </form>
  )
}
