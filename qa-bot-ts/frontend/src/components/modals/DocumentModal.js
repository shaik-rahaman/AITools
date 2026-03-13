import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X, Download, Pin, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
export default function DocumentModal({ isOpen, candidate, onClose }) {
    const [contentRef, setContentRef] = useState(null);
    if (!isOpen || !candidate)
        return null;
    const scrollToTop = () => {
        contentRef?.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const scrollToBottom = () => {
        contentRef?.scrollTo({
            top: contentRef.scrollHeight,
            behavior: 'smooth',
        });
    };
    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([candidate.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${candidate.name.replace(/\s+/g, '_')}_resume.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=900,height=800');
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
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/50 z-40 lg:hidden", onClick: onClose }), _jsxs("div", { className: "fixed inset-0 lg:inset-auto lg:right-0 lg:bottom-0 lg:w-1/3 lg:h-screen z-50 bg-[#111827] flex flex-col lg:rounded-l-lg lg:shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between p-4 lg:p-6 border-b border-[#374151]", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-lg lg:text-xl font-bold text-[#E5E7EB] truncate", children: candidate.name }), _jsx("p", { className: "text-xs lg:text-sm text-[#9CA3AF] mt-1", children: candidate.email })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsx("button", { onClick: handleDownload, className: "p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors", title: "Download resume", children: _jsx(Download, { className: "w-5 h-5" }) }), _jsx("button", { onClick: handlePrint, className: "p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors hidden lg:block", title: "Print resume", children: _jsx(Pin, { className: "w-5 h-5" }) }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors", title: "Close", children: _jsx(X, { className: "w-5 h-5" }) })] })] }), candidate.extractedInfo && (_jsx("div", { className: "px-4 lg:px-6 py-4 border-b border-[#374151] bg-[#0B1220]", children: _jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [candidate.extractedInfo.currentCompany && (_jsxs("div", { children: [_jsx("p", { className: "text-[#9CA3AF] font-medium", children: "Company" }), _jsx("p", { className: "text-[#E5E7EB]", children: candidate.extractedInfo.currentCompany })] })), candidate.extractedInfo.experience && (_jsxs("div", { children: [_jsx("p", { className: "text-[#9CA3AF] font-medium", children: "Experience" }), _jsx("p", { className: "text-[#E5E7EB]", children: candidate.extractedInfo.experience })] })), candidate.extractedInfo.location && (_jsxs("div", { children: [_jsx("p", { className: "text-[#9CA3AF] font-medium", children: "Location" }), _jsx("p", { className: "text-[#E5E7EB]", children: candidate.extractedInfo.location })] })), candidate.extractedInfo.skills && candidate.extractedInfo.skills.length > 0 && (_jsxs("div", { children: [_jsxs("p", { className: "text-[#9CA3AF] font-medium", children: ["Skills (", candidate.extractedInfo.skills.length, ")"] }), _jsxs("p", { className: "text-[#E5E7EB]", children: [candidate.extractedInfo.skills.slice(0, 2).join(', '), candidate.extractedInfo.skills.length > 2 ? '...' : ''] })] }))] }) })), _jsx("div", { ref: setContentRef, className: "flex-1 overflow-y-auto px-4 lg:px-6 py-4", children: _jsx("div", { className: "prose prose-invert max-w-none", children: _jsx("div", { className: "whitespace-pre-wrap text-sm text-[#E5E7EB] leading-relaxed", children: candidate.content }) }) }), _jsxs("div", { className: "flex items-center justify-between p-4 lg:p-6 border-t border-[#374151] bg-[#0B1220]", children: [_jsx("div", { className: "text-xs text-[#9CA3AF]", children: "Scroll to explore full resume" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: scrollToTop, className: "p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors", title: "Scroll to top", children: _jsx(ChevronUp, { className: "w-4 h-4" }) }), _jsx("button", { onClick: scrollToBottom, className: "p-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#2563EB] transition-colors", title: "Scroll to bottom", children: _jsx(ChevronDown, { className: "w-4 h-4" }) })] })] })] })] }));
}
//# sourceMappingURL=DocumentModal.js.map