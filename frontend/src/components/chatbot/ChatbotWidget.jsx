import { useChatbot } from '../../hooks/useChatbot';
import ChatbotButton from './ChatbotButton';
import ChatPopup from './ChatPopup';

export default function ChatbotWidget() {
  const chatbot = useChatbot();

  return (
    <>
      <ChatbotButton toggleChat={chatbot.toggleChat} isOpen={chatbot.isOpen} />
      
      {chatbot.isOpen && (
        <ChatPopup {...chatbot} />
      )}
    </>
  );
}
