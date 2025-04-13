import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  toggleDarkMode: () => void;
  addTokens: (amount: number) => void;
  useToken: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      tokens: 5, // Start with 5 tokens
      
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      
      addTokens: (amount: number) => set(state => ({ 
        tokens: state.tokens + amount 
      })),
      
      useToken: () => {
        const { tokens } = get();
        if (tokens <= 0) return false;
        
        set(state => ({ tokens: state.tokens - 1 }));
        return true;
      }
    }),
    {
      name: 'trivia-settings',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);