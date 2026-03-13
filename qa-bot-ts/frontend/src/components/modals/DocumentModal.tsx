import { X, Download, Pin, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Candidate } from '../../types/search.types'

interface DocumentModalProps {
  isOpen: boolean
  candidate: Candidate | null
  onClose: () => void
}

export default function DocumentModal({ isOpen, candidate, onClose }: DocumentModalProps) {
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null)

  if (!isOpen || !candidate) return null

  const scrollToTop = () => {
    contentRef?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    contentRef?.scrollTo({
      top: contentRef.scrollHeight,
      behavior: 'smooth',
    })
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([candidate.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${candidate.name.replace(/\s+/g, '_')}_resume.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=900,height=800')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${candidate.name} - Resume</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { font-size: 24px; margin-bottom: 10px; }
              h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #2563EB; padding-bottom: 5px; }
              p { margin: 8px 0; }
              .contact { color: #666; font-size: 14px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${candidate.name}</h1>
            <div class="contact">
              ${candidate.email} | ${candidate.phoneNumber}
              ${candidate.extractedInfo?.location ? ` | ${candidate.extractedInfo.location}` : ''}
            </div>
            <div>${candidate.content.split('\n').join('<br>')}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 lg:inset-auto lg:right-0 lg:bottom-0 lg:w-1/3 lg:h-screen z-50 bg-[#111827] flex flex-col lg:rounded-l-lg lg:shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-[#374151]">
          <div className="flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-[#E5E7EB] truncate">
              {candidate.name}
            </h2>
            <p className="text-xs lg:text-sm text-[#9CA3AF] mt-1">{candidate.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors"
              title="Download resume"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors hidden lg:block"
              title="Print resume"
            >
              <Pin className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Candidate Info Summary */}
        {candidate.extractedInfo && (
          <div className="px-4 lg:px-6 py-4 border-b border-[#374151] bg-[#0B1220]">
            <div className="grid grid-cols-2 gap-4 text-xs">
              {candidate.extractedInfo.currentCompany && (
                <div>
                  <p className="text-[#9CA3AF] font-medium">Company</p>
                  <p className="text-[#E5E7EB]">
                    {candidate.extractedInfo.currentCompany}
                  </p>
                </div>
              )}
              {candidate.extractedInfo.experience && (
                <div>
                  <p className="text-[#9CA3AF] font-medium">Experience</p>
                  <p className="text-[#E5E7EB]">{candidate.extractedInfo.experience}</p>
                </div>
              )}
              {candidate.extractedInfo.location && (
                <div>
                  <p className="text-[#9CA3AF] font-medium">Location</p>
                  <p className="text-[#E5E7EB]">
                    {candidate.extractedInfo.location}
                  </p>
                </div>
              )}
              {candidate.extractedInfo.skills && candidate.extractedInfo.skills.length > 0 && (
                <div>
                  <p className="text-[#9CA3AF] font-medium">
                    Skills ({candidate.extractedInfo.skills.length})
                  </p>
                  <p className="text-[#E5E7EB]">
                    {candidate.extractedInfo.skills.slice(0, 2).join(', ')}
                    {candidate.extractedInfo.skills.length > 2 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div
          ref={setContentRef}
          className="flex-1 overflow-y-auto px-4 lg:px-6 py-4"
        >
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm text-[#E5E7EB] leading-relaxed">
              {candidate.content}
            </div>
          </div>
        </div>

        {/* Footer with Scroll Controls */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-t border-[#374151] bg-[#0B1220]">
          <div className="text-xs text-[#9CA3AF]">
            Scroll to explore full resume
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors"
              title="Scroll to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToBottom}
              className="p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors"
              title="Scroll to bottom"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
