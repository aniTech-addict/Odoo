import { useState, useEffect } from 'react'
import React from 'react'
import { Compass, Menu, X} from 'lucide-react';
import Button from './Ui/Button';

const Navigation = ({ onNavigate }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

  return (
    <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-yellow-400 shadow-lg backdrop-blur-sm' : 'bg-yellow-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <Compass className="w-8 h-8 text-gray-800 transition-transform duration-300 group-hover:rotate-180" />
              <span className="text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-gray-900">FlowXpense</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-800 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-110 inline-block">CAREER GUIDANCE</a>
              <a href="#" className="text-gray-800 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-110 inline-block">ABOUT</a>
              <a href="#" className="text-gray-800 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-110 inline-block">FIND US</a>
            </div>

            <div className="hidden md:block">
              <div onClick={() => onNavigate && onNavigate('login')}>
                <Button content="Log in"/>
              </div>
            </div>

            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden transition-transform duration-300 hover:scale-110 active:scale-95"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation