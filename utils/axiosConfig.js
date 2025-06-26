import axios from 'axios';

// Use environment variable for API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling (e.g., redirect on 401)
/*
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request, potentially token expired or invalid.');
      // Redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // Avoid using window.location.href directly inside interceptor in React
      // Consider using history object or a global state/event emitter to trigger navigation in your app
      // Example (requires setting up history): history.push('/login');
      // For now, message user might be sufficient if routing handles redirects
       // message.error("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);
*/

export default api;