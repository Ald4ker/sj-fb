import React from 'react';
import { StyleSheet, Text, Pressable, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false
}: ButtonProps) => {
  const { colors, isDark } = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled) return isDark ? '#333' : '#ccc';
    
    switch (variant) {
      case 'primary':
        return '#3B82F6'; // A slightly darker shade of the assumed primary color
      case 'outline':        
        return 'transparent';
      case 'danger':
        return colors.error;
      default:
        return colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return isDark ? '#888' : '#666';
    
    if (variant === 'outline' || variant === 'danger') {
      return colors.primary;
    }
    
    return 'white';
  };
  
  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? (isDark ? '#333' : '#ccc') : colors.primary;
    }
    return 'transparent';
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 20 };
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 16;
      default:
        return 16;
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: pressed ? 0.8 : 1,
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto'
        }
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={getTextColor()} 
            style={styles.loader} 
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text 
              style={[
                styles.text, 
                { 
                  color: getTextColor(),
                  fontSize: getFontSize()
                }
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    marginRight: 8,
  },
  iconContainer: {
    marginRight: 8,
  }
});