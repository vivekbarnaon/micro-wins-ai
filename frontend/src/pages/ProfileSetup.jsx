/**
 * Profile Setup Page
 * First-time user preferences configuration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import AnimatedBackground from '../components/AnimatedBackground';
import { ROUTES, STEP_SIZES, FONT_TYPES, INPUT_MODES } from '../utils/constants';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [stepSize, setStepSize] = useState(STEP_SIZES.NORMAL);
  const [fontType, setFontType] = useState(FONT_TYPES.STANDARD);
  const [inputMode, setInputMode] = useState(INPUT_MODES.TEXT);

  const handleSave = () => {
    // TODO: Save preferences to localStorage or backend
    localStorage.setItem('userPreferences', JSON.stringify({
      stepSize,
      fontType,
      inputMode,
    }));
    
    // Apply font preference immediately
    if (fontType === FONT_TYPES.DYSLEXIC) {
      document.body.classList.add('dyslexic-font');
    }
    
    navigate(ROUTES.HOME);
  };

  const SelectorButton = ({ selected, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-calm focus-calm text-sm font-medium ${
        selected
          ? 'border-calm-primary bg-calm-primary bg-opacity-10 text-calm-primary'
          : 'border-calm-border text-calm-text hover:border-calm-primary'
      }`}
    >
      {children}
    </button>
  );
  return (
    <div className="flex items-center justify-center min-h-[80vh] relative overflow-hidden">
      <AnimatedBackground variant="calm" />
      <Card padding="large" className="w-full max-w-lg backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-2xl border border-white/30 dark:border-gray-700/30 animate-fade-in hover:shadow-3xl transition-all duration-300">
        <h1 className="text-2xl font-semibold text-calm-text dark:text-white mb-2 text-center">
          Set Your Preferences
        </h1>
        <p className="text-calm-textLight dark:text-gray-300 mb-8 text-center text-sm">
          Customize your experience
        </p>

        {/* Step Size Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text mb-2">
            Step Size
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={stepSize === STEP_SIZES.MICRO}
              onClick={() => setStepSize(STEP_SIZES.MICRO)}
            >
              Micro
            </SelectorButton>
            <SelectorButton
              selected={stepSize === STEP_SIZES.NORMAL}
              onClick={() => setStepSize(STEP_SIZES.NORMAL)}
            >
              Normal
            </SelectorButton>
            <SelectorButton
              selected={stepSize === STEP_SIZES.MACRO}
              onClick={() => setStepSize(STEP_SIZES.MACRO)}
            >
              Macro
            </SelectorButton>
          </div>
        </div>

        {/* Font Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text mb-2">
            Font Style
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={fontType === FONT_TYPES.STANDARD}
              onClick={() => setFontType(FONT_TYPES.STANDARD)}
            >
              Standard
            </SelectorButton>
            <SelectorButton
              selected={fontType === FONT_TYPES.DYSLEXIC}
              onClick={() => setFontType(FONT_TYPES.DYSLEXIC)}
            >
              Dyslexic-Friendly
            </SelectorButton>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-calm-text mb-2">
            Input Method
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={inputMode === INPUT_MODES.TEXT}
              onClick={() => setInputMode(INPUT_MODES.TEXT)}
            >
              Text
            </SelectorButton>
            <SelectorButton
              selected={inputMode === INPUT_MODES.VOICE}
              onClick={() => setInputMode(INPUT_MODES.VOICE)}
            >
              Voice
            </SelectorButton>
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={handleSave}>
          Save & Continue
        </Button>
      </Card>
    </div>
  );
};

export default ProfileSetup;
