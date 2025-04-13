import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Category } from '@/types';
import { QuestionCylinder } from '@/components/QuestionCylinder';
import { getQuestionsByCategory } from '@/mocks/questions';
import { Question } from '@/types';

interface CategoryBoardProps {
  category: Category;
  answeredQuestions: string[];
  onSelectQuestion: (question: Question) => void;
}

export const CategoryBoard = ({ 
  category, 
  answeredQuestions,
  onSelectQuestion
}: CategoryBoardProps) => {
  const { colors, isDark } = useTheme();
  
  // Get questions for this category
  const questions = getQuestionsByCategory(category.id);
  
  // Sort questions by difficulty/points
  const sortedQuestions = [...questions].sort((a, b) => a.points - b.points);
  
  // Split into left and right sides (3 on each side)
  const leftQuestions = sortedQuestions.slice(0, 3);
  const rightQuestions = sortedQuestions.slice(3, 6);
  
  return (
    <View style={styles.container}>
      <View style={[styles.categoryCard, { backgroundColor: colors.card }]}>
        <Image 
          source={{ uri: category.image }} 
          style={styles.categoryImage} 
          resizeMode="cover"
        />
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {category.name}
        </Text>
      </View>
      
      <View style={styles.questionsContainer}>
        <View style={styles.leftQuestions}>
          {leftQuestions.map(question => (
            <QuestionCylinder
              key={question.id}
              question={question}
              isAnswered={answeredQuestions.includes(question.id)}
              onSelect={onSelectQuestion}
              position="left"
            />
          ))}
        </View>
        
        <View style={styles.rightQuestions}>
          {rightQuestions.map(question => (
            <QuestionCylinder
              key={question.id}
              question={question}
              isAnswered={answeredQuestions.includes(question.id)}
              onSelect={onSelectQuestion}
              position="right"
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 16,
  },
  categoryCard: {
    width: 110,
    height: 110,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 80,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  questionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  leftQuestions: {
    alignItems: 'flex-end',
  },
  rightQuestions: {
    alignItems: 'flex-start',
  }
});