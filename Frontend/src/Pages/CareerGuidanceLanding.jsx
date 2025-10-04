import React, { useState, useEffect } from 'react';
import { Compass, TrendingUp, Users, Sparkles, BookOpen, Target, ArrowRight, Menu, X, Star } from 'lucide-react';


import Navigation from '../Components/Navigation';
import FloatingDoodles from '../Components/FloatingDoodles';
import MobileMenu from '../Components/MobileMenu';
import Hero from '../Components/Hero';
import BrandingBanner from '../Components/BrandingBanner';


export default function CareerGuidanceLanding({ onNavigate }) {
 
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

  const features = [
    { icon: <Compass className="w-8 h-8" />, title: "AI Career Pathfinder", desc: "Personalized career recommendations based on your skills and interests", color: "bg-blue-400" },
    { icon: <Users className="w-8 h-8" />, title: "Mentor Connect", desc: "Connect with industry professionals in your field of interest", color: "bg-pink-400" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Skill Gap Analysis", desc: "Identify skills you need to reach your dream career", color: "bg-green-400" },
    { icon: <BookOpen className="w-8 h-8" />, title: "Learning Roadmaps", desc: "Curated learning paths with courses and resources", color: "bg-purple-400" },
    { icon: <Target className="w-8 h-8" />, title: "Goal Tracker", desc: "Set milestones and track your career development journey", color: "bg-orange-400" },
    { icon: <Sparkles className="w-8 h-8" />, title: "Smart Insights", desc: "Market trends and salary insights for informed decisions", color: "bg-yellow-300" }
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .group:hover .group-hover-scale {
          transform: scale(1.1);
        }
        .group:hover .group-hover-rotate {
          transform: rotate(10deg);
        }
      `}</style>

      
      <FloatingDoodles />

      <Navigation onNavigate={onNavigate} />

      <MobileMenu />

      <Hero />
      
      <BrandingBanner />

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-gray-900 transition-all duration-300 hover:text-yellow-600 hover:scale-105">Our Features</h2>
          <p className="text-xl text-center text-gray-700 mb-16 transition-all duration-300 hover:text-gray-900">Everything you need to navigate your career journey</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-4 border-gray-900 cursor-pointer relative overflow-hidden"
              >
                {/* Animated background on hover */}
                <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 border-2 border-gray-900 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover-rotate`}>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 relative z-10 transition-colors duration-300 group-hover:text-yellow-600">{feature.title}</h3>
                <p className="text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-gray-900">{feature.desc}</p>
                
                {/* Hover arrow indicator */}
                <ArrowRight className="absolute bottom-6 right-6 w-6 h-6 text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 relative overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-pink-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-5xl font-bold text-yellow-400 transition-all duration-300 hover:scale-105 hover:text-yellow-300">Ready to Shape Your Future?</h2>
          <p className="text-xl text-yellow-100 transition-all duration-300 hover:text-white">Join thousands of professionals who've found their perfect career path</p>
          <button className="px-12 py-5 bg-yellow-400 text-gray-900 rounded-full font-bold text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-110 active:scale-95 inline-flex items-center gap-3 shadow-2xl hover:shadow-yellow-400/50 animate-pulse-glow">
            Start Your Journey <Sparkles className="w-6 h-6 transition-transform duration-300 group-hover:rotate-180" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-400 py-12 px-4 border-t-4 border-gray-900 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center items-center space-x-2 mb-4 group cursor-pointer">
            <Compass className="w-8 h-8 text-gray-800 transition-transform duration-500 group-hover:rotate-360" style={{ transition: 'transform 0.5s ease-in-out' }} />
            <span className="text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-gray-900 group-hover:scale-110">PathFinder</span>
          </div>
          <p className="text-gray-800 font-medium transition-all duration-300 hover:text-gray-900 hover:scale-105">Empowering careers, one path at a time.</p>
        </div>
      </footer>
    </div>
  );
}