import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  disabled?: boolean;
}

export const CategoryCard = ({ 
  category, 
  isSelected, 
  onSelect,
  disabled = false
}: CategoryCardProps) => {
  const { colors, isDark } = useTheme();
  
  const handlePress = () => {
    if (!disabled) {
      onSelect(category.id);
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          opacity: pressed || disabled ? 0.8 : 1
        }
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: category.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
            <Check size={16} color="white" />
          </View>
        )}
      </View>
      <Text 
        style={[
          styles.name, 
          { color: colors.text }
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    margin: 8,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  }
});