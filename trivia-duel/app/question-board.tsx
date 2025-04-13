import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView,
  Pressable,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Moon, Sun, Shuffle, ArrowLeft, Trophy } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { TokenDisplay } from '@/components/TokenDisplay';
import { TeamScoreCard } from '@/components/TeamScoreCard';
import { CategoryBoard } from '@/components/CategoryBoard';
import { Timer } from '@/components/Timer';
import { useGameStore } from '@/store/game-store';
import { categories } from '@/mocks/categories';
import { getQuestionsByCategory } from '@/mocks/questions';
import { Question } from '@/types';

export default function QuestionBoardScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { 
    teams, 
    selectedCategories, 
    answeredQuestions, 
    setCurrentQuestion,
    getRandomUnansweredQuestion,
    wagerActive,
    wagerTeam,
    wagerTargetTeam,
    completeGame
  } = useGameStore();
  
  // Get selected categories data
  const selectedCategoriesData = categories.filter(
    cat => selectedCategories.includes(cat.id)
  );
  
  // Calculate total questions and answered questions
  const totalQuestions = selectedCategories.length * 6; // 6 questions per category
  const answeredCount = answeredQuestions.length;
  
  const handleSelectQuestion = (question: Question) => {
    setCurrentQuestion(question);
    router.push('/question');
  };
  
  const handleRandomQuestion = () => {
    const randomQuestion = getRandomUnansweredQuestion();
    
    if (randomQuestion) {
      setCurrentQuestion(randomQuestion);
      router.push('/question');
    } else {
      Alert.alert(
        "No Questions Left",
        "All questions have been answered!"
      );
    }
  };
  
  const handleEndGame = () => {
    completeGame();
    router.push('/game-over');
  };
  
  const handleGoBack = () => {
    Alert.alert(
      "Leave Game",
      "Are you sure you want to leave the current game? Your progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Leave", 
          onPress: () => router.back()
        }
      ]
    );
  };
  
  // Check if all questions are answered
  useEffect(() => {
    if (answeredCount > 0 && answeredCount === totalQuestions) {
      Alert.alert(
        "All Questions Answered",
        "You've answered all the questions! Would you like to end the game?",
        [
          {
            text: "Continue Playing",
            style: "cancel"
          },
          { 
            text: "End Game", 
            onPress: handleEndGame
          }
        ]
      );
    }
  }, [answeredCount, totalQuestions]);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.8 : 1
              }
            ]}
            onPress={handleGoBack}
          >
            <ArrowLeft size={20} color={colors.text} />
          </Pressable>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Question Board
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <Timer isRunning={true} />
          
          <View style={styles.tokenContainer}>
            <TokenDisplay />
          </View>
          
          <Pressable
            style={({ pressed }) => [
              styles.themeToggle,
              { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.8 : 1
              }
            ]}
            onPress={toggleTheme}
          >
            {isDark ? (
              <Sun size={20} color={colors.text} />
            ) : (
              <Moon size={20} color={colors.text} />
            )}
          </Pressable>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.boardContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {selectedCategoriesData.map((category) => (
              <CategoryBoard
                key={category.id}
                category={category}
                answeredQuestions={answeredQuestions}
                onSelectQuestion={handleSelectQuestion}
              />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {answeredCount} / {totalQuestions} Questions Answered
          </Text>
          
          {wagerActive && wagerTeam && wagerTargetTeam && (
            <View 
              style={[
                styles.wagerAlert, 
                { backgroundColor: colors.warning }
              ]}
            >
              <Text style={styles.wagerText}>
                Wager Active: {teams.find(t => t.id === wagerTeam)?.name} has wagered on {teams.find(t => t.id === wagerTargetTeam)?.name}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.teamsContainer}>
        {teams.map((team) => (
          <TeamScoreCard 
            key={team.id} 
            team={team}
            isActive={wagerActive && wagerTargetTeam === team.id}
            compact={true}
          />
        ))}
      </View>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Button
          title="Random Question"
          onPress={handleRandomQuestion}
          variant="primary"
          size="large"
          icon={<Shuffle size={20} color="white" />}
          disabled={answeredCount === totalQuestions}
        />
        
        <Button
          title="End Game"
          onPress={handleEndGame}
          variant="outline"
          size="large"
          icon={<Trophy size={20} color={colors.primary} />}
          style={{ marginLeft: 16 }}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenContainer: {
    marginHorizontal: 16,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  boardContainer: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  progressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  wagerAlert: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  wagerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  }
});