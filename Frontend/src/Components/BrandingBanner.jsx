import React from 'react'

const BrandingBanner = () => {
  return (
    <section className="bg-white py-8 relative overflow-hidden group cursor-default">
        <div className="absolute inset-0 bg-yellow-200 opacity-30 transition-opacity duration-300 group-hover:opacity-50"></div>
            <h2 className="text-8xl md:text-9xl font-bold text-center text-gray-900 relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:text-yellow-600">
            FlowExpense
            </h2>
        {/* Animated underline */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </section>
  )
}

export default BrandingBanner