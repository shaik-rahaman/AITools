import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message: string
  retry?: () => void
}

export default function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-3 rounded-full bg-[#EF4444]/10 mb-4">
        <AlertCircle className="w-6 h-6 text-[#EF4444]" />
      </div>
      <p className="text-[#E5E7EB] font-medium mb-2">Error</p>
      <p className="text-[#9CA3AF] text-sm text-center max-w-xs mb-4">
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
