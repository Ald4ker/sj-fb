import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Question } from '@/types';

interface QuestionCylinderProps {
  question: Question;
  isAnswered: boolean;
  onSelect: (question: Question) => void;
  position: 'left' | 'right';
}

export const QuestionCylinder = ({ 
  question, 
  isAnswered, 
  onSelect,
  position
}: QuestionCylinderProps) => {
  const { colors, isDark } = useTheme();
  
  const getDifficultyColor = () => {
    if (isAnswered) return colors.cylinder.disabled;
    
    switch (question.difficulty) {
      case 'easy':
        return colors.cylinder.easy;
      case 'medium':
        return colors.cylinder.medium;
      case 'hard':
        return colors.cylinder.hard;
      default:
        return colors.cylinder.easy;
    }
  };
  
  const handlePress = () => {
    onSelect(question);
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        position === 'left' ? styles.leftCylinder : styles.rightCylinder,
        {
          backgroundColor: getDifficultyColor(),
          opacity: pressed ? 0.8 : 1
        }
      ]}
      onPress={handlePress}
    >
      <View style={styles.cylinderTop} />
      <View style={styles.cylinderBody}>
        <Text style={styles.pointsText}>
          {question.points}
        </Text>
      </View>
      <View style={styles.cylinderBottom} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 40,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCylinder: {
    marginRight: 20,
  },
  rightCylinder: {
    marginLeft: 20,
  },
  cylinderTop: {
    width: 40,
    height: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cylinderBody: {
    width: 40,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cylinderBottom: {
    width: 40,
    height: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  pointsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});