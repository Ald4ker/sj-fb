import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settings-store';
import colors from '@/constants/colors';

type ThemeContextType = {
  isDark: boolean;
  colors: typeof colors.light | typeof colors.dark;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const { darkMode, toggleDarkMode } = useSettingsStore();
  
  // Use user preference, fallback to system preference
  const isDark = darkMode;
  
  const themeColors = isDark ? colors.dark : colors.light;
  
  const value = {
    isDark,
    colors: themeColors,
    toggleTheme: toggleDarkMode
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};