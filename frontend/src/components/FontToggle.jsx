/**
 * Font Toggle Component
 * Switches between standard and dyslexic-friendly fonts
 */

import { FONT_TYPES } from '../utils/constants';

const FontToggle = ({ currentFont, onChange, className = '' }) => {
  const toggleFont = () => {
    const newFont = currentFont === FONT_TYPES.STANDARD 
      ? FONT_TYPES.DYSLEXIC 
      : FONT_TYPES.STANDARD;
    onChange(newFont);
  };

  return (
    <button
      onClick={toggleFont}
      className={`px-4 py-2 text-sm text-calm-textLight hover:text-calm-primary transition-calm focus-calm ${className}`}
      aria-label="Toggle font type"
    >
      Font: {currentFont === FONT_TYPES.STANDARD ? 'Standard' : 'Dyslexic'}
    </button>
  );
};

export default FontToggle;
