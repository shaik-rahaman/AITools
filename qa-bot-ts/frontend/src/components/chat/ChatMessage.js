import { jsx as _jsx } from "react/jsx-runtime";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
export default function ChatMessage({ message }) {
    const isUser = message.role === 'user';
    return (_jsx("div", { className: `flex ${isUser ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${isUser
                ? 'bg-[#2563EB] text-white rounded-br-none'
                : 'bg-[#1F2937] text-[#E5E7EB] border border-[#374151] rounded-bl-none'}`, children: isUser ? (_jsx("p", { className: "text-sm", children: message.content })) : (_jsx("div", { className: "text-sm prose prose-invert max-w-none", children: _jsx(ReactMarkdown, { components: {
                        p: ({ node, ...props }) => _jsx("p", { className: "mb-2", ...props }),
                        code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (_jsx(SyntaxHighlighter, { style: prism, language: match[1], PreTag: "div", className: "my-2 rounded", ...props, children: String(children).replace(/\n$/, '') })) : (_jsx("code", { className: "bg-[#111827] px-2 py-1 rounded text-[#A78BFA]", ...props, children: children }));
                        },
                        ol: ({ node, ...props }) => (_jsx("ol", { className: "list-decimal list-inside mb-2", ...props })),
                        ul: ({ node, ...props }) => (_jsx("ul", { className: "list-disc list-inside mb-2", ...props })),
                        strong: ({ node, ...props }) => (_jsx("strong", { className: "font-semibold text-[#F59E0B]", ...props })),
                    }, children: message.content }) })) }) }));
}
//# sourceMappingURL=ChatMessage.js.map