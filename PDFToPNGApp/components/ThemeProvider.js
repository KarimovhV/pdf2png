import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const colors = {
  light: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#374151',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    purple: '#8b5cf6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    primary: '#4338ca',
    secondary: '#6366f1',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#475569',
    success: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
    purple: '#7c3aed',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(0, 0, 0, 0.15)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
    
    // System theme change listener
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only auto-switch if user hasn't manually set a preference
      AsyncStorage.getItem('userThemePreference').then((preference) => {
        if (!preference) {
          setIsDarkMode(colorScheme === 'dark');
        }
      });
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // Use system preference if no saved preference
        const systemTheme = Appearance.getColorScheme();
        setIsDarkMode(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system theme
      const systemTheme = Appearance.getColorScheme();
      setIsDarkMode(systemTheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('userThemePreference', 'true');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  const value = {
    isDarkMode,
    theme,
    colors,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;