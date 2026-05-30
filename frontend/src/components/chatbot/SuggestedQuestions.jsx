import { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';

export default function SuggestedQuestions({ onQuestionClick }) {
  const { language } = useLanguage();
  const [hiddenQuestions, setHiddenQuestions] = useState([]);

  const suggestions = {
    en: [
      "What are GERD symptoms?",
      "Is stomach acid dangerous?",
      "Foods to avoid with GERD",
      "When should I see a doctor?"
    ],
    id: [
      "Apa saja gejala GERD?",
      "Apakah asam lambung berbahaya?",
      "Pantangan makanan untuk GERD",
      "Kapan harus ke dokter?"
    ]
  };

  const currentSuggestions = suggestions[language] || suggestions.id;
  const visibleSuggestions = currentSuggestions.filter(q => !hiddenQuestions.includes(q));

  if (visibleSuggestions.length === 0) {
    return null;
  }

  const handleQuestionClick = (q) => {
    setHiddenQuestions(prev => [...prev, q]);
    onQuestionClick(q);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-1">
      {visibleSuggestions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => handleQuestionClick(q)}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-full transition-colors whitespace-nowrap border border-slate-200"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
