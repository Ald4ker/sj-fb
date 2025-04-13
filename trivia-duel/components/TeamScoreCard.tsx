import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Team } from '@/types';
import { useGameStore } from '@/store/game-store';

interface TeamScoreCardProps {
  team: Team;
  isActive?: boolean;
  compact?: boolean;
}

export const TeamScoreCard = ({ 
  team, 
  isActive = false,
  compact = false
}: TeamScoreCardProps) => {
  const { colors, isDark } = useTheme();
  const { adjustTeamScore } = useGameStore();
  
  const handleDecrease = () => {
    adjustTeamScore(team.id, -50);
  };
  
  const handleIncrease = () => {
    adjustTeamScore(team.id, 50);
  };
  
  if (compact) {
    return (
      <View 
        style={[
          styles.compactContainer, 
          { 
            backgroundColor: colors.card,
            borderColor: isActive ? colors.primary : colors.border,
            borderWidth: isActive ? 2 : 1
          }
        ]}
      >
        <View style={styles.compactHeader}>
          <Image 
            source={{ uri: team.icon }} 
            style={styles.compactIcon} 
            resizeMode="cover"
          />
          <Text style={[styles.compactName, { color: colors.text }]}>
            {team.name}
          </Text>
        </View>
        
        <View style={styles.compactScoreContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.compactButton,
              { 
                backgroundColor: colors.error,
                opacity: pressed ? 0.8 : 1
              }
            ]}
            onPress={handleDecrease}
          >
            <Minus size={16} color="white" />
          </Pressable>
          
          <Text style={[styles.compactScore, { color: colors.text }]}>
            {team.score}
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.compactButton,
              { 
                backgroundColor: colors.success,
                opacity: pressed ? 0.8 : 1
              }
            ]}
            onPress={handleIncrease}
          >
            <Plus size={16} color="white" />
          </Pressable>
        </View>
      </View>
    );
  }
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: isActive ? colors.primary : colors.border,
          borderWidth: isActive ? 2 : 1
        }
      ]}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: team.icon }} 
          style={styles.icon} 
          resizeMode="cover"
        />
        <Text style={[styles.name, { color: colors.text }]}>
          {team.name}
        </Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { 
              backgroundColor: colors.error,
              opacity: pressed ? 0.8 : 1
            }
          ]}
          onPress={handleDecrease}
        >
          <Minus size={20} color="white" />
        </Pressable>
        
        <Text style={[styles.score, { color: colors.text }]}>
          {team.score}
        </Text>
        
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { 
              backgroundColor: colors.success,
              opacity: pressed ? 0.8 : 1
            }
          ]}
          onPress={handleIncrease}
        >
          <Plus size={20} color="white" />
        </Pressable>
      </View>
      
      {team.members.length > 0 && (
        <View style={styles.membersContainer}>
          <Text style={[styles.membersLabel, { color: colors.secondaryText }]}>
            Members:
          </Text>
          {team.members.map((member, index) => (
            <Text 
              key={index} 
              style={[styles.memberName, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {member}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  membersContainer: {
    marginTop: 8,
  },
  membersLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 12,
    marginBottom: 2,
  },
  
  // Compact styles
  compactContainer: {
    borderRadius: 8,
    padding: 6,
    margin: 3,
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
        shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIcon: {    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  compactName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  compactScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactButton: {    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 6,
  }
});