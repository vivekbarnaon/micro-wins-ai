
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI, userAPI } from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';
import StepCard from '../components/StepCard';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';


const HomeChat = () => {
    // Step/task state
    const [currentStep, setCurrentStep] = useState(null);
    const [stepLoading, setStepLoading] = useState(false);
    const [stepError, setStepError] = useState('');
    const [stepProgress, setStepProgress] = useState({ stepNumber: 0, totalSteps: 0 });
  const { user } = useAuth();
  const [taskInput, setTaskInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [energyMode, setEnergyMode] = useState('medium');
  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userPreferences')) || {};
    } catch {
      return {};
    }
  });

  // Fetch profile from backend on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const profile = await userAPI.getProfile(user.uid);
        if (profile && profile.exists) {
          // Merge backend profile with local preferences
          const mergedPrefs = {
            ...userPreferences,
            stepSize: profile.step_granularity || userPreferences.stepSize,
            fontType: profile.font_preference || userPreferences.fontType,
            // Add more fields as needed
          };
          setUserPreferences(mergedPrefs);
          localStorage.setItem('userPreferences', JSON.stringify(mergedPrefs));
        }
      } catch (err) {
        // Optionally show error or retry
        console.error('Failed to fetch profile from backend:', err);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user?.uid]);
    // Listen for changes to userPreferences in localStorage (profile setup)
    useEffect(() => {
      const handleStorage = (e) => {
        if (e.key === 'userPreferences') {
          try {
            setUserPreferences(JSON.parse(e.newValue) || {});
          } catch {
            setUserPreferences({});
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Also update userPreferences if ProfileSetup saves in this tab
    useEffect(() => {
      const interval = setInterval(() => {
        try {
          const prefs = JSON.parse(localStorage.getItem('userPreferences')) || {};
          setUserPreferences((prev) => JSON.stringify(prev) !== JSON.stringify(prefs) ? prefs : prev);
        } catch {}
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  const [useVoice, setUseVoice] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 640);

  // Responsive sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Check if there's an active task
  useEffect(() => {
    const taskId = localStorage.getItem('currentTaskId');
    if (taskId) {
      setConversation([{
        type: 'assistant',
        content: '👋 Welcome back! You have an active task. Would you like to continue or start a new one?',
        timestamp: new Date()
      }]);
    } else {
      setConversation([{
        type: 'assistant',
        content: '👋 Hi! I\'m here to help you break down tasks into manageable steps. What would you like to accomplish today?',
        timestamp: new Date()
      }]);
    }
  }, []);

  const saveToHistory = (taskTitle) => {
    const historyItem = {
      id: Date.now(),
      title: taskTitle,
      timestamp: new Date().toISOString(),
      energyMode: energyMode,
    };
    const updatedHistory = [historyItem, ...chatHistory].slice(0, 20);
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTaskInput(transcript);
      setUseVoice(false);
    };

    recognition.onerror = () => {
      setUseVoice(false);
      alert('Voice recognition failed. Please try again.');
    };

    recognition.onend = () => {
      setUseVoice(false);
    };

    recognition.start();
    setUseVoice(true);
  };


  // Start a new task and fetch the first step
  const handleStartTask = async () => {
    if (!taskInput.trim() || isLoading) return;
    const userMessage = taskInput.trim();
    setTaskInput('');
    setConversation(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setConversation(prev => [...prev, {
      type: 'assistant',
      content: 'Creating your task breakdown...',
      isLoading: true,
      timestamp: new Date()
    }]);
    try {
      setIsLoading(true);
      setStepLoading(true);
      setCurrentStep(null);
      setStepError('');
      const prefs = userPreferences;
      const response = await tasksAPI.createTask({
        user_id: user?.uid || 'guest',
        task: userMessage,
        energy_level: energyMode,
        neurodivergence: prefs.neurodivergence || 'ADHD',
        step_granularity: prefs.stepSize || 'normal',
        break_interval_minutes: prefs.breakInterval || 25,
        fatigue_triggers: prefs.fatigues || ['long paragraphs'],
        ai_tone: prefs.aiTone || ['calm'],
        response_verbosity: prefs.verbosity || 3
      });
      saveToHistory(userMessage);
      setConversation(prev => prev.filter(msg => !msg.isLoading));
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: `✅ Great! I've broken down "${userMessage}" into steps. Let's start!`,
        timestamp: new Date()
      }]);
      localStorage.setItem('currentTaskId', response.task_id);
      // Fetch first step
      await fetchAndShowStep(response.task_id);
    } catch (err) {
      console.error('Failed to create task:', err);
      setConversation(prev => prev.filter(msg => !msg.isLoading));
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: `❌ Sorry, I couldn't create that task. ${err.message || 'Please try again.'}`,
        timestamp: new Date()
      }]);
      setStepError(err.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
      setStepLoading(false);
    }
  };

  // Fetch and display the current step
  const fetchAndShowStep = async (taskId) => {
    setStepLoading(true);
    setStepError('');
    try {
      const response = await tasksAPI.getCurrentStep(taskId);
      if (response.completed) {
        localStorage.removeItem('currentTaskId');
        setCurrentStep(null);
        setStepProgress({ stepNumber: 0, totalSteps: 0 });
        setConversation(prev => [...prev, {
          type: 'assistant',
          content: '🎉 All steps are done! You can start a new task anytime.',
          timestamp: new Date()
        }]);
        return;
      }
      setCurrentStep({
        stepNumber: response.current_step_number,
        totalSteps: response.total_steps,
        description: response.step_description,
        taskTitle: response.task_name,
        estimatedTime: response.estimated_time_minutes
      });
      setStepProgress({ stepNumber: response.current_step_number, totalSteps: response.total_steps });
      // Show step as chat message
      setConversation(prev => [...prev,
        {
          type: 'step',
          stepNumber: response.current_step_number,
          totalSteps: response.total_steps,
          description: response.step_description,
          estimatedTime: response.estimated_time_minutes,
          taskTitle: response.task_name,
          timestamp: new Date()
        },
        {
          type: 'assistant',
          content: `Take your time - Estimated: ${response.estimated_time_minutes} min\nFocus on this one step: ${response.step_description}\nComplete it at your own pace before moving forward.`,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      setStepError(err.message || 'Failed to load step');
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: `❌ Failed to load step. ${err.message || ''}`,
        timestamp: new Date()
      }]);
    } finally {
      setStepLoading(false);
    }
  };

  // Mark step as done and fetch next
  const handleStepDone = async () => {
    const taskId = localStorage.getItem('currentTaskId');
    if (!taskId) return;
    setStepLoading(true);
    try {
      await tasksAPI.markStepDone(taskId);
      await fetchAndShowStep(taskId);
    } catch (err) {
      setStepError(err.message || 'Failed to mark step as done');
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: `❌ Failed to mark step as done. ${err.message || ''}`,
        timestamp: new Date()
      }]);
    } finally {
      setStepLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStartTask();
    }
  };

  const handleContinueTask = () => {
    navigate(ROUTES.TASK);
  };

  const loadHistoryItem = (item) => {
    setTaskInput(item.title);
    setEnergyMode(item.energyMode || 'medium');
  };

  const handleNewChat = () => {
    setTaskInput('');
    setConversation([{
      type: 'assistant',
      content: '👋 Hi! I\'m here to help you break down tasks into manageable steps. What would you like to accomplish today?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex transition-colors duration-300 relative">
      <AnimatedBackground variant="calm" />



      {/* Main Content without sidebar */}
      <div className="flex-1 flex flex-col transition-all duration-300 h-screen ml-0">
        <div className="flex-1 relative z-10 w-full flex flex-col">
          <div className="max-w-4xl w-full mx-auto flex flex-col px-4 py-6 h-full">
            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 mb-6 pb-4" style={{ minHeight: 0, maxHeight: 'calc(100vh - 180px)' }}>
              {conversation.map((message, index) => {
                if (message.type === 'step') {
                  return (
                    <div key={index} className="flex justify-start animate-fade-in">
                      <div className="max-w-[80%] w-full">
                        <StepCard
                          stepNumber={message.stepNumber}
                          totalSteps={message.totalSteps}
                          stepText={message.description}
                          showProgress={true}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleStepDone}
                            disabled={stepLoading}
                            className={`px-5 py-2 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 shadow transition-all ${stepLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {message.stepNumber === message.totalSteps ? 'Complete Task' : 'Done - Next Step'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.type === 'user' 
                        ? 'bg-calm-primary text-white' 
                        : 'bg-white dark:bg-gray-800 text-calm-text dark:text-white shadow-lg border border-gray-200 dark:border-gray-700'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.isLoading && (
                        <div className="flex gap-1 mt-2">
                          <div className="w-2 h-2 bg-calm-primary dark:bg-calm-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-calm-primary dark:bg-calm-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-calm-primary dark:bg-calm-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
              {/* Energy Mode Selector */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Energy:</span>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((mode) => (
                    <button 
                      key={mode} 
                      onClick={() => setEnergyMode(mode)} 
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        energyMode === mode 
                          ? mode === 'low' 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : mode === 'high' 
                            ? 'bg-green-500 text-white shadow-md' 
                            : 'bg-yellow-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Field */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea 
                    value={taskInput} 
                    onChange={(e) => setTaskInput(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    placeholder="What would you like to accomplish? (Enter to send, Shift+Enter for new line)" 
                    disabled={isLoading} 
                    className="w-full bg-transparent text-calm-text dark:text-white placeholder-calm-textLight dark:placeholder-gray-400 focus:outline-none resize-none min-h-[60px] max-h-[150px]" 
                    rows={2} 
                  />
                </div>
                
                {/* Voice Button */}
                <button 
                  onClick={handleVoiceInput} 
                  disabled={useVoice || isLoading} 
                  className={`p-3 rounded-xl transition-all ${
                    useVoice 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`} 
                  title="Voice Input"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Send Button */}
                <button 
                  onClick={handleStartTask} 
                  disabled={!taskInput.trim() || isLoading} 
                  className={`p-3 rounded-xl transition-all ${
                    taskInput.trim() && !isLoading 
                      ? 'bg-calm-primary text-white hover:bg-calm-primaryDark shadow-lg hover:shadow-xl' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeChat;
