export default function ChatbotButton({ toggleChat, isOpen }) {
  if (isOpen) return null;

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-teal-400 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center z-50 animate-pulse hover:animate-none group"
      aria-label="Open AI Chatbot"
    >
      <div className="absolute inset-0 rounded-full bg-teal-400 opacity-0 group-hover:animate-ping duration-1000"></div>
      
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <path d="M9 9h.01"></path>
        <path d="M15 9h.01"></path>
        <path d="M12 9h.01"></path>
      </svg>
    </button>
  );
}
