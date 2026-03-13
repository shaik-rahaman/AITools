import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import KnowledgeCard from './KnowledgeCard';
import LoadingSpinner from '../ui/LoadingSpinner';
export default function KnowledgeResultsList({ candidates, isLoading = false, onSelectCandidate, }) {
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsx(LoadingSpinner, {}) }));
    }
    if (candidates.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-[#9CA3AF] text-sm", children: "No candidates found matching your search criteria." }) }));
    }
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10,
            },
        },
    };
    return (_jsx(motion.div, { className: "grid grid-cols-1 gap-4 mt-6", variants: containerVariants, initial: "hidden", animate: "visible", children: candidates.map((candidate, index) => (_jsx(motion.div, { variants: itemVariants, children: _jsx(KnowledgeCard, { candidate: candidate, rank: index + 1, onSelect: onSelectCandidate }) }, candidate.id || index))) }));
}
//# sourceMappingURL=KnowledgeResultsList.js.map