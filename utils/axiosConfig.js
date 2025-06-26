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
    // Do something with request error
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling (e.g., redirect on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request, potentially token expired or invalid. Redirecting to login.');
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // Redirect to login page - using window.location.href to force a full page reload
      // which will re-evaluate the auth state in App.jsx
      window.location.href = '/login';
      // Return a rejected promise to prevent further processing of the error in the component
      return Promise.reject(error);
    }
    // For other errors, just pass them through
    return Promise.reject(error);
  }
);


export default api;