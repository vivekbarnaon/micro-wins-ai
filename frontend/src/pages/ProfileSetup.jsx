/**
 * Profile Setup Page
 * First-time user preferences configuration with neurodivergent support
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import AnimatedBackground from '../components/AnimatedBackground';
import { ROUTES } from '../utils/constants';

const ProfileSetup = () => {
  const navigate = useNavigate();
  
  // Neurodivergent profile fields
  const [neurodivergence, setNeurodivergence] = useState(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('userPreferences'));
      return prefs?.neurodivergence || 'standard';
    } catch {
      return 'standard';
    }
  });
  const [stepSize, setStepSize] = useState('normal');
  const [breakInterval, setBreakInterval] = useState(25);
  const [aiTone, setAiTone] = useState(['calm']);
  const [verbosity, setVerbosity] = useState(3);
  const [fontType, setFontType] = useState('standard');

  const { user } = useAuth();
  const handleSave = async () => {
    // Save neurodivergent-friendly preferences
    const preferences = {
      neurodivergence,
      stepSize,
      breakInterval,
      fatigues: ['long paragraphs', 'noise'],
      aiTone,
      verbosity,
      fontType
    };

    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    // Sync with backend
    const profileData = {
      user_id: user?.uid || 'guest',
      step_granularity: stepSize,
      font_preference: fontType,
      input_mode: 'text', // You can add more fields as needed
    };
    try {
      await userAPI.updateProfile(profileData);
    } catch (err) {
      // Optionally show error or retry
      console.error('Failed to sync profile with backend:', err);
    }

    // Apply font preference immediately
    if (fontType === 'dyslexic') {
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
          ? 'border-calm-primary bg-calm-primary bg-opacity-10 text-calm-primary dark:bg-calm-primary/20'
          : 'border-calm-border dark:border-gray-600 text-calm-text dark:text-white hover:border-calm-primary'
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
          Customize your neurodivergent-friendly experience
        </p>

        {/* Neurodivergence Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text dark:text-white mb-2">
            🧠 Neurodivergence Type
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={neurodivergence === 'ADHD'}
              onClick={() => setNeurodivergence('ADHD')}
            >
              ADHD
            </SelectorButton>
            <SelectorButton
              selected={neurodivergence === 'Dyslexia'}
              onClick={() => setNeurodivergence('Dyslexia')}
            >
              Dyslexia
            </SelectorButton>
            <SelectorButton
              selected={neurodivergence === 'Autism'}
              onClick={() => setNeurodivergence('Autism')}
            >
              Autism
            </SelectorButton>
          </div>
        </div>

        {/* Step Size Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text dark:text-white mb-2">
            📏 Step Granularity
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={stepSize === 'micro'}
              onClick={() => setStepSize('micro')}
            >
              Micro (Very small)
            </SelectorButton>
            <SelectorButton
              selected={stepSize === 'normal'}
              onClick={() => setStepSize('normal')}
            >
              Normal
            </SelectorButton>
            <SelectorButton
              selected={stepSize === 'macro'}
              onClick={() => setStepSize('macro')}
            >
              Macro (Large)
            </SelectorButton>
          </div>
        </div>

        {/* Break Interval */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text dark:text-white mb-2">
            ⏰ Break Interval (minutes)
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={breakInterval === 15}
              onClick={() => setBreakInterval(15)}
            >
              15
            </SelectorButton>
            <SelectorButton
              selected={breakInterval === 25}
              onClick={() => setBreakInterval(25)}
            >
              25
            </SelectorButton>
            <SelectorButton
              selected={breakInterval === 45}
              onClick={() => setBreakInterval(45)}
            >
              45
            </SelectorButton>
            <SelectorButton
              selected={breakInterval === 60}
              onClick={() => setBreakInterval(60)}
            >
              60
            </SelectorButton>
          </div>
        </div>

        {/* AI Tone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text dark:text-white mb-2">
            🗣️ AI Communication Style
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={aiTone.includes('calm')}
              onClick={() => setAiTone(['calm'])}
            >
              Calm
            </SelectorButton>
            <SelectorButton
              selected={aiTone.includes('Friendly')}
              onClick={() => setAiTone(['Friendly'])}
            >
              Friendly
            </SelectorButton>
            <SelectorButton
              selected={aiTone.includes('strict')}
              onClick={() => setAiTone(['strict'])}
            >
              Strict
            </SelectorButton>
          </div>
        </div>

        {/* Response Verbosity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-calm-text dark:text-white mb-2">
            📝 Response Detail Level: {verbosity}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={verbosity}
            onChange={(e) => setVerbosity(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-calm-primary"
          />
          <div className="flex justify-between text-xs text-calm-textLight dark:text-gray-400 mt-1">
            <span>Brief</span>
            <span>Detailed</span>
          </div>
        </div>

        {/* Font Type Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-calm-text dark:text-white mb-2">
            ✍️ Font Style
          </label>
          <div className="flex gap-2">
            <SelectorButton
              selected={fontType === 'standard'}
              onClick={() => setFontType('standard')}
            >
              Standard
            </SelectorButton>
            <SelectorButton
              selected={fontType === 'dyslexic'}
              onClick={() => setFontType('dyslexic')}
            >
              Dyslexic-Friendly
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
