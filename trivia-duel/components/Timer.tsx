import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

interface TimerProps {
  isRunning: boolean;
}

export const Timer = ({ isRunning }: TimerProps) => {
  const { colors, isDark } = useTheme();
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: colors.card }
      ]}
    >
      <Clock size={18} color={colors.primary} />
      <Text style={[styles.timerText, { color: colors.text }]}>
        {formatTime()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  }
});