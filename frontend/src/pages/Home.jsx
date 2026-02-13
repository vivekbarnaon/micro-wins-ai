/**
 * Home Page
 * Task input and energy selection
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import EnergySelector from '../components/EnergySelector';
import Logo from '../components/Logo';
import AnimatedBackground from '../components/AnimatedBackground';
import { ROUTES, ENERGY_LEVELS } from '../utils/constants';
import { tasksAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user;
  const [taskInput, setTaskInput] = useState('');
  const [energyLevel, setEnergyLevel] = useState(ENERGY_LEVELS.MEDIUM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartTask = async () => {
    if (!taskInput.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Get user preferences from localStorage
      const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      
      // Map energy level to step granularity
      const stepGranularityMap = {
        [ENERGY_LEVELS.LOW]: 'micro',
        [ENERGY_LEVELS.MEDIUM]: 'normal',
        [ENERGY_LEVELS.HIGH]: 'macro'
      };

      // Create task with backend API
      const response = await tasksAPI.createTask({
        user_id: user?.uid || 'guest',
        task: taskInput,
        neurodivergence: prefs.neurodivergence || 'ADHD',
        step_granularity: prefs.stepSize || stepGranularityMap[energyLevel],
        break_interval_minutes: prefs.breakInterval || 25,
        fatigue_triggers: prefs.fatigues || ['long paragraphs'],
        ai_tone: prefs.aiTone || ['calm'],
        response_verbosity: prefs.verbosity || 3
      });

      // Store task_id and navigate
      localStorage.setItem('currentTaskId', response.task_id);
      navigate(ROUTES.TASK);
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.message || 'Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && taskInput.trim()) {
      handleStartTask();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center px-4 py-8 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground variant="energy" />
      <div className="w-full max-w-3xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-6 transform hover:scale-110 transition-transform duration-300 animate-scale-in">
            <Logo size={120} />
          </div>
          <h1 className="text-5xl font-bold text-calm-text dark:text-white mb-4 leading-tight">
            What's your next win?
          </h1>
          <p className="text-calm-textLight dark:text-gray-300 text-xl max-w-2xl mx-auto">
            Share your goal, and I'll break it down into simple, achievable steps
          </p>
        </div>

        {/* Main Card */}
        <Card padding="large" className="shadow-2xl border border-white/30 dark:border-gray-700/30 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 animate-slide-up hover:shadow-3xl transition-all duration-300">
          {/* Task Input */}
          <div className="mb-10">
            <label htmlFor="task" className="block text-base font-semibold text-calm-text dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-calm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Your Task
            </label>
            <textarea
              id="task"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Write a blog post about productivity, Organize my workspace, Learn React basics..."
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-calm-primary focus:ring-2 focus:ring-calm-primary/20 focus:outline-none transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-calm-text dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              rows="3"
              autoFocus
            />
          </div>

          {/* Energy Level Selector */}
          <div className="mb-10">
            <label className="block text-base font-semibold text-calm-text dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-calm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How's your energy today?
            </label>
            <EnergySelector 
              selected={energyLevel}
              onChange={setEnergyLevel}
            />
            <p className="text-sm text-calm-textLight dark:text-gray-300 mt-3 text-center">
              We'll adjust step sizes based on your energy level
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Start Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleStartTask}
            disabled={!taskInput.trim() || isLoading}
            className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              {isLoading ? (
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              )}
              <span className="text-lg font-semibold">{isLoading ? 'Creating...' : 'Start Task'}</span>
            </div>
          </Button>
        </Card>

        {/* Info Footer */}
        <div className="mt-10 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-calm-textLight dark:text-gray-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">
              Smart breakdown based on your preferences
            </p>
          </div>
          <p className="text-xs text-calm-textLight dark:text-gray-400">
            Press Enter to quickly start • One step at a time approach
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
