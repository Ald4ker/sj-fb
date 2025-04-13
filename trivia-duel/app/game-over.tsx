import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Image,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Share,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { Trophy, Share2 } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { useGameStore } from '@/store/game-store';
import { categories } from '@/mocks/categories';

export default function GameOverScreen() {
  const { colors, isDark } = useTheme();
  const { 
    teams, 
    resetGame,
    selectedCategories
  } = useGameStore();
  
  const [customMessage, setCustomMessage] = useState("Thanks for playing!");
  
  // Sort teams by score (highest first)
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  
  // Determine winner(s)
  const highestScore = sortedTeams[0]?.score || 0;
  const winners = sortedTeams.filter(team => team.score === highestScore);
  const isATie = winners.length > 1;
  
  const handlePlayAgain = () => {
    resetGame();
    router.push('/category-selection');
  };
  
  const handleMainMenu = () => {
    resetGame();
    router.push('/');
  };
  
  const handleShare = async () => {
    try {
      // In a real app, we would generate an image here
      // For this demo, we'll just share text
      
      const winnerText = isATie 
        ? `It's a tie between ${winners.map(w => w.name).join(' and ')}!` 
        : `${winners[0].name} wins!`;
      
      const scoreText = teams.map(team => 
        `${team.name}: ${team.score} points${team.members.length > 0 ? ` (${team.members.join(', ')})` : ''}`
      ).join('\n');
      
      const message = `
Trivia Challenge Results:
${winnerText}

${scoreText}

${customMessage}
      `;
      
      await Share.share({
        message,
        title: 'Trivia Challenge Results'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share results');
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Trophy size={48} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Game Over
          </Text>
        </View>
        
        <View 
          style={[
            styles.resultsCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.resultTitle, { color: colors.text }]}>
            {isATie ? "It's a Tie!" : "Winner"}
          </Text>
          
          <View style={styles.winnersContainer}>
            {winners.map(winner => (
              <View key={winner.id} style={styles.winnerItem}>
                <Image 
                  source={{ uri: winner.icon }} 
                  style={styles.winnerIcon} 
                />
                <Text style={[styles.winnerName, { color: colors.text }]}>
                  {winner.name}
                </Text>
                <Text style={[styles.winnerScore, { color: colors.primary }]}>
                  {winner.score} points
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View 
          style={[
            styles.scoresCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.scoresTitle, { color: colors.text }]}>
            Final Scores
          </Text>
          
          {sortedTeams.map(team => (
            <View key={team.id} style={styles.scoreItem}>
              <Image 
                source={{ uri: team.icon }} 
                style={styles.scoreIcon} 
              />
              <View style={styles.scoreInfo}>
                <Text style={[styles.scoreName, { color: colors.text }]}>
                  {team.name}
                </Text>
                {team.members.length > 0 && (
                  <Text style={[styles.scoreMembers, { color: colors.secondaryText }]}>
                    {team.members.join(', ')}
                  </Text>
                )}
              </View>
              <Text style={[styles.scoreValue, { color: colors.text }]}>
                {team.score}
              </Text>
            </View>
          ))}
        </View>
        
        <View 
          style={[
            styles.shareCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Text style={[styles.shareTitle, { color: colors.text }]}>
            Share Results
          </Text>
          
          <TextInput
            style={[
              styles.messageInput,
              { 
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: isDark ? colors.background : 'white'
              }
            ]}
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Add a custom message"
            placeholderTextColor={colors.secondaryText}
            multiline
          />
          
          <Button
            title="Share Results"
            onPress={handleShare}
            variant="primary"
            size="medium"
            icon={<Share2 size={20} color="white" />}
            fullWidth
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Button
          title="Play Again"
          onPress={handlePlayAgain}
          variant="primary"
          size="large"
          style={{ flex: 1, marginRight: 8 }}
        />
        
        <Button
          title="Main Menu"
          onPress={handleMainMenu}
          variant="outline"
          size="large"
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
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 20 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resultsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  winnersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  winnerItem: {
    alignItems: 'center',
    margin: 12,
  },
  winnerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  winnerScore: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoresCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  scoreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreName: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreMembers: {
    fontSize: 14,
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  }
});