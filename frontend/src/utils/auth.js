import { message } from 'antd';

// Token management
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// User management
export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Authentication check
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Role-based access control
export const hasRole = (requiredRole) => {
  const user = getUser();
  if (!user) return false;
  
  const roles = {
    [USER_ROLES.ADMIN]: 4,
    [USER_ROLES.MANAGER]: 3,
    [USER_ROLES.AGENT]: 2,
    [USER_ROLES.USER]: 1
  };

  return roles[user.role] >= roles[requiredRole];
};

// Error handling
export const handleAuthError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        message.error('Session expired. Please login again.');
        setAuthToken(null);
        setUser(null);
        window.location.href = '/login';
        break;
      case 403:
        message.error('You do not have permission to perform this action.');
        break;
      case 404:
        message.error('Resource not found.');
        break;
      case 500:
        message.error('Server error. Please try again later.');
        break;
      default:
        message.error(data.message || 'An error occurred. Please try again.');
    }
  } else {
    message.error('Network error. Please check your connection.');
  }
};

// Import constants
import { USER_ROLES } from './constants'; 