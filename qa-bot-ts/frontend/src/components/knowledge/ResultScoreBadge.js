import { jsxs as _jsxs } from "react/jsx-runtime";
export default function ResultScoreBadge({ score, matchType }) {
    // Normalize score to 0-100 percentage
    const percentage = Math.round(score * 100);
    // Determine color based on score
    const getColorClass = () => {
        if (percentage >= 90)
            return 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]';
        if (percentage >= 75)
            return 'bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]';
        if (percentage >= 60)
            return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]';
        return 'bg-[#9CA3AF]/20 text-[#9CA3AF] border-[#9CA3AF]';
    };
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: `px-3 py-1 rounded-full text-xs font-semibold border ${getColorClass()}`, children: [percentage, "%"] }), matchType && (_jsxs("span", { className: "text-xs text-[#9CA3AF] capitalize", children: [matchType, " match"] }))] }));
}
//# sourceMappingURL=ResultScoreBadge.js.map