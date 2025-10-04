import { useState, useEffect } from 'react';

const MobileMenu = ({ isOpen, onClose }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Close menu when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-yellow-400 pt-16 md:hidden transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={handleBackdropClick}
      >
        <div className="flex flex-col items-center space-y-6 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-800 text-2xl hover:scale-110 transition-transform duration-300"
          >
            ×
          </button>
          <a href="#" className="text-2xl font-medium text-gray-800 hover:scale-110 transition-transform duration-300">SHOP</a>
          <a href="#" className="text-2xl font-medium text-gray-800 hover:scale-110 transition-transform duration-300">ABOUT</a>
          <a href="#" className="text-2xl font-medium text-gray-800 hover:scale-110 transition-transform duration-300">FIND US</a>
          <input
            type="text"
            placeholder="SEARCH"
            className="px-4 py-2 rounded-full border-2 border-gray-800 bg-yellow-300 transition-all duration-300 hover:scale-105"
          />
        </div>
      </div>
    </>
  );
};

export default MobileMenu