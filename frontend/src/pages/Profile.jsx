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
import AnimatedBackground from '../components/AnimatedBackground';
import { ROUTES, STEP_SIZES, FONT_TYPES, INPUT_MODES, ENERGY_LEVELS } from '../utils/constants';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Load preferences from localStorage (userPreferences format)
  const loadPreferences = () => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      return {
        stepSize: prefs.stepSize || STEP_SIZES.NORMAL,
        fontType: prefs.fontType || FONT_TYPES.STANDARD,
        inputMode: prefs.inputMode || INPUT_MODES.TEXT,
        neurodivergence: prefs.neurodivergence || 'ADHD',
        breakInterval: prefs.breakInterval || 25,
        aiTone: prefs.aiTone || ['calm'],
        verbosity: prefs.verbosity || 3
      };
    }
    return {
      stepSize: STEP_SIZES.NORMAL,
      fontType: FONT_TYPES.STANDARD,
      inputMode: INPUT_MODES.TEXT,
      neurodivergence: 'ADHD',
      breakInterval: 25,
      aiTone: ['calm'],
      verbosity: 3
    };
  };

  const [preferences, setPreferences] = useState(loadPreferences());
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrefs, setEditedPrefs] = useState(preferences);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      if (!user?.uid) return;
      try {
        setLoadingStats(true);
        const data = await userAPI.getStats(user.uid);
        // Map backend fields to frontend expectations
        // completed_today: 1 if last_completed_date is today, else 0
        let completed_today = 0;
        if (data.last_completed_date) {
          const today = new Date();
          const last = new Date(data.last_completed_date);
          if (
            today.getFullYear() === last.getFullYear() &&
            today.getMonth() === last.getMonth() &&
            today.getDate() === last.getDate()
          ) {
            completed_today = 1;
          }
        }
        setStats({
          ...data,
          current_streak: data.streak,
          completed_today,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPrefs(preferences);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPrefs(preferences);
  };

  const handleSave = () => {
    // Save to userPreferences format (matching ProfileSetup)
    const updatedPrefs = {
      neurodivergence: editedPrefs.neurodivergence,
      stepSize: editedPrefs.stepSize,
      breakInterval: editedPrefs.breakInterval,
      fatigues: ['long paragraphs', 'noise'],
      aiTone: editedPrefs.aiTone,
      verbosity: editedPrefs.verbosity,
      fontType: editedPrefs.fontType,
      inputMode: editedPrefs.inputMode
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    
    // Apply font change immediately
    document.body.classList.remove('dyslexic-font', 'lexend-font');
    if (editedPrefs.fontType === FONT_TYPES.DYSLEXIC) {
      document.body.classList.add('dyslexic-font');
    } else if (editedPrefs.fontType === FONT_TYPES.LEXEND) {
      document.body.classList.add('lexend-font');
    }
    
    setPreferences(editedPrefs);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear(); // Clear all user data
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('Logout failed:', err);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-pink-900 py-12 px-4 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground variant="default" />
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-calm-primary to-purple-500 rounded-full mb-6 shadow-2xl animate-scale-in">
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
        <Card padding="large" className="shadow-2xl border border-white/30 dark:border-gray-700/30 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 mb-6 animate-slide-up hover:shadow-3xl transition-all duration-300">
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

        {/* Stats Card - Enhanced with rewards, streak, motivational message */}
        <Card className="shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 mb-6">
          <h3 className="text-xl font-semibold text-calm-text dark:text-white mb-4">Your Progress</h3>
          {loadingStats ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calm-primary"></div>
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-calm-primary dark:text-blue-400">{stats.total_tasks_completed}</p>
                  <p className="text-sm text-calm-textLight dark:text-gray-300 mt-1">Tasks Completed</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.total_steps_completed}</p>
                  <p className="text-sm text-calm-textLight dark:text-gray-300 mt-1">Steps Done</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.total_tasks_active}</p>
                  <p className="text-sm text-calm-textLight dark:text-gray-300 mt-1">Active Tasks</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{stats.completed_today ?? 0}</p>
                  <p className="text-sm text-calm-textLight dark:text-gray-300 mt-1">Completed Today</p>
                </div>
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-pink-500 dark:text-pink-400">{stats.current_streak ?? 0} 🔥</p>
                  <p className="text-sm text-calm-textLight dark:text-gray-300 mt-1">Current Streak</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.reward_points ?? 0}</p>
                  <p className="text-sm text-calm-textLight dark:text-gray-300 mt-1">Reward Points</p>
                </div>
              </div>
              {/* Motivational message from backend */}
              <div className="text-center mt-2 mb-1">
                <p className="text-calm-textLight dark:text-gray-300 text-lg font-medium">
                  {stats.motivational_message}
                </p>
              </div>

              {/* Earned Badges */}
              {stats.badges && stats.badges.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-calm-text dark:text-white text-lg font-semibold mb-2">Your Badges</h4>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {stats.badges.map((badge) => (
                      <div key={badge.code} className="flex flex-col items-center group">
                        <span
                          className="text-4xl md:text-5xl select-none transition-transform group-hover:scale-110"
                          title={badge.description}
                          aria-label={badge.name}
                        >
                          {badge.emoji}
                        </span>
                        <span className="text-xs mt-1 text-calm-textLight dark:text-gray-300 text-center max-w-[80px]">
                          {badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-calm-textLight dark:text-gray-300 text-center py-4">Start completing tasks to see your progress!</p>
          )}
        </Card>

        {/* Action Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => navigate(ROUTES.HOME)}
          className="shadow-lg mb-4"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg font-semibold">Start New Task</span>
          </div>
        </Button>

        {/* Logout Button */}
        <Button
          variant="secondary"
          size="large"
          fullWidth
          onClick={handleLogout}
          className="shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-lg font-semibold">Logout</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Profile;
