import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import { Moon, Sun, Play, Users, Coins } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { TokenDisplay } from '@/components/TokenDisplay';
import { useSettingsStore } from '@/store/settings-store';

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { tokens } = useSettingsStore();
  
  const handlePlayGame = () => {
    router.push('/team-setup');
  };
  
  const handleBuyTokens = () => {
    router.push('/store');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Trivia Challenge
        </Text>
        
        <View style={styles.headerRight}>
          <TokenDisplay />
          
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
              <Sun size={24} color={colors.text} />
            ) : (
              <Moon size={24} color={colors.text} />
            )}
          </Pressable>
        </View>
      </View>
      
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpdmlhfGVufDB8fDB8fHww' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        <View style={styles.infoContainer}>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Test your knowledge with friends!
          </Text>
          
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            Compete in teams, answer challenging questions, and see who comes out on top in this exciting trivia game.
          </Text>
          
          <View style={styles.tokenInfo}>
            <View style={styles.tokenRow}>
              <Coins size={20} color={colors.primary} />
              <Text style={[styles.tokenText, { color: colors.text }]}>
                You have {tokens} tokens
              </Text>
            </View>
            <Text style={[styles.tokenDescription, { color: colors.secondaryText }]}>
              Each game costs 1 token to play
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Play New Game"
              onPress={handlePlayGame}
              variant="primary"
              size="large"
              icon={<Play size={20} color="white" />}
              fullWidth
            />
            
            <Button
              title="Buy Tokens"
              onPress={handleBuyTokens}
              variant="outline"
              size="large"
              icon={<Coins size={20} color={colors.primary} />}
              fullWidth
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    padding: 20,
  },
  heroImage: {
    flex: 1,
    height: '100%',
    borderRadius: 16,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  tokenInfo: {
    marginBottom: 24,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  tokenDescription: {
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
  }
});