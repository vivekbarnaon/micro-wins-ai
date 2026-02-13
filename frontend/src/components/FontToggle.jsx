/**
 * Font Toggle Component
 * Switches between standard and dyslexic-friendly fonts
 */

import { FONT_TYPES } from '../utils/constants';


const FontToggle = ({ currentFont, onChange, className = '' }) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => onChange(FONT_TYPES.STANDARD)}
        className={`px-3 py-2 text-xs rounded ${currentFont === FONT_TYPES.STANDARD ? 'bg-calm-primary text-white' : 'bg-calm-card text-calm-textLight'} transition-calm`}
        aria-label="Standard font"
      >
        Standard
      </button>
      <button
        onClick={() => onChange(FONT_TYPES.DYSLEXIC)}
        className={`px-3 py-2 text-xs rounded ${currentFont === FONT_TYPES.DYSLEXIC ? 'bg-calm-primary text-white' : 'bg-calm-card text-calm-textLight'} transition-calm`}
        aria-label="OpenDyslexic font"
      >
        OpenDyslexic
      </button>
      <button
        onClick={() => onChange(FONT_TYPES.LEXEND)}
        className={`px-3 py-2 text-xs rounded ${currentFont === FONT_TYPES.LEXEND ? 'bg-calm-primary text-white' : 'bg-calm-card text-calm-textLight'} transition-calm`}
        aria-label="Lexend font"
      >
        Lexend
      </button>
    </div>
  );
};

export default FontToggle;
