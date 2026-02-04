/**
 * Main Layout Component
 * Provides navbar and centered content area
 */

import Navbar from '../components/Navbar';

const MainLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-calm-bg dark:bg-gray-900 transition-colors duration-300">
      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      <Navbar />
      <main id="main-content" className={`${className}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
