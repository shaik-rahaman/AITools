import { Candidate } from '../../types/search.types'
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import ResultScoreBadge from './ResultScoreBadge'

interface KnowledgeCardProps {
  candidate: Candidate
  rank: number
  onSelect?: (candidate: Candidate) => void
}

export default function KnowledgeCard({
  candidate,
  rank,
  onSelect,
}: KnowledgeCardProps) {
  const extractedInfo = candidate.extractedInfo

  return (
    <div
      onClick={() => onSelect?.(candidate)}
      className="p-6 rounded-lg bg-[#1F2937] border border-[#374151] hover:border-[#2563EB] hover:bg-[#263249] transition-all cursor-pointer group"
    >
      {/* Header with Rank and Score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-bold text-sm">
            #{rank}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#E5E7EB] group-hover:text-[#2563EB] transition-colors">
              {candidate.name}
            </h3>
            {extractedInfo?.currentCompany && (
              <p className="text-sm text-[#9CA3AF] mt-1">
                {extractedInfo.currentCompany}
              </p>
            )}
          </div>
        </div>
        <ResultScoreBadge score={candidate.score} matchType={candidate.matchType} />
      </div>

      {/* Contact & Location Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Mail className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
          <Phone className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
          <span>{candidate.phoneNumber}</span>
        </div>
        {extractedInfo?.location && (
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <MapPin className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
            <span>{extractedInfo.location}</span>
          </div>
        )}
        {extractedInfo?.experience && (
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Briefcase className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
            <span>{extractedInfo.experience}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {extractedInfo?.skills && extractedInfo.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#9CA3AF] mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {extractedInfo.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md bg-[#2563EB]/20 text-[#2563EB] text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {extractedInfo.skills.length > 4 && (
              <span className="px-2 py-1 text-xs text-[#9CA3AF]">
                +{extractedInfo.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content Preview */}
      <div className="mb-4 p-3 rounded-lg bg-[#111827] border border-[#374151]">
        <p className="text-xs text-[#9CA3AF] line-clamp-3">
          {candidate.content}
        </p>
      </div>

      {/* Key Highlights */}
      {extractedInfo?.keyHighlights && extractedInfo.keyHighlights.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#9CA3AF] mb-2">Highlights</p>
          <ul className="space-y-1">
            {extractedInfo.keyHighlights.slice(0, 2).map((highlight, idx) => (
              <li key={idx} className="text-xs text-[#9CA3AF] flex items-start gap-2">
                <span className="text-[#2563EB] mt-1">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* LLM Reasoning (if available) */}
      {candidate.llmReasoning && (
        <div className="p-3 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/30">
          <p className="text-xs text-[#2563EB]">
            <span className="font-semibold">AI Analysis:</span> {candidate.llmReasoning}
          </p>
        </div>
      )}

      {/* Click to View Full Resume */}
      <div className="mt-4 pt-4 border-t border-[#374151] text-center">
        <p className="text-xs text-[#2563EB] font-medium group-hover:underline">
          Click to view full resume →
        </p>
      </div>
    </div>
  )
}
