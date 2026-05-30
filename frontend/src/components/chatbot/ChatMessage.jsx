import ReactMarkdown from 'react-markdown';
import { FiUser } from 'react-icons/fi';

export default function ChatMessage({ message }) {
  const isAi = message.role === 'ai';

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 ${isAi ? 'bg-gradient-to-br from-blue-500 to-teal-400 text-white mr-2' : 'bg-slate-200 text-slate-600 ml-2'}`}>
          {isAi ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8"></path>
              <rect x="4" y="8" width="16" height="12" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          ) : (
            <FiUser size={16} />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div 
            className={`p-3.5 shadow-sm text-sm ${
              isAi 
                ? 'bg-white border border-slate-100 rounded-2xl rounded-tl-sm text-slate-700' 
                : 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
            }`}
          >
            {isAi ? (
              <div className="text-sm space-y-2 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h3]:font-bold [&>h3]:mt-3 [&>h3]:mb-1 [&>strong]:font-semibold">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
          <span className={`text-[10px] text-slate-400 mt-1 ${isAi ? 'text-left ml-1' : 'text-right mr-1'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
