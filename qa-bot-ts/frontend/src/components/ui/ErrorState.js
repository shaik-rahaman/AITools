import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from 'lucide-react';
export default function ErrorState({ message, retry }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx("div", { className: "p-3 rounded-full bg-[#EF4444]/10 mb-4", children: _jsx(AlertCircle, { className: "w-6 h-6 text-[#EF4444]" }) }), _jsx("p", { className: "text-[#E5E7EB] font-medium mb-2", children: "Error" }), _jsx("p", { className: "text-[#9CA3AF] text-sm text-center max-w-xs mb-4", children: message }), retry && (_jsx("button", { onClick: retry, className: "px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1d4ed8] transition-colors", children: "Try Again" }))] }));
}
//# sourceMappingURL=ErrorState.js.map