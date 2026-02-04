/**
 * Navbar Component
 * Global navigation bar with logo, home link, and profile
 */

import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { ROUTES } from '../utils/constants';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand - Clickable to root/login */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={40} />
            <span className="text-xl font-bold text-calm-text dark:text-white">MicroWins</span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
            {/* Home Link */}
            <Link
              to={ROUTES.HOME}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(ROUTES.HOME)
                  ? 'bg-calm-primary text-white shadow-md'
                  : 'text-calm-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
            </Link>
          </div>

          {/* Profile Circle & Dark Mode Toggle - Right Side */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            
            <Link
              to={ROUTES.PROFILE}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isActive(ROUTES.PROFILE)
                  ? 'bg-calm-primary text-white shadow-md ring-2 ring-calm-primary ring-offset-2 dark:ring-offset-gray-900'
                  : 'bg-gray-200 dark:bg-gray-700 text-calm-text dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Profile"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
