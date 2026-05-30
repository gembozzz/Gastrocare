import { FiX, FiSend } from 'react-icons/fi';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import { useLanguage } from '../../lib/languageContext';

export default function ChatPopup({ 
  closeChat, 
  messages, 
  inputValue, 
  handleInputChange, 
  handleKeyDown, 
  sendMessage, 
  isTyping, 
  messagesEndRef,
  handleSuggestedQuestionClick 
}) {
  const { language } = useLanguage();

  const translations = {
    en: {
      subtitle: "Ask anything about GERD & digestive health",
      placeholder: "Describe your symptoms...",
      disclaimer: "This AI assistant is for educational purposes only and is not a substitute for professional medical advice."
    },
    id: {
      subtitle: "Tanyakan apa saja tentang GERD & pencernaan",
      placeholder: "Jelaskan gejala Anda...",
      disclaimer: "Asisten AI ini hanya untuk tujuan edukasi dan bukan pengganti saran medis profesional."
    }
  };

  const t = translations[language] || translations.id;

  return (
    <div className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-32px)] md:w-[380px] h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8"></path>
                <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                <path d="M2 14h2"></path>
                <path d="M20 14h2"></path>
                <path d="M15 13v2"></path>
                <path d="M9 13v2"></path>
              </svg>
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">GastroCare AI</h3>
            <p className="text-[11px] text-blue-100 opacity-90">{t.subtitle}</p>
          </div>
        </div>
        <button 
          onClick={closeChat}
          className="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
          aria-label="Close chat"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 scroll-smooth">
        <div className="flex flex-col">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex w-full justify-start mb-4 animate-in fade-in duration-300">
               <div className="flex max-w-[85%] flex-row">
                 <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 bg-gradient-to-br from-blue-500 to-teal-400 text-white mr-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8V4H8"></path>
                      <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                      <path d="M2 14h2"></path>
                      <path d="M20 14h2"></path>
                      <path d="M15 13v2"></path>
                      <path d="M9 13v2"></path>
                    </svg>
                 </div>
                 <TypingIndicator />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <SuggestedQuestions onQuestionClick={handleSuggestedQuestionClick} />
        
        <div className="relative flex items-center mt-2">
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none overflow-hidden"
            rows="1"
            placeholder={t.placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-2 p-2 rounded-lg transition-all flex items-center justify-center ${
              inputValue.trim() && !isTyping 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <FiSend size={16} className={inputValue.trim() && !isTyping ? "ml-0.5" : ""} />
          </button>
        </div>
        
        {/* Medical Disclaimer */}
        <p className="text-[10px] text-center text-slate-400 mt-3 px-2">
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
}
