import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import SuggestionChips from '../components/chat/SuggestionChips';
import { KnowledgeResultsList } from '../components/knowledge';
import { useChatStore } from '../stores/chat.store';
import { useSearchStore } from '../stores/search.store';
import { useUIStore } from '../stores/ui.store';
import { useConversation } from '../hooks/useConversation';
import { conversationAPI } from '../lib/api/conversation.api';
const SUGGESTION_QUERIES = [
    'Find Python developers with ML experience',
    'Show React engineers with AWS knowledge',
    'DevOps engineers with Kubernetes expertise',
    'Senior Backend developers in San Francisco',
];
export default function KnowledgeChatPage() {
    const { messages, isLoading: storeLoading } = useChatStore();
    const { results: searchResults, isLoading: searchLoading } = useSearchStore();
    const { setSelectedCandidate, openDocumentModal } = useUIStore();
    const { sendMessage, isLoading: hookLoading } = useConversation();
    const isLoading = storeLoading || hookLoading || searchLoading;
    // Debug logging
    useEffect(() => {
        console.log('Search Results:', searchResults);
    }, [searchResults]);
    useEffect(() => {
        // Check backend health on mount
        conversationAPI.checkHealth().catch((err) => {
            console.error('Backend health check failed:', err);
        });
    }, []);
    const handleSendMessage = (message) => {
        sendMessage(message);
    };
    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion);
    };
    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        openDocumentModal(candidate);
    };
    return (_jsxs("div", { className: "h-full flex flex-col bg-[#0B1220]", children: [messages.length === 0 ? (_jsx("div", { className: "flex-1 flex flex-col items-center justify-center px-6", children: _jsxs("div", { className: "max-w-2xl w-full", children: [_jsx("div", { className: "p-4 rounded-full bg-[#2563EB]/10 w-fit mb-6", children: _jsx(Sparkles, { className: "w-8 h-8 text-[#2563EB]" }) }), _jsx("h1", { className: "text-4xl font-bold text-[#E5E7EB] mb-3", children: "Resume Intelligence Platform" }), _jsx("p", { className: "text-[#9CA3AF] mb-12", children: "Search candidates using AI-powered retrieval. Ask natural language questions to find the perfect candidates for your roles." }), _jsx(SuggestionChips, { suggestions: SUGGESTION_QUERIES, onSelect: handleSuggestionClick, isLoading: isLoading })] }) })) : (_jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(ChatContainer, { messages: messages, isLoading: isLoading }), searchResults.length > 0 && (_jsx("div", { className: "px-6 pb-6 overflow-y-auto", children: _jsx(KnowledgeResultsList, { candidates: searchResults, isLoading: isLoading, onSelectCandidate: handleSelectCandidate }) }))] })), _jsx(ChatInput, { onSubmit: handleSendMessage, isLoading: isLoading, placeholder: "Search candidates or ask a question..." })] }));
}
//# sourceMappingURL=KnowledgeChatPage.js.map