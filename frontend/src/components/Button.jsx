import { Link } from 'react-router-dom'

function Button({ children, to, onClick, variant = 'primary', disabled = false, className = '', id, type = 'button' }) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md hover:border-gray-300 active:scale-[0.98]',
    outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 active:scale-[0.98]',
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} id={id}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} id={id}>
      {children}
    </button>
  )
}

export default Button
