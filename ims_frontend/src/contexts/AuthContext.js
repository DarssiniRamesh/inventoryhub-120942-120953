import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiService.setAuthToken(token);
      // Verify token validity
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await apiService.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      apiService.setAuthToken(null);
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const login = async (username, password) => {
    try {
      const response = await apiService.post('/auth/login', { username, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      apiService.setAuthToken(access_token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    localStorage.removeItem('token');
    apiService.setAuthToken(null);
    setUser(null);
  };

  // PUBLIC_INTERFACE
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // PUBLIC_INTERFACE
  const isManager = () => {
    return user?.role === 'manager' || user?.role === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isManager,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
