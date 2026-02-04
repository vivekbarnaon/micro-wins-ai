/**
 * Profile Page
 * View and edit user preferences
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import EnergySelector from '../components/EnergySelector';
import FontToggle from '../components/FontToggle';
import { ROUTES, STEP_SIZES, FONT_TYPES, INPUT_MODES, ENERGY_LEVELS } from '../utils/constants';

const Profile = () => {
  const navigate = useNavigate();
  
  // Load preferences from localStorage
  const [preferences, setPreferences] = useState({
    stepSize: localStorage.getItem('stepSize') || STEP_SIZES.NORMAL,
    fontType: localStorage.getItem('fontType') || FONT_TYPES.STANDARD,
    inputMode: localStorage.getItem('inputMode') || INPUT_MODES.TEXT,
    energyLevel: ENERGY_LEVELS.MEDIUM
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrefs, setEditedPrefs] = useState(preferences);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPrefs(preferences);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPrefs(preferences);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('stepSize', editedPrefs.stepSize);
    localStorage.setItem('fontType', editedPrefs.fontType);
    localStorage.setItem('inputMode', editedPrefs.inputMode);
    
    // Apply font change immediately
    if (editedPrefs.fontType === FONT_TYPES.DYSLEXIC) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
    
    setPreferences(editedPrefs);
    setIsEditing(false);
  };

  const getStepSizeLabel = (size) => {
    switch(size) {
      case STEP_SIZES.MICRO: return 'Micro Steps';
      case STEP_SIZES.NORMAL: return 'Normal Steps';
      case STEP_SIZES.MACRO: return 'Macro Steps';
      default: return size;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-pink-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-calm-primary to-purple-500 rounded-full mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-calm-text dark:text-white mb-2">
            Your Profile
          </h1>
          <p className="text-calm-textLight dark:text-gray-300 text-lg">
            Manage your preferences and settings
          </p>
        </div>

        {/* Preferences Card */}
        <Card padding="large" className="shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 mb-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-calm-text dark:text-white">
              Preferences
            </h2>
            {!isEditing && (
              <Button
                variant="secondary"
                size="medium"
                onClick={handleEdit}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </div>
              </Button>
            )}
          </div>

          {/* Step Size */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-calm-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-calm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Step Size
            </label>
            {isEditing ? (
              <div className="flex gap-3">
                {[STEP_SIZES.MICRO, STEP_SIZES.NORMAL, STEP_SIZES.MACRO].map((size) => (
                  <button
                    key={size}
                    onClick={() => setEditedPrefs({...editedPrefs, stepSize: size})}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      editedPrefs.stepSize === size
                        ? 'bg-calm-primary text-white shadow-md'
                        : 'bg-gray-100 text-calm-text hover:bg-gray-200'
                    }`}
                  >
                    {getStepSizeLabel(size)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <p className="text-calm-text font-medium">{getStepSizeLabel(preferences.stepSize)}</p>
              </div>
            )}
          </div>

          {/* Font Type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-calm-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-calm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Font Style
            </label>
            {isEditing ? (
              <FontToggle 
                selected={editedPrefs.fontType}
                onChange={(fontType) => setEditedPrefs({...editedPrefs, fontType})}
              />
            ) : (
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <p className="text-calm-text font-medium">
                  {preferences.fontType === FONT_TYPES.STANDARD ? 'Standard Font' : 'Dyslexic-Friendly Font'}
                </p>
              </div>
            )}
          </div>

          {/* Input Mode */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-calm-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-calm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Input Mode
            </label>
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditedPrefs({...editedPrefs, inputMode: INPUT_MODES.TEXT})}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    editedPrefs.inputMode === INPUT_MODES.TEXT
                      ? 'bg-calm-primary text-white shadow-md'
                      : 'bg-gray-100 text-calm-text hover:bg-gray-200'
                  }`}
                >
                  Text Input
                </button>
                <button
                  onClick={() => setEditedPrefs({...editedPrefs, inputMode: INPUT_MODES.VOICE})}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    editedPrefs.inputMode === INPUT_MODES.VOICE
                      ? 'bg-calm-primary text-white shadow-md'
                      : 'bg-gray-100 text-calm-text hover:bg-gray-200'
                  }`}
                >
                  Voice Input
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <p className="text-calm-text font-medium">
                  {preferences.inputMode === INPUT_MODES.TEXT ? 'Text Input' : 'Voice Input'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons (only in edit mode) */}
          {isEditing && (
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                variant="secondary"
                size="large"
                fullWidth
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </Card>

        {/* Stats Card */}
        <Card className="shadow-xl border border-gray-100 backdrop-blur-sm bg-white/95 mb-6">
          <h3 className="text-xl font-semibold text-calm-text mb-4">Your Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-calm-primary">0</p>
              <p className="text-sm text-calm-textLight mt-1">Tasks Completed</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-calm-textLight mt-1">Steps Done</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-calm-textLight mt-1">Day Streak</p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => navigate(ROUTES.HOME)}
          className="shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg font-semibold">Start New Task</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Profile;
