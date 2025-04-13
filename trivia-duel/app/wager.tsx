import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { useGameStore } from '@/store/game-store';

export default function WagerScreen() {
  const { colors, isDark } = useTheme();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const { 
    teams, 
    useWager, 
    setWagerTargetTeam, 
    setWagerMultiplier,
    getRandomUnansweredQuestion,
    setCurrentQuestion
  } = useGameStore();
  
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  // Get the team that's placing the wager
  const wagerTeam = teams.find(team => team.id === teamId);
  
  // Get the other team(s)
  const otherTeams = teams.filter(team => team.id !== teamId);
  
  const handlePlaceWager = () => {
    if (!selectedTeam || !teamId) return;
    
    // Set up the wager
    useWager(teamId);
    setWagerTargetTeam(selectedTeam);
    
    // Randomly select multiplier
    const multipliers: [0.5, 1.5, 2] = [0.5, 1.5, 2];
    const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    setWagerMultiplier(randomMultiplier);
    
    // Get a random question
    const randomQuestion = getRandomUnansweredQuestion();
    
    if (randomQuestion) {
      setCurrentQuestion(randomQuestion);
      router.push('/question');
    } else {
      // If no questions left, go back to board
      router.push('/question-board');
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  if (!wagerTeam) {
    router.back();
    return null;
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Place a Wager
        </Text>
        
        <View 
          style={[
            styles.infoCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.infoText, { color: colors.text }]}>
            {wagerTeam.name} is placing a wager on another team's next question.
          </Text>
          
          <Text style={[styles.infoText, { color: colors.text }]}>
            A random multiplier (0.5x, 1.5x, or 2x) will be applied to the question.
          </Text>
          
          <Text style={[styles.infoText, { color: colors.text }]}>
            If they answer correctly, they'll earn bonus points. If they answer incorrectly, they'll lose points.
          </Text>
        </View>
        
        <Text style={[styles.selectionLabel, { color: colors.text }]}>
          Select a team to wager on:
        </Text>
        
        <View style={styles.teamButtons}>
          {otherTeams.map(team => (
            <Button
              key={team.id}
              title={team.name}
              onPress={() => setSelectedTeam(team.id)}
              variant={selectedTeam === team.id ? 'primary' : 'outline'}
              size="large"
              style={{ margin: 8 }}
            />
          ))}
        </View>
      </View>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          size="large"
          style={{ flex: 1, marginRight: 8 }}
        />
        
        <Button
          title="Place Wager"
          onPress={handlePlaceWager}
          variant="primary"
          size="large"
          disabled={!selectedTeam}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 20 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
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
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  }
});