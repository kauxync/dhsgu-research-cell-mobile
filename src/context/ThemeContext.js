import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';

const ThemeContext = createContext(null);

export const THEME_PALETTES = {
  dark: {
    isDark: true,
    bg: '#07090E',
    background: '#07090E',
    surface: '#111827',
    surfaceElevated: '#1F2937',
    surfaceCard: '#131B2E',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    textPrimary: '#F9FAFB',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textLight: '#E2E8F0',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.10)',
    tabBarBg: '#0C111D',
    tabBarBorder: 'rgba(255, 255, 255, 0.08)',
    cardGlow: 'rgba(0, 0, 0, 0.35)',
    statusBarStyle: 'light',
  },
  light: {
    isDark: false,
    bg: '#F8FAFC',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    surfaceCard: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.08)',
    borderLight: 'rgba(0, 0, 0, 0.12)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textLight: '#1E293B',
    inputBg: '#F1F5F9',
    inputBorder: 'rgba(0, 0, 0, 0.12)',
    tabBarBg: '#FFFFFF',
    tabBarBorder: 'rgba(0, 0, 0, 0.08)',
    cardGlow: 'rgba(0, 0, 0, 0.06)',
    statusBarStyle: 'dark',
  }
};

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('dark'); // 'dark' | 'light' | 'system'

  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem('@dhsgsu_theme_mode');
        if (saved) {
          setThemeModeState(saved);
        }
      } catch (e) {
        console.warn('Error loading theme preference', e);
      }
    }
    loadTheme();
  }, []);

  const setThemeMode = async (mode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('@dhsgsu_theme_mode', mode);
    } catch (e) {
      console.warn('Error saving theme preference', e);
    }
  };

  const activeMode = themeMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : themeMode;
  const theme = THEME_PALETTES[activeMode] || THEME_PALETTES.dark;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        isDark: theme.isDark,
        theme,
        colors: {
          ...COLORS,
          ...theme,
        }
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
