import { MessageCircle } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export default function EmptyState({
  title = 'No results yet',
  description = 'Start by searching for candidates or ask a question',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-3 rounded-full bg-[#2563EB]/10 mb-4">
        <MessageCircle className="w-6 h-6 text-[#2563EB]" />
      </div>
      <p className="text-[#E5E7EB] font-medium mb-2">{title}</p>
      <p className="text-[#9CA3AF] text-sm text-center max-w-xs">
        {description}
      </p>
    </div>
  )
}
