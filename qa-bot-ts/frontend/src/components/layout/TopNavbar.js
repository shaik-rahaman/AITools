import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUIStore } from '../../stores/ui.store';
import { Menu, X } from 'lucide-react';
export default function TopNavbar() {
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    return (_jsx("nav", { className: "bg-[#111827] border-b border-[#374151] px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "lg:hidden p-2 rounded hover:bg-[#1F2937] transition-colors", children: sidebarOpen ? (_jsx(X, { className: "w-5 h-5 text-[#E5E7EB]" })) : (_jsx(Menu, { className: "w-5 h-5 text-[#E5E7EB]" })) }), _jsx("h1", { className: "text-lg font-semibold text-[#E5E7EB]", children: "Resume Intelligence" }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-[#9CA3AF]", children: "LLM Provider" }), _jsx("p", { className: "text-sm font-medium text-[#E5E7EB]", children: "Groq" })] }) })] }) }));
}
//# sourceMappingURL=TopNavbar.js.map