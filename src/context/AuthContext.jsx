import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '@utils/api/axios';


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        setAuthCheckCompleted(true);
        return;
      }

      try {
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setAuthCheckCompleted(true);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials, redirectCallback) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await axiosInstance.post('/auth/login', credentials);
      
      // Store token and user data on successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Store rememberMe preference if enabled
        if (credentials.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      
      setIsAuthenticated(true);
      
      if (typeof redirectCallback === 'function') {
        redirectCallback();
      }
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to login. Please try again.');
      } else {
        setError('Network error or server is unavailable. Please try again later.');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const isRememberMeEnabled = useCallback(() => {
    return localStorage.getItem('rememberMe') === 'true';
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    setError,
    login,
    logout,
    isRememberMeEnabled,
    authCheckCompleted
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;