import { motion } from 'framer-motion'

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  isLoading?: boolean
}

export default function SuggestionChips({
  suggestions,
  onSelect,
  isLoading = false,
}: SuggestionChipsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <p className="text-sm text-[#9CA3AF]">Try asking:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, idx) => (
          <motion.button
            key={idx}
            variants={itemVariants}
            onClick={() => onSelect(suggestion)}
            disabled={isLoading}
            className="p-4 rounded-lg bg-[#1F2937] border border-[#374151] text-left hover:border-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <p className="text-[#E5E7EB] text-sm font-medium group-hover:text-[#2563EB] transition-colors">
              {suggestion}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
