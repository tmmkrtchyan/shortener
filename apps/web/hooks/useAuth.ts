'use client';

import { useState, useEffect } from 'react';
import { ApiService, LoginResponse, User } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const result = await ApiService.getProfile();
      if (result.data) {
        setUser(result.data);
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const result = await ApiService.login(username);
      if (result.data) {
        localStorage.setItem('auth_token', result.data.access_token);
        setUser(result.data.user);
        return true;
      } else {
        setError(result.error || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setError(null);
  };

  const continueAsGuest = () => {
    setUser(null);
    setError(null);
    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    continueAsGuest,
    isAuthenticated: !!user,
  };
}
