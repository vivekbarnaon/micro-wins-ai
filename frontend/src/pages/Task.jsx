/**
 * Task Page
 * Displays one step at a time
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import StepCard from '../components/StepCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { ROUTES } from '../utils/constants';
import { calculateProgress } from '../utils/helpers';
import { tasksAPI } from '../services/api';

const Task = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Timer and break state
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [pauseStart, setPauseStart] = useState(null);
  const [paused, setPaused] = useState(false);
  const [breakActive, setBreakActive] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(300); // default 5 min break
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const breakLimit = 300; // 5 min in seconds
  const breakTimerRef = useRef();

  // Load current step on mount
  useEffect(() => {
    loadCurrentStep();
  }, []);

  // Start timer when step loads
  useEffect(() => {
    if (currentStep && currentStep.estimatedTime) {
      setTimeLeft(currentStep.estimatedTime * 60); // convert min to sec
      setTimerActive(true);
    }
  }, [currentStep]);

  // Task countdown logic
  useEffect(() => {
    if (!timerActive || paused || !timeLeft) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, paused, timeLeft]);

  // Pause logic (no reminder)
  useEffect(() => {
    if (paused) {
      setPauseStart(Date.now());
    } else {
      setPauseStart(null);
    }
  }, [paused]);

  // Break timer logic
  useEffect(() => {
    if (!breakActive) return;
    if (breakTimeLeft <= 0) {
      setShowBreakReminder(true);
      setBreakActive(false);
      return;
    }
    breakTimerRef.current = setInterval(() => {
      setBreakTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(breakTimerRef.current);
  }, [breakActive, breakTimeLeft]);

  const loadCurrentStep = async () => {
    const taskId = localStorage.getItem('currentTaskId');
    if (!taskId) {
      navigate(ROUTES.HOME);
      return;
    }

    try {
      setIsLoading(true);
      const response = await tasksAPI.getCurrentStep(taskId);
      
      if (response.completed) {
        // Task completed - go back to chat
        localStorage.removeItem('currentTaskId');
        navigate(ROUTES.HOME);
      } else {
        setCurrentStep({
          stepNumber: response.current_step_number,
          totalSteps: response.total_steps,
          description: response.step_description,
          taskTitle: response.task_name,
          estimatedTime: response.estimated_time_minutes
        });
      }
    } catch (err) {
      console.error('Failed to load step:', err);
      setError(err.message || 'Failed to load step');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = async () => {
    setTimerActive(false);
    setPaused(false);
      // Timer controls
      const handlePause = () => {
        setPaused(true);
        setTimerActive(false);
      };
      const handleResume = () => {
        setPaused(false);
        setTimerActive(true);
      };

      // Break controls
      const handleStartBreak = () => {
        setBreakActive(true);
        setShowBreakReminder(false);
        setBreakTimeLeft(breakLimit);
      };
      const handlePauseBreak = () => {
        setBreakActive(false);
      };
      const handleResumeBreak = () => {
        setBreakActive(true);
      };
    const taskId = localStorage.getItem('currentTaskId');
    if (!taskId) return;

    try {
      setIsLoading(true);
      await tasksAPI.markStepDone(taskId);
      await loadCurrentStep(); // Reload to get next step or completion
    } catch (err) {
      console.error('Failed to mark step done:', err);
      setError(err.message || 'Failed to mark step as done');
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleStartNew = () => {
    localStorage.removeItem('currentTaskId');
    navigate(ROUTES.HOME);
  };

  // Loading State
  if (isLoading && !currentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-calm-primary mb-4"></div>
          <p className="text-calm-textLight">Loading your task...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !currentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 flex items-center justify-center px-4">
        <Card padding="large" className="max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-calm-text mb-2">Oops!</h2>
          <p className="text-calm-textLight mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
            Go Back Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentStep) return null;

  const progress = calculateProgress(currentStep.stepNumber, currentStep.totalSteps);
  const isLastStep = currentStep.stepNumber === currentStep.totalSteps;

  // Format seconds as mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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

        {/* Progress Bar & Timer */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <ProgressBar progress={progress} />
          <p className="text-center text-sm text-calm-textLight mt-3">
            Step {currentStep.stepNumber} of {currentStep.totalSteps} • {progress}% complete
            {currentStep.estimatedTime && ` • ~${currentStep.estimatedTime} min`}
          </p>
          {/* Task Timer */}
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-lg bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
              {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
            </span>
            {timerActive && !paused && (
              <Button size="small" variant="secondary" onClick={handlePause}>Pause</Button>
            )}
            {paused && (
              <Button size="small" variant="primary" onClick={handleResume}>Resume</Button>
            )}
          </div>
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

        {/* Action Buttons & Break Timer */}
        <div className="space-y-4">
                    {/* Break Timer UI */}
                    <div className="flex items-center gap-3 mt-4">
                      <Button size="small" variant="secondary" onClick={handleStartBreak} disabled={breakActive}>Start Break</Button>
                      {breakActive && (
                        <>
                          <span className="font-mono text-base bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded">
                            {formatTime(breakTimeLeft)}
                          </span>
                          <Button size="small" variant="secondary" onClick={handlePauseBreak}>Pause</Button>
                          <Button size="small" variant="primary" onClick={handleResumeBreak}>Resume</Button>
                        </>
                      )}
                    </div>

                  {/* Break Overdue Reminder */}
                  {showBreakReminder && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm text-center animate-fade-in">
                        <h2 className="text-xl font-bold mb-2 text-calm-text">Break Limit Exceeded</h2>
                        <p className="text-calm-textLight mb-4">Your break exceeded the allowed time.<br/>Let's get back to your task for best results!</p>
                        <Button variant="primary" onClick={() => setShowBreakReminder(false)}>OK</Button>
                      </div>
                    </div>
                  )}
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
          <Card className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-calm-text dark:text-white font-medium mb-1">
                  Take your time - Estimated: {currentStep.estimatedTime} min
                </p>
                <p className="text-xs text-calm-textLight dark:text-gray-300">
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
