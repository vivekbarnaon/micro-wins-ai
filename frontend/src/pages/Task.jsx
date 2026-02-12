/**
 * Task Page
 * Displays one step at a time
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import StepCard from '../components/StepCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { ROUTES } from '../utils/constants';
import { calculateProgress } from '../utils/helpers';

const Task = () => {
  const navigate = useNavigate();
  
  // Mock data - will be replaced with API call
  const [currentStep, setCurrentStep] = useState({
    stepNumber: 1,
    totalSteps: 5,
    description: "Open your code editor and create a new project folder",
    taskTitle: "Build a simple website"
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = calculateProgress(currentStep.stepNumber, currentStep.totalSteps);
  const isLastStep = currentStep.stepNumber === currentStep.totalSteps;

  const handleDone = () => {
    if (isLastStep) {
      // Show completion screen
      setIsCompleted(true);
    } else {
      // Move to next step
      setCurrentStep({
        ...currentStep,
        stepNumber: currentStep.stepNumber + 1,
        description: `Step ${currentStep.stepNumber + 1} description would come from API`
      });
    }
  };
  const handleBack = () => {
    navigate(ROUTES.HOME);
  };
  // Completion Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900 flex items-center justify-center px-4 py-8 transition-colors duration-300 relative overflow-hidden">
        <AnimatedBackground variant="success" />
        <div className="w-full max-w-2xl text-center animate-fade-in">
          {/* Success Animation Area */}
          <div className="mb-8 animate-scale-in">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-800/50 dark:to-teal-800/50 rounded-full mb-6 shadow-2xl animate-bounce">
              <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Completion Message */}
          <Card padding="large" className="shadow-2xl border border-white/30 dark:border-gray-700/30 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 mb-8 animate-slide-up hover:shadow-3xl transition-all duration-300">
            <h1 className="text-4xl font-bold text-calm-text dark:text-white mb-4">
              Task Completed! 🎉
            </h1>
            <p className="text-xl text-calm-textLight mb-6">
              Nice work. You completed all steps.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-6">
              <p className="text-calm-text dark:text-white font-semibold mb-2">
                {currentStep.taskTitle}
              </p>
              <p className="text-sm text-calm-textLight dark:text-gray-300">
                ✓ {currentStep.totalSteps} steps completed
              </p>
            </div>
            <p className="text-sm text-calm-textLight dark:text-gray-300 italic">
              "Progress is progress, no matter how small. You did great today."
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleStartNew}
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-lg font-semibold">Start New Task</span>
              </div>
            </Button>

            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => navigate(ROUTES.PROFILE)}
              className="transition-all duration-300"
            >
              View Profile
            </Button>
          </div>

          {/* Encouragement Footer */}
          <div className="mt-8">
            <p className="text-sm text-calm-textLight">
              Take a moment to celebrate this win! 🌟
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Task Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900 flex items-center justify-center px-4 py-8 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground variant="default" />
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header with Task Title */}
        <div className="text-center mb-8 animate-slide-up">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-calm-textLight hover:text-calm-text transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tasks
          </button>
          <h1 className="text-3xl font-bold text-calm-text dark:text-white mb-2">
            {currentStep.taskTitle}
          </h1>
          <p className="text-calm-textLight">
            One step at a time, you've got this! 💪
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar progress={progress} />
          <p className="text-center text-sm text-calm-textLight mt-3">
            Step {currentStep.stepNumber} of {currentStep.totalSteps} • {progress}% complete
          </p>
        </div>

        {/* Current Step Card */}
        <Card padding="large" className="shadow-2xl border border-white/30 dark:border-gray-700/30 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 mb-8 animate-slide-up hover:shadow-3xl transition-all duration-300">
          <StepCard
            stepNumber={currentStep.stepNumber}
            totalSteps={currentStep.totalSteps}
            description={currentStep.description}
            progress={progress}
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            variant="success"
            size="large"
            fullWidth
            onClick={handleDone}
            className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              {isLastStep ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-semibold">Complete Task</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold">DONE - Next Step</span>
                </>
              )}
            </div>
          </Button>

          {/* Helper Tips */}
          <Card className="bg-blue-50/50 border border-blue-100">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-calm-text font-medium mb-1">
                  Take your time
                </p>
                <p className="text-xs text-calm-textLight">
                  Focus on this one step. Complete it at your own pace before moving forward.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Task;
