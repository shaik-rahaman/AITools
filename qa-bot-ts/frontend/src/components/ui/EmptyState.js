import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageCircle } from 'lucide-react';
export default function EmptyState({ title = 'No results yet', description = 'Start by searching for candidates or ask a question', }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx("div", { className: "p-3 rounded-full bg-[#2563EB]/10 mb-4", children: _jsx(MessageCircle, { className: "w-6 h-6 text-[#2563EB]" }) }), _jsx("p", { className: "text-[#E5E7EB] font-medium mb-2", children: title }), _jsx("p", { className: "text-[#9CA3AF] text-sm text-center max-w-xs", children: description })] }));
}
//# sourceMappingURL=EmptyState.js.map