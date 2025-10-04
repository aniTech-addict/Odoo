const Button = ({ isDark, content }) => {
  return (
    <button
      className={`rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl ${
        isDark
          ? "px-8 py-4 bg-gray-900 text-yellow-400 hover:bg-gray-800 flex items-center gap-2"
          : "px-4 py-1.5 bg-yellow-400 text-gray-900 border-2 border-gray-900 hover:bg-yellow-300"
      }`}
    >
      {content}
    </button>
  )
}

export default Button