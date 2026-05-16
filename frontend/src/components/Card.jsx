function Card({ children, className = '', hover = true, id }) {
  return (
    <div
      id={id}
      className={`bg-white rounded-2xl shadow-md shadow-black/5 border border-gray-100/80 ${
        hover ? 'hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1' : ''
      } transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
