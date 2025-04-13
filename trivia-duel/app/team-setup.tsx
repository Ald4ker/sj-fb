import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { X, Plus, User, Users, Minus } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { TokenDisplay } from '@/components/TokenDisplay';
import { useGameStore } from '@/store/game-store';
import { Team } from '@/types';
import { teamIcons } from '@/mocks/team-icons';

export default function TeamSetupScreen() {
  const { colors, isDark } = useTheme();
  const { setTeams } = useGameStore();
  
  const [team1, setTeam1] = useState<Team>({
    id: 'team1',
    name: 'Team 1',
    members: [],
    icon: teamIcons[0].url,
    score: 0
  });
  
  const [team2, setTeam2] = useState<Team>({
    id: 'team2',
    name: 'Team 2',
    members: [],
    icon: teamIcons[1].url,
    score: 0
  });
  
  const [newMember1, setNewMember1] = useState('');
  const [newMember2, setNewMember2] = useState('');
  const [memberCount1, setMemberCount1] = useState(0);
  const [memberCount2, setMemberCount2] = useState(0);
  
  const handleAddMember = (team: 'team1' | 'team2') => {
    if (team === 'team1' && newMember1.trim()) {
      setTeam1({
        ...team1,
        members: [...team1.members, newMember1.trim()]
      });
      setNewMember1('');
    } else if (team === 'team2' && newMember2.trim()) {
      setTeam2({
        ...team2,
        members: [...team2.members, newMember2.trim()]
      });
      setNewMember2('');
    }
  };
  
  const handleRemoveMember = (team: 'team1' | 'team2', index: number) => {
    if (team === 'team1') {
      const newMembers = [...team1.members];
      newMembers.splice(index, 1);
      setTeam1({ ...team1, members: newMembers });
    } else {
      const newMembers = [...team2.members];
      newMembers.splice(index, 1);
      setTeam2({ ...team2, members: newMembers });
    }
  };
  
  const handleSelectIcon = (team: 'team1' | 'team2', iconUrl: string) => {
    if (team === 'team1') {
      setTeam1({ ...team1, icon: iconUrl });
    } else {
      setTeam2({ ...team2, icon: iconUrl });
    }
  };
  
  const handleContinue = () => {
    setTeams([team1, team2]);
    router.push('/category-selection');
  };
  
  const incrementMemberCount = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setMemberCount1(prev => prev + 1);
    } else {
      setMemberCount2(prev => prev + 1);
    }
  };
  
  const decrementMemberCount = (team: 'team1' | 'team2') => {
    if (team === 'team1' && memberCount1 > 0) {
      setMemberCount1(prev => prev - 1);
    } else if (team === 'team2' && memberCount2 > 0) {
      setMemberCount2(prev => prev - 1);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Set Up Your Teams
        </Text>
        <TokenDisplay />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.teamsContainer}>
            {/* Team 1 */}
            <View style={[styles.teamCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.teamTitle, { color: colors.text }]}>
                Team 1
              </Text>
              
              <View style={styles.teamNameContainer}>
                <TextInput
                  style={[
                    styles.teamNameInput,
                    { 
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: isDark ? colors.background : 'white'
                    }
                  ]}
                  value={team1.name}
                  onChangeText={(text) => setTeam1({ ...team1, name: text })}
                  placeholder="Enter team name"
                  placeholderTextColor={colors.secondaryText}
                />
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Icon
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconsContainer}
              >
                {teamIcons.map((icon) => (
                  <Pressable
                    key={icon.id}
                    style={[
                      styles.iconButton,
                      { 
                        borderColor: team1.icon === icon.url ? colors.primary : 'transparent',
                        borderWidth: team1.icon === icon.url ? 2 : 0
                      }
                    ]}
                    onPress={() => handleSelectIcon('team1', icon.url)}
                  >
                    <Image 
                      source={{ uri: icon.url }} 
                      style={styles.teamIcon} 
                    />
                  </Pressable>
                ))}
              </ScrollView>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Size
              </Text>
              
              <View style={styles.counterContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.counterButton,
                    { 
                      backgroundColor: colors.error,
                      opacity: pressed ? 0.8 : 1
                    }
                  ]}
                  onPress={() => decrementMemberCount('team1')}
                >
                  <Minus size={16} color="white" />
                </Pressable>
                
                <Text style={[styles.counterText, { color: colors.text }]}>
                  {memberCount1}
                </Text>
                
                <Pressable
                  style={({ pressed }) => [
                    styles.counterButton,
                    { 
                      backgroundColor: colors.success,
                      opacity: pressed ? 0.8 : 1
                    }
                  ]}
                  onPress={() => incrementMemberCount('team1')}
                >
                  <Plus size={16} color="white" />
                </Pressable>
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Members
              </Text>
              
              <View style={styles.membersContainer}>
                {team1.members.map((member, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.memberItem, 
                      { backgroundColor: isDark ? colors.background : '#f0f0f0' }
                    ]}
                  >
                    <User size={16} color={colors.secondaryText} />
                    <Text style={[styles.memberName, { color: colors.text }]}>
                      {member}
                    </Text>
                    <Pressable
                      style={styles.removeMemberButton}
                      onPress={() => handleRemoveMember('team1', index)}
                    >
                      <X size={16} color={colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
              
              <View style={styles.addMemberContainer}>
                <TextInput
                  style={[
                    styles.addMemberInput,
                    { 
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: isDark ? colors.background : 'white'
                    }
                  ]}
                  value={newMember1}
                  onChangeText={setNewMember1}
                  placeholder="Add team member"
                  placeholderTextColor={colors.secondaryText}
                  onSubmitEditing={() => handleAddMember('team1')}
                />
                <Button
                  title="Add"
                  onPress={() => handleAddMember('team1')}
                  variant="primary"
                  size="small"
                  disabled={!newMember1.trim()}
                  icon={<Plus size={16} color="white" />}
                />
              </View>
            </View>
            
            {/* Team 2 */}
            <View style={[styles.teamCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.teamTitle, { color: colors.text }]}>
                Team 2
              </Text>
              
              <View style={styles.teamNameContainer}>
                <TextInput
                  style={[
                    styles.teamNameInput,
                    { 
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: isDark ? colors.background : 'white'
                    }
                  ]}
                  value={team2.name}
                  onChangeText={(text) => setTeam2({ ...team2, name: text })}
                  placeholder="Enter team name"
                  placeholderTextColor={colors.secondaryText}
                />
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Icon
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconsContainer}
              >
                {teamIcons.map((icon) => (
                  <Pressable
                    key={icon.id}
                    style={[
                      styles.iconButton,
                      { 
                        borderColor: team2.icon === icon.url ? colors.primary : 'transparent',
                        borderWidth: team2.icon === icon.url ? 2 : 0
                      }
                    ]}
                    onPress={() => handleSelectIcon('team2', icon.url)}
                  >
                    <Image 
                      source={{ uri: icon.url }} 
                      style={styles.teamIcon} 
                    />
                  </Pressable>
                ))}
              </ScrollView>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Size
              </Text>
              
              <View style={styles.counterContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.counterButton,
                    { 
                      backgroundColor: colors.error,
                      opacity: pressed ? 0.8 : 1
                    }
                  ]}
                  onPress={() => decrementMemberCount('team2')}
                >
                  <Minus size={16} color="white" />
                </Pressable>
                
                <Text style={[styles.counterText, { color: colors.text }]}>
                  {memberCount2}
                </Text>
                
                <Pressable
                  style={({ pressed }) => [
                    styles.counterButton,
                    { 
                      backgroundColor: colors.success,
                      opacity: pressed ? 0.8 : 1
                    }
                  ]}
                  onPress={() => incrementMemberCount('team2')}
                >
                  <Plus size={16} color="white" />
                </Pressable>
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Members
              </Text>
              
              <View style={styles.membersContainer}>
                {team2.members.map((member, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.memberItem, 
                      { backgroundColor: isDark ? colors.background : '#f0f0f0' }
                    ]}
                  >
                    <User size={16} color={colors.secondaryText} />
                    <Text style={[styles.memberName, { color: colors.text }]}>
                      {member}
                    </Text>
                    <Pressable
                      style={styles.removeMemberButton}
                      onPress={() => handleRemoveMember('team2', index)}
                    >
                      <X size={16} color={colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
              
              <View style={styles.addMemberContainer}>
                <TextInput
                  style={[
                    styles.addMemberInput,
                    { 
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: isDark ? colors.background : 'white'
                    }
                  ]}
                  value={newMember2}
                  onChangeText={setNewMember2}
                  placeholder="Add team member"
                  placeholderTextColor={colors.secondaryText}
                  onSubmitEditing={() => handleAddMember('team2')}
                />
                <Button
                  title="Add"
                  onPress={() => handleAddMember('team2')}
                  variant="primary"
                  size="small"
                  disabled={!newMember2.trim()}
                  icon={<Plus size={16} color="white" />}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Button
          title="Continue to Categories"
          onPress={handleContinue}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  teamNameContainer: {
    marginBottom: 16,
  },
  teamNameInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  iconsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    overflow: 'hidden',
  },
  teamIcon: {
    width: '100%',
    height: '100%',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  membersContainer: {
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  removeMemberButton: {
    padding: 4,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMemberInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  }
});