import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { TokenDisplay } from '@/components/TokenDisplay';
import { CategoryCard } from '@/components/CategoryCard';
import { useGameStore } from '@/store/game-store';
import { useSettingsStore } from '@/store/settings-store';
import { categories } from '@/mocks/categories';

export default function CategorySelectionScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { selectedCategories, toggleCategory, startNewGame } = useGameStore();
  const { useToken, tokens } = useSettingsStore();
  
  const handleCategorySelect = (categoryId: string) => {
    toggleCategory(categoryId);
  };
  
  const handleStartGame = () => {
    if (tokens <= 0) {
      Alert.alert(
        "Not Enough Tokens",
        "You need at least 1 token to start a new game. Would you like to purchase more tokens?",
        [
          {
            text: "No",
            style: "cancel"
          },
          { 
            text: "Yes", 
            onPress: () => router.push('/store')
          }
        ]
      );
      return;
    }
    
    // Use a token
    const success = useToken();
    
    if (success) {
      startNewGame();
      router.push('/question-board');
    } else {
      Alert.alert(
        "Error",
        "Failed to use token. Please try again."
      );
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.text }]}>
            Select Categories
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Choose exactly 6 categories
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TokenDisplay />
          <View style={styles.themeButtonContainer}>
            <Button
              title=""
              onPress={toggleTheme}
              variant="outline"
              size="small"
              icon={isDark ? <Sun size={20} color={colors.text} /> : <Moon size={20} color={colors.text} />}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              isSelected={selectedCategories.includes(item.id)}
              onSelect={handleCategorySelect}
              disabled={!selectedCategories.includes(item.id) && selectedCategories.length >= 6}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={4}
          contentContainerStyle={styles.categoriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.selectionCount, { color: colors.text }]}>
          {selectedCategories.length} of 6 categories selected
        </Text>
        <Button
          title="Start Game"
          onPress={handleStartGame}
          variant="primary"
          size="large"
          disabled={selectedCategories.length !== 6}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  themeButtonContainer: {
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  categoriesList: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '600',
  }
});