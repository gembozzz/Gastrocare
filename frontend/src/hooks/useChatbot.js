import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/languageContext';

const STORAGE_KEY = 'gastrocare_chat_history';

const getInitialMessages = (lang) => {
  return [
    {
      id: 1,
      role: 'ai',
      content: lang === 'id' 
        ? "Halo! Saya Asisten AI GastroCare. Ada yang bisa saya bantu hari ini mengenai kesehatan pencernaan atau masalah GERD Anda?" 
        : "Hello! I'm the GastroCare AI Assistant. How can I help you today with your digestive health or GERD questions?",
      timestamp: new Date().toISOString(),
    }
  ];
};

// Mock AI responses based on keywords and language
const generateMockResponse = (message, lang) => {
  const lowerMsg = message.toLowerCase();
  
  if (lang === 'id') {
    if (lowerMsg.includes('gerd') || lowerMsg.includes('asam lambung')) {
      return "GERD (Gastroesophageal Reflux Disease) terjadi ketika asam lambung sering naik kembali ke kerongkongan. Aliran balik asam ini dapat mengiritasi lapisan kerongkongan Anda.";
    }
    
    if (lowerMsg.includes('gejala') || lowerMsg.includes('dada panas') || lowerMsg.includes('nyeri') || lowerMsg.includes('panas')) {
      return "Sering merasa dada panas (heartburn) bisa jadi berhubungan dengan GERD. Gejala umum lainnya termasuk naiknya makanan atau cairan asam, kesulitan menelan, atau sensasi ada benjolan di tenggorokan.";
    }

    if (lowerMsg.includes('pantangan') || lowerMsg.includes('makanan') || lowerMsg.includes('hindari') || lowerMsg.includes('diet')) {
      return "Untuk membantu mengatasi GERD, cobalah untuk menghindari makanan pedas, buah jeruk, tomat, cokelat, kafein, dan makan dalam porsi besar atau larut malam. Makan dalam porsi kecil tapi lebih sering dapat membantu.";
    }

    if (lowerMsg.includes('dokter') || lowerMsg.includes('parah')) {
      return "Jika gejala Anda parah, terjadi lebih dari dua kali seminggu, atau disertai kesulitan menelan, Anda harus berkonsultasi dengan dokter. \n\n*Catatan: Silakan temui profesional kesehatan untuk diagnosis yang tepat.*";
    }

    return "Saya mengerti Anda mengalami beberapa masalah pencernaan. Bisakah Anda memberikan detail lebih lanjut? Ingatlah untuk menghindari makan porsi besar sebelum berbaring dan cobalah meninggikan kepala saat tidur.";
  } else {
    // English responses
    if (lowerMsg.includes('gerd') || lowerMsg.includes('acid reflux')) {
      return "GERD (Gastroesophageal Reflux Disease) occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach (esophagus). This backwash (acid reflux) can irritate the lining of your esophagus.";
    }
    
    if (lowerMsg.includes('symptom') || lowerMsg.includes('chest burning') || lowerMsg.includes('heartburn')) {
      return "Frequent heartburn and chest burning may be related to GERD or acid reflux. Common symptoms also include regurgitation of food or sour liquid, difficulty swallowing, or a sensation of a lump in your throat.";
    }

    if (lowerMsg.includes('diet') || lowerMsg.includes('food') || lowerMsg.includes('avoid')) {
      return "To help manage GERD, try to avoid spicy foods, citrus fruits, tomatoes, chocolate, caffeine, and eating large or late-night meals. Eating smaller, more frequent meals can also help.";
    }

    if (lowerMsg.includes('doctor') || lowerMsg.includes('severe')) {
      return "If your symptoms are severe, occur more than twice a week, or are accompanied by difficulty swallowing, you should consult a healthcare professional. \n\n*Note: Please see a doctor for a proper medical diagnosis.*";
    }

    return "I understand you're experiencing some digestive concerns. Could you provide a bit more detail? Remember to avoid eating large meals before lying down and consider elevating the head of your bed.";
  }
};

export function useChatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    setMessages(getInitialMessages(language));
  }, []); // Intentionally keep empty dependency array to only run on mount

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const toggleChat = () => setIsOpen(prev => !prev);
  const closeChat = () => setIsOpen(false);

  const sendMessage = (content) => {
    if (!content.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    const fetchAIResponse = async () => {
      try {
        let history_prediction = {
          prediksi: "",
          kepercayaan: "",
          top3: [],
          semua_probabilitas: {},
          gejala_input: {},
          peringatan: ""
        };
        
        try {
          const savedResult = localStorage.getItem('gastrocare_last_prediction');
          if (savedResult) {
            const parsed = JSON.parse(savedResult);
            const resultData = parsed.data || parsed;
            if (resultData.prediksi) {
               history_prediction = {
                  prediksi: resultData.prediksi || "",
                  kepercayaan: resultData.kepercayaan || "",
                  top3: resultData.top3 || [],
                  semua_probabilitas: resultData.semuaProbabilitas || {},
                  gejala_input: resultData.gejala_input || {},
                  peringatan: resultData.peringatan || ""
               };
            }
          }
        } catch (e) {
          console.error("Failed to parse history_prediction", e);
        }

        const languageInstruction = language === 'en' 
          ? "\n\n(Instruction: Please reply in English language)" 
          : "\n\n(Instruksi: Tolong jawab dalam Bahasa Indonesia)";
          
        const apiMessage = newUserMsg.content + languageInstruction;

        const response = await fetch("https://canopus77-gastrocare.hf.space/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: apiMessage,
                history_prediction: history_prediction
            })
        });

        if (!response.ok) throw new Error("API error");
        
        const textData = await response.text();
        let data;
        try {
           data = JSON.parse(textData);
        } catch(e) {
           data = textData;
        }
        
        let aiText = "";
        if (typeof data === 'string') {
          aiText = data;
        } else if (data.reply) {
          aiText = data.reply;
          
          // Remove hardcoded Indonesian disclaimer from HF Space API if it exists
          const disclaimerRegex = /⚠️\s*Informasi ini bersifat edukatif dan bukan pengganti diagnosis dokter\.\s*Selalu konsultasikan kondisi Anda ke tenaga medis\./i;
          if (disclaimerRegex.test(aiText)) {
            aiText = aiText.replace(disclaimerRegex, "").trim();
            const translatedDisclaimer = language === 'en'
              ? "⚠️ This information is educational and not a substitute for medical diagnosis. Always consult a healthcare professional regarding your condition."
              : "⚠️ Informasi ini bersifat edukatif dan bukan pengganti diagnosis dokter. Selalu konsultasikan kondisi Anda ke tenaga medis.";
            aiText += `\n\n${translatedDisclaimer}`;
          }

          if (data.rag_aktif && data.docs_dipakai && data.docs_dipakai.length > 0) {
            const uniqueDocs = [...new Set(data.docs_dipakai.map(d => d.sumber))];
            const refTitle = language === 'en' ? "**Reference Sources:**" : "**Sumber Referensi:**";
            aiText += `\n\n---\n${refTitle}\n` + uniqueDocs.map(doc => `• ${doc}`).join("\n");
          }
        } else {
          aiText = data.response || data.answer || data.message || JSON.stringify(data);
        }

        const newAiMsg = {
           id: Date.now() + 1,
           role: 'ai',
           content: aiText,
           timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, newAiMsg]);
      } catch (error) {
        console.error("Chat API error:", error);
        const newAiMsg = {
           id: Date.now() + 1,
           role: 'ai',
           content: language === 'id' ? "Maaf, saya tidak dapat terhubung ke server saat ini." : "Sorry, I cannot connect to the server right now.",
           timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newAiMsg]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchAIResponse();
  };

  const handleInputChange = (e) => setInputValue(e.target.value);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    sendMessage(question);
  };

  return {
    isOpen,
    toggleChat,
    closeChat,
    messages,
    inputValue,
    handleInputChange,
    handleKeyDown,
    sendMessage,
    isTyping,
    messagesEndRef,
    handleSuggestedQuestionClick,
  };
}
