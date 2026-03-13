import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
export default function ChatContainer({ messages, isLoading }) {
    const scrollRef = useRef(null);
    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);
    return (_jsx("div", { className: "flex-1 overflow-y-auto px-6 py-8", children: _jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [_jsx(AnimatePresence, { mode: "wait", children: messages.map((msg, idx) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: _jsx(ChatMessage, { message: msg }) }, `${idx}-${msg.timestamp}`))) }), isLoading && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 }, children: _jsx(LoadingSpinner, {}) })), _jsx("div", { ref: scrollRef })] }) }));
}
//# sourceMappingURL=ChatContainer.js.map