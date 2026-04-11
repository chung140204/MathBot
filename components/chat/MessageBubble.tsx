'use client';

import MathBlock from './MathBlock';
import StepList from './StepList';
import ResultBox from './ResultBox';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    math?: string;
    steps?: { id: number; content: string }[];
    result?: string;
  };
}

interface MessageBubbleProps {
  message: Message;
  initials?: string;
}

export default function MessageBubble({ message, initials = 'AI' }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 mb-8 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
        isUser ? 'bg-[#0891b2]' : 'bg-[#059669]'
      }`}>
        {isUser ? initials : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        {!isUser && (
          <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-none p-5 shadow-sm space-y-4">
            <p className="text-gray-700 leading-relaxed">{message.content}</p>
            
            {message.metadata?.math && (
              <MathBlock latex={message.metadata.math} />
            )}
            
            {message.metadata?.steps && (
              <StepList steps={message.metadata.steps} />
            )}
            
            {message.metadata?.result && (
              <ResultBox latex={message.metadata.result} />
            )}
            
            {/* Suggestions placeholder if text mentions "thử bài khó hơn" */}
            {message.content.includes('thử bài khó hơn') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {['Giải thích thêm', 'Bài khó hơn', 'Tóm tắt lý thuyết'].map(s => (
                  <button key={s} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#059669] hover:text-[#059669] transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isUser && (
          <div className="bg-[#0891b2] text-white rounded-3xl rounded-tr-none p-4 shadow-md inline-block">
            <p className="text-sm font-medium">{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
