import { Star } from 'lucide-react';
import React from 'react';

const FloatingDoodles = () => {
    const FloatingDoodle = ({ children, delay = 0 }) => (
    <div 
        className="absolute animate-float"
        style={{ 
            animationDelay: `${delay}s`,
            animationDuration: '3s'
        }}
    >
        {children}
    </div>
    );

  return (
    <>
        <FloatingDoodle delay={0}>
            <Star className="w-8 h-8 text-yellow-400 absolute top-20 left-10 opacity-60" fill="currentColor" />
        </FloatingDoodle>

        <FloatingDoodle delay={1}>
            <div className="absolute top-40 right-20 w-12 h-12 border-4 border-pink-400 rounded-full opacity-40"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={0.5}>
            <div className="absolute top-60 left-1/4 w-8 h-8 bg-blue-400 rotate-45 opacity-30"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={1.5}>
            <Star className="w-6 h-6 text-purple-400 absolute bottom-40 right-10 opacity-50" fill="currentColor" />
        </FloatingDoodle>

        <FloatingDoodle delay={0.8}>
            <div className="absolute top-96 right-1/4 w-10 h-10 border-4 border-green-400 rounded-full opacity-50"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={1.2}>
            <div className="absolute top-32 right-40 w-6 h-6 bg-orange-400 rounded-full opacity-40"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={0.3}>
            <svg className="absolute top-52 left-20 w-10 h-10 opacity-40" viewBox="0 0 40 40">
                <path d="M20 5 L25 15 L35 15 L27 22 L30 32 L20 26 L10 32 L13 22 L5 15 L15 15 Z" fill="#EC4899" />
            </svg>
        </FloatingDoodle>

        <FloatingDoodle delay={1.8}>
            <div className="absolute bottom-60 left-1/3 w-8 h-8 bg-cyan-400 rotate-12 opacity-35"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={0.6}>
            <svg className="absolute top-1/3 right-10 w-12 h-12 opacity-30" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke="#A78BFA" strokeWidth="3" strokeDasharray="5,5" />
            </svg>
        </FloatingDoodle>

        <FloatingDoodle delay={2}>
            <div className="absolute bottom-96 left-10 w-7 h-7 border-4 border-yellow-500 rotate-45 opacity-45"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={1.4}>
            <svg className="absolute top-80 left-1/2 w-8 h-8 opacity-35" viewBox="0 0 40 40">
                <polygon points="20,5 30,35 10,35" fill="#10B981" />
            </svg>
        </FloatingDoodle>

        <FloatingDoodle delay={0.9}>
            <div className="absolute bottom-32 right-1/3 w-10 h-10 border-3 border-red-400 rounded-lg opacity-40"></div>
        </FloatingDoodle>

        <FloatingDoodle delay={1.6}>
            <Star className="w-5 h-5 text-blue-400 absolute top-1/4 left-1/3 opacity-45" fill="currentColor" />
        </FloatingDoodle>

        <FloatingDoodle delay={0.4}>
            <svg className="absolute bottom-1/3 right-20 w-9 h-9 opacity-35" viewBox="0 0 40 40">
                <path d="M10 20 Q20 10 30 20 Q20 30 10 20" fill="#F59E0B" />
            </svg>
        </FloatingDoodle>

        <FloatingDoodle delay={1.1}>
            <div className="absolute top-1/2 left-16 w-6 h-6 bg-purple-400 rounded-full opacity-50"></div>
        </FloatingDoodle>
    </>
  )
}

export default FloatingDoodles