import { motion } from 'framer-motion'
import { Candidate } from '../../types/search.types'
import KnowledgeCard from './KnowledgeCard'
import LoadingSpinner from '../ui/LoadingSpinner'

interface KnowledgeResultsListProps {
  candidates: Candidate[]
  isLoading?: boolean
  onSelectCandidate?: (candidate: Candidate) => void
}

export default function KnowledgeResultsList({
  candidates,
  isLoading = false,
  onSelectCandidate,
}: KnowledgeResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#9CA3AF] text-sm">
          No candidates found matching your search criteria.
        </p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {candidates.map((candidate, index) => (
        <motion.div key={candidate.id || index} variants={itemVariants}>
          <KnowledgeCard
            candidate={candidate}
            rank={index + 1}
            onSelect={onSelectCandidate}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
