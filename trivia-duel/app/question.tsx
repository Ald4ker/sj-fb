import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { Timer } from '@/components/Timer';
import { useGameStore } from '@/store/game-store';
import { categories } from '@/mocks/categories';

export default function QuestionScreen() {
  const { colors, isDark } = useTheme();
  const { currentQuestion, wagerActive, wagerTargetTeam, teams } = useGameStore();
  const [timerRunning, setTimerRunning] = useState(true);
  
  if (!currentQuestion) {
    router.back();
    return null;
  }
  
  // Get category info
  const category = categories.find(cat => cat.id === currentQuestion.categoryId);
  
  const handleShowAnswer = () => {
    router.push('/answer');
  };
  
  // If there's a wager active, show which team should answer
  const renderWagerInfo = () => {
    if (wagerActive && wagerTargetTeam) {
      const targetTeam = teams.find(team => team.id === wagerTargetTeam);
      
      return (
        <View 
          style={[
            styles.wagerContainer, 
            { backgroundColor: colors.warning }
          ]}
        >
          <Text style={styles.wagerText}>
            Wager Question: Only {targetTeam?.name} can answer this question
          </Text>
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryName, { color: colors.text }]}>
            {category?.name}
          </Text>
          <Text style={[styles.pointsValue, { color: colors.primary }]}>
            {currentQuestion.points} points
          </Text>
        </View>
        
        <Timer isRunning={timerRunning} />
      </View>
      
      {renderWagerInfo()}
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentQuestion.image && (
          <Image
            source={{ uri: currentQuestion.image }}
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}
        
        <View 
          style={[
            styles.questionCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.questionText, { color: colors.text }]}>
            {currentQuestion.text}
          </Text>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Button
          title="Show Answer"
          onPress={handleShowAnswer}
          variant="primary"
          size="large"
          fullWidth
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
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  wagerContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  wagerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  questionCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  }
});