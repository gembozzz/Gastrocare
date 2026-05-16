function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full" id="progress-section">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-blue-600">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-gray-400">
          {percentage}% Complete
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
