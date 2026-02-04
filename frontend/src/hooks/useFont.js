/**
 * Custom hook for managing global font preference
 */

import { useEffect } from 'react';
import { FONT_TYPES } from '../utils/constants';

export const useFont = () => {
  useEffect(() => {
    // Apply font preference on mount
    const savedFont = localStorage.getItem('fontType') || FONT_TYPES.STANDARD;
    
    if (savedFont === FONT_TYPES.DYSLEXIC) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }

    // Listen for storage changes (when user updates in Profile)
    const handleStorageChange = (e) => {
      if (e.key === 'fontType') {
        if (e.newValue === FONT_TYPES.DYSLEXIC) {
          document.body.classList.add('dyslexic-font');
        } else {
          document.body.classList.remove('dyslexic-font');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
};
