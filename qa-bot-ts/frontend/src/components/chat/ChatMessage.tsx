import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChatMessage as ChatMessageType } from '../../types/chat.types'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-[#2563EB] text-white rounded-br-none'
            : 'bg-[#1F2937] text-[#E5E7EB] border border-[#374151] rounded-bl-none'
        }`}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={prism}
                      language={match[1]}
                      PreTag="div"
                      className="my-2 rounded"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-[#111827] px-2 py-1 rounded text-[#A78BFA]"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-2" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-[#F59E0B]" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
