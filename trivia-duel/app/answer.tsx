import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { useGameStore } from '@/store/game-store';
import { categories } from '@/mocks/categories';

export default function AnswerScreen() {
  const { colors, isDark } = useTheme();
  const { 
    currentQuestion, 
    teams, 
    updateTeamScore, 
    markQuestionAnswered,
    wagerActive,
    wagerTeam,
    wagerTargetTeam,
    wagerMultiplier,
    setWagerActive,
    wagerAvailable
  } = useGameStore();
  
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  if (!currentQuestion) {
    router.back();
    return null;
  }
  
  // Get category info
  const category = categories.find(cat => cat.id === currentQuestion.categoryId);
  
  const handleAwardPoints = () => {
    if (!selectedTeam) return;
    
    let pointsToAward = currentQuestion.points;
    
    // Apply wager multiplier if active
    if (wagerActive && wagerMultiplier) {
      pointsToAward = Math.round(pointsToAward * wagerMultiplier);
    }
    
    updateTeamScore(selectedTeam, pointsToAward);
    markQuestionAnswered(currentQuestion.id);
    
    // Reset wager if active
    if (wagerActive) {
      setWagerActive(false);
    }
    
    router.push('/question-board');
  };
  
  const handleNoPoints = () => {
    // If wager is active and team got it wrong, deduct points
    if (wagerActive && wagerTargetTeam && wagerMultiplier) {
      let pointsToDeduct = currentQuestion.points;
      
      // Calculate deduction based on multiplier
      if (wagerMultiplier === 0.5) {
        pointsToDeduct = Math.round(pointsToDeduct * 0.5);
      } else if (wagerMultiplier === 1.5) {
        pointsToDeduct = Math.round(pointsToDeduct * 1.0);
      } else if (wagerMultiplier === 2) {
        pointsToDeduct = Math.round(pointsToDeduct * 1.5);
      }
      
      // Deduct points
      updateTeamScore(wagerTargetTeam, -pointsToDeduct);
    }
    
    markQuestionAnswered(currentQuestion.id);
    
    // Reset wager if active
    if (wagerActive) {
      setWagerActive(false);
    }
    
    router.push('/question-board');
  };
  
  const handleWager = () => {
    // Check if the selected team has already used their wager
    const isTeam1 = teams[0].id === selectedTeam;
    const wagerAvailableForTeam = isTeam1 ? wagerAvailable.team1 : wagerAvailable.team2;
    
    if (!wagerAvailableForTeam) {
      Alert.alert(
        "Wager Not Available",
        `${isTeam1 ? teams[0].name : teams[1].name} has already used their wager for this game.`
      );
      return;
    }
    
    if (selectedTeam) {
      router.push({
        pathname: '/wager',
        params: { teamId: selectedTeam }
      });
    }
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
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View 
          style={[
            styles.questionCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.questionLabel, { color: colors.secondaryText }]}>
            Question:
          </Text>
          <Text style={[styles.questionText, { color: colors.text }]}>
            {currentQuestion.text}
          </Text>
        </View>
        
        <View 
          style={[
            styles.answerCard, 
            { backgroundColor: colors.success }
          ]}
        >
          <Text style={[styles.answerLabel, { color: 'rgba(255,255,255,0.8)' }]}>
            Answer:
          </Text>
          <Text style={styles.answerText}>
            {currentQuestion.answer}
          </Text>
        </View>
        
        {wagerActive && wagerMultiplier && (
          <View 
            style={[
              styles.wagerInfoCard, 
              { backgroundColor: colors.warning }
            ]}
          >
            <Text style={styles.wagerInfoText}>
              Wager Multiplier: {wagerMultiplier}x
            </Text>
            <Text style={styles.wagerInfoText}>
              Correct: +{Math.round(currentQuestion.points * wagerMultiplier)} points
            </Text>
            <Text style={styles.wagerInfoText}>
              Incorrect: 
              {wagerMultiplier === 0.5 && ` -${Math.round(currentQuestion.points * 0.5)} points`}
              {wagerMultiplier === 1.5 && ` -${Math.round(currentQuestion.points * 1.0)} points`}
              {wagerMultiplier === 2 && ` -${Math.round(currentQuestion.points * 1.5)} points`}
            </Text>
          </View>
        )}
        
        <View style={styles.teamSelection}>
          <Text style={[styles.selectionLabel, { color: colors.text }]}>
            Award points to:
          </Text>
          
          <View style={styles.teamButtons}>
            {teams.map(team => (
              <Button
                key={team.id}
                title={team.name}
                onPress={() => setSelectedTeam(team.id)}
                variant={selectedTeam === team.id ? 'primary' : 'outline'}
                size="medium"
                style={{ margin: 8 }}
                // Disable if wager is active and this is not the target team
                disabled={wagerActive && wagerTargetTeam && wagerTargetTeam !== team.id}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Button
          title="No Points"
          onPress={handleNoPoints}
          variant="outline"
          size="large"
          style={{ flex: 1, marginRight: 8 }}
        />
        
        <Button
          title="Award Points"
          onPress={handleAwardPoints}
          variant="primary"
          size="large"
          disabled={!selectedTeam}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
      
      {selectedTeam && !wagerActive && (
        <View style={[styles.wagerFooter, { backgroundColor: colors.card }]}>
          <Button
            title="Place Wager on Next Question"
            onPress={handleWager}
            variant="secondary"
            size="medium"
            fullWidth
          />
        </View>
      )}
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
  content: {
    padding: 20,
  },
  questionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  questionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  answerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  answerLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  wagerInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  wagerInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  teamSelection: {
    marginTop: 8,
  },
  selectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  teamButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  wagerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  }
});