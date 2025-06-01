'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backend } from '@/declarations/backend';
import { generateSalt, hashPasswordWithSalt, comparePassword } from '@/app/utils/crypto';
import { User } from '@/declarations/backend/backend.did';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    validateSession();
  }, []);

  const clearError = () => setError(null);

  const validateSession = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await backend.validateSession(token);
      if (userData[0]) {
        setUser(userData[0]);
      } else {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      setError('Session validation failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);

      const response = await backend.getPasswordAndSalt(email)

      if (!response[0]) {
        const errorMessage = "Email does not exist"
        setError(errorMessage);
        return
      }

      const { password: hashedPassword } = response[0]
      const correctPassword = await comparePassword(password, hashedPassword)

      if (!correctPassword) {
        const errorMessage = "Invalid email or password"
        setError(errorMessage);
        return
      }

      const credentials = { email, password: hashedPassword };

      const result = await backend.login(credentials);

      if ('ok' in result) {
        const { user: userData, sessionToken } = result.ok;

        localStorage.setItem('sessionToken', sessionToken);
        const userToStore = {
          ...userData,
          createdAt: userData.createdAt.toString(),
        };

        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userData);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      clearError();
      setLoading(true);

      const salt = await generateSalt();
      const hashedPassword = await hashPasswordWithSalt(password, salt);

      const result = await backend.register(email, hashedPassword, salt, username);

      if ('ok' in result) {
        await login(email, password);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('Registration error:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      clearError();
      const token = localStorage.getItem('sessionToken');
      if (token) {
        await backend.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout failures - still clear local state
    } finally {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};