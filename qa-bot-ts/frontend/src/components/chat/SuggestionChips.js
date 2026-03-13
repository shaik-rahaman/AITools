import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export default function SuggestionChips({ suggestions, onSelect, isLoading = false, }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    };
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-3", children: [_jsx("p", { className: "text-sm text-[#9CA3AF]", children: "Try asking:" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: suggestions.map((suggestion, idx) => (_jsx(motion.button, { variants: itemVariants, onClick: () => onSelect(suggestion), disabled: isLoading, className: "p-4 rounded-lg bg-[#1F2937] border border-[#374151] text-left hover:border-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed group", children: _jsx("p", { className: "text-[#E5E7EB] text-sm font-medium group-hover:text-[#2563EB] transition-colors", children: suggestion }) }, idx))) })] }));
}
//# sourceMappingURL=SuggestionChips.js.map