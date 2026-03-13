import { useState } from 'react'
import { useSearchStore } from '../../stores/search.store'
import { useChatStore } from '../../stores/chat.store'
import { SearchMode, SearchFilter } from '../../types/search.types'
import { Brain, ChevronDown, Trash2, Plus } from 'lucide-react'

export default function Sidebar() {
  const { searchMode, setSearchMode, filters, setFilters } = useSearchStore()
  const { conversationId } = useChatStore()
  const [expandedFilter, setExpandedFilter] = useState<string | null>('skills')

  const searchModes: { mode: SearchMode; label: string; description: string }[] = [
    { mode: 'vector', label: 'Vector Search', description: 'Semantic matching' },
    { mode: 'keyword', label: 'Keyword Search', description: 'Text search' },
    { mode: 'hybrid', label: 'Hybrid Search', description: 'Combined' },
  ]

  const roles = [
    { id: 'developer', label: 'Developer' },
    { id: 'qa_engineer', label: 'QA Engineer' },
    { id: 'devops_engineer', label: 'DevOps Engineer' },
  ]

  const handleUpdateFilter = (key: keyof SearchFilter, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <aside className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#2563EB]">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#E5E7EB]">Resume AI</h1>
            <p className="text-xs text-[#9CA3AF]">Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Role Selector */}
        <div className="p-6 border-b border-[#374151]">
          <h3 className="text-sm font-semibold text-[#E5E7EB] mb-3">Your Role</h3>
          <div className="space-y-2">
            {roles.map(({ id, label }) => (
              <button
                key={id}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  true
                    ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]'
                    : 'text-[#9CA3AF] hover:bg-[#374151]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#6B7280] mt-2">
            Role affects search recommendations
          </p>
        </div>

        {/* Search Modes */}
        <div className="p-6 border-b border-[#374151]">
          <h3 className="text-sm font-semibold text-[#E5E7EB] mb-3">Search Mode</h3>
          <div className="space-y-2">
            {searchModes.map(({ mode, label, description }) => (
              <button
                key={mode}
                onClick={() => setSearchMode(mode)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  searchMode === mode
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#9CA3AF] hover:bg-[#1F2937]'
                }`}
              >
                <p className="font-medium">{label}</p>
                <p className="text-xs opacity-75">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-[#374151]">
          <h3 className="text-sm font-semibold text-[#E5E7EB] mb-3">Filters</h3>
          <div className="space-y-2">
            <FilterItem
              title="Skills"
              placeholder="Python, React, ..."
              isExpanded={expandedFilter === 'skills'}
              onToggle={() =>
                setExpandedFilter(
                  expandedFilter === 'skills' ? null : 'skills'
                )
              }
              value={filters.skills?.join(', ') || ''}
              onChange={(val) =>
                handleUpdateFilter(
                  'skills',
                  val ? val.split(',').map((s) => s.trim()) : []
                )
              }
            />
            <FilterItem
              title="Experience"
              placeholder="5+ years"
              isExpanded={expandedFilter === 'experience'}
              onToggle={() =>
                setExpandedFilter(
                  expandedFilter === 'experience' ? null : 'experience'
                )
              }
              value={filters.experience || ''}
              onChange={(val) => handleUpdateFilter('experience', val)}
            />
            <FilterItem
              title="Location"
              placeholder="San Francisco, NYC..."
              isExpanded={expandedFilter === 'location'}
              onToggle={() =>
                setExpandedFilter(
                  expandedFilter === 'location' ? null : 'location'
                )
              }
              value={filters.location || ''}
              onChange={(val) => handleUpdateFilter('location', val)}
            />
            <FilterItem
              title="Company"
              placeholder="Google, Meta..."
              isExpanded={expandedFilter === 'company'}
              onToggle={() =>
                setExpandedFilter(
                  expandedFilter === 'company' ? null : 'company'
                )
              }
              value={filters.currentCompany || ''}
              onChange={(val) => handleUpdateFilter('currentCompany', val)}
            />
          </div>
        </div>

        {/* Conversation History */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#E5E7EB]">History</h3>
            <button className="p-1 rounded hover:bg-[#374151] transition-colors">
              <Plus className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <ConversationItem
              title="Python ML Engineers"
              timestamp="2 hours ago"
              isActive={conversationId === 'conv_1'}
            />
            <ConversationItem
              title="React Developers"
              timestamp="1 day ago"
              isActive={conversationId === 'conv_2'}
            />
            <ConversationItem
              title="DevOps with K8s"
              timestamp="3 days ago"
              isActive={conversationId === 'conv_3'}
            />
          </div>
          <p className="text-xs text-[#6B7280] mt-3">
            No active conversations yet
          </p>
        </div>
      </div>
    </aside>
  )
}


function FilterItem({
  title,
  placeholder,
  isExpanded,
  onToggle,
  value,
  onChange,
}: FilterItemProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#374151] transition-colors group"
      >
        <label className="text-xs font-medium text-[#9CA3AF] cursor-pointer">
          {title}
        </label>
        <ChevronDown
          className={`w-4 h-4 text-[#6B7280] transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && (
        <div className="px-3 py-2">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-[#E5E7EB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      )}
    </div>
  )
}

interface ConversationItemProps {
  title: string
  timestamp: string
  isActive: boolean
}

function ConversationItem({
  title,
  timestamp,
  isActive,
}: ConversationItemProps) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all group ${
        isActive
          ? 'bg-[#2563EB]/20 border border-[#2563EB]'
          : 'bg-[#1F2937] hover:bg-[#374151] border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isActive ? 'text-[#2563EB]' : 'text-[#E5E7EB]'
            }`}
          >
            {title}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">{timestamp}</p>
        </div>
        <button
          className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#EF4444]/20"
          title="Delete conversation"
        >
          <Trash2 className="w-3 h-3 text-[#EF4444]" />
        </button>
      </div>
    </div>
  )
}

interface FilterItemProps {
  title: string
  placeholder: string
  isExpanded: boolean
  onToggle: () => void
  value: string
  onChange: (value: string) => void
}
