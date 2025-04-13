import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Coins, Plus } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useSettingsStore } from '@/store/settings-store';
import { router } from 'expo-router';

export const TokenDisplay = () => {
  const { colors, isDark } = useTheme();
  const { tokens } = useSettingsStore();
  
  const handlePressAdd = () => {
    router.push('/store');
  };
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.tokenContainer, 
          { backgroundColor: colors.card }
        ]}
      >
        <Coins size={18} color={colors.primary} />
        <Text style={[styles.tokenText, { color: colors.text }]}>
          {tokens}
        </Text>
      </View>
      
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          { 
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1
          }
        ]}
        onPress={handlePressAdd}
      >
        <Plus size={18} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tokenText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
});