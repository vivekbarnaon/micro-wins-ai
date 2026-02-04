/**
 * Home Page
 * Task input and energy selection
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import EnergySelector from '../components/EnergySelector';
import Logo from '../components/Logo';
import { ROUTES, ENERGY_LEVELS } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();
  const [taskInput, setTaskInput] = useState('');
  const [energyLevel, setEnergyLevel] = useState(ENERGY_LEVELS.MEDIUM);

  const handleStartTask = () => {
    if (!taskInput.trim()) return;
    
    // TODO: Create task via API
    // For now, navigate to task page
    navigate(ROUTES.TASK);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && taskInput.trim()) {
      handleStartTask();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6 transform hover:scale-105 transition-transform duration-300">
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
        <Card padding="large" className="shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
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

          {/* Start Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleStartTask}
            disabled={!taskInput.trim()}
            className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-lg font-semibold">Start Breaking It Down</span>
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
