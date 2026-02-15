const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};


// Health API

export const healthAPI = {
  check: () => apiRequest('/health'),
};


// User Profile API

export const userAPI = {
  getProfile: (userId) => {
    return apiRequest(`/user/profile?user_id=${userId}`);
  },

  updateProfile: (profileData) => {
    return apiRequest('/user/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getStats: (userId) => {
    return apiRequest(`/user/stats?user_id=${userId}`);
  },
};


// Tasks API

export const tasksAPI = {
  createTask: (taskData) => {
    return apiRequest('/task/create', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  getCurrentStep: (taskId) => {
    return apiRequest(`/task/current-step?task_id=${taskId}`);
  },

  markStepDone: (taskId) => {
    return apiRequest('/task/mark-done', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    });
  },
};

export default {
  health: healthAPI,
  user: userAPI,
  tasks: tasksAPI,
};
