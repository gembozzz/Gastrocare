function QuestionCard({ question, options, selectedAnswer, onSelectAnswer }) {
  return (
    <div className="animate-fade-in" id="question-card">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-8 leading-relaxed">
        {question}
      </h2>

      <div className="flex flex-col gap-3 max-w-lg mx-auto">
        {options.map((option, index) => (
          <button
            key={index}
            id={`option-${index}`}
            onClick={() => onSelectAnswer(index)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-500/10'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 group-hover:border-blue-400'
                }`}
              >
                {selectedAnswer === index && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  selectedAnswer === index ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-800'
                }`}
              >
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
