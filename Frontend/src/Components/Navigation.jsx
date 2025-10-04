import { useState, useEffect } from 'react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DollarSign, Menu, X, Home, FileText, CheckCircle, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, requiresAuth: true },
    { path: '/expenses', label: 'Expenses', icon: FileText, requiresAuth: true },
    { path: '/approvals', label: 'Approvals', icon: CheckCircle, requiresAuth: true, roles: ['admin', 'editor'] },
    { path: '/users', label: 'Users', icon: Users, requiresAuth: true, roles: ['admin'] },
  ];

  const filteredNavLinks = navLinks.filter(link => {
    if (!link.requiresAuth) return true;
    if (!isAuthenticated) return false;
    if (link.roles && !link.roles.includes(user?.role)) return false;
    return true;
  });

  return (
    <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg backdrop-blur-sm border-b border-gray-200' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-gray-900 transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:text-yellow-600">FlowXpense</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {isAuthenticated ? (
                <>
                  {filteredNavLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                          isActive(link.path)
                            ? 'bg-yellow-400 text-gray-900'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300">
                    <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/" className="text-gray-800 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-110 inline-block">
                    Home
                  </Link>
                  <Link to="/login" className="text-gray-800 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-110 inline-block">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-800 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-110 inline-block">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden transition-transform duration-300 hover:scale-110 active:scale-95 p-2"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {isAuthenticated ? (
              <>
                {filteredNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isActive(link.path)
                          ? 'bg-yellow-400 text-gray-900'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-gray-200">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Welcome, {user?.username}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all duration-300 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-800 hover:text-gray-900 font-medium transition-all duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-800 hover:text-gray-900 font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-800 hover:text-gray-900 font-medium transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation