import { useUIStore } from '../../stores/ui.store'
import { Menu, X } from 'lucide-react'

export default function TopNavbar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <nav className="bg-[#111827] border-b border-[#374151] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded hover:bg-[#1F2937] transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-[#E5E7EB]" />
          ) : (
            <Menu className="w-5 h-5 text-[#E5E7EB]" />
          )}
        </button>

        {/* Title */}
        <h1 className="text-lg font-semibold text-[#E5E7EB]">
          Resume Intelligence
        </h1>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-[#9CA3AF]">LLM Provider</p>
            <p className="text-sm font-medium text-[#E5E7EB]">Groq</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
