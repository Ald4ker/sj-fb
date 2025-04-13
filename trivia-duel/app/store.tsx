import React from 'react';
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
import { Coins, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { useSettingsStore } from '@/store/settings-store';

interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: string;
  popular?: boolean;
}

const tokenPackages: TokenPackage[] = [
  {
    id: 'basic',
    name: 'Basic Pack',
    tokens: 5,
    price: '$0.99'
  },
  {
    id: 'standard',
    name: 'Standard Pack',
    tokens: 15,
    price: '$2.49',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    tokens: 30,
    price: '$4.99'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    tokens: 100,
    price: '$9.99'
  }
];

export default function StoreScreen() {
  const { colors, isDark } = useTheme();
  const { tokens, addTokens } = useSettingsStore();
  
  const handlePurchase = (pkg: TokenPackage) => {
    // In a real app, this would integrate with a payment system
    // For this demo, we'll just add the tokens directly
    
    Alert.alert(
      "Purchase Successful",
      `You've purchased ${pkg.tokens} tokens for ${pkg.price}!`,
      [
        { 
          text: "OK", 
          onPress: () => {
            addTokens(pkg.tokens);
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => router.back()}
          variant="outline"
          size="small"
          icon={<ArrowLeft size={20} color={colors.text} />}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          Token Store
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.balanceContainer}>
        <View 
          style={[
            styles.balanceCard, 
            { backgroundColor: colors.card }
          ]}
        >
          <Coins size={24} color={colors.primary} />
          <Text style={[styles.balanceText, { color: colors.text }]}>
            Current Balance: {tokens} tokens
          </Text>
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Purchase Tokens
        </Text>
        
        {tokenPackages.map(pkg => (
          <View 
            key={pkg.id} 
            style={[
              styles.packageCard, 
              { 
                backgroundColor: colors.card,
                borderColor: pkg.popular ? colors.primary : 'transparent',
                borderWidth: pkg.popular ? 2 : 0
              }
            ]}
          >
            {pkg.popular && (
              <View 
                style={[
                  styles.popularBadge, 
                  { backgroundColor: colors.primary }
                ]}
              >
                <Text style={styles.popularText}>
                  Popular
                </Text>
              </View>
            )}
            
            <View style={styles.packageHeader}>
              <Text style={[styles.packageName, { color: colors.text }]}>
                {pkg.name}
              </Text>
              <Text style={[styles.packagePrice, { color: colors.primary }]}>
                {pkg.price}
              </Text>
            </View>
            
            <View style={styles.packageContent}>
              <View style={styles.tokenInfo}>
                <Coins size={20} color={colors.primary} />
                <Text style={[styles.tokenCount, { color: colors.text }]}>
                  {pkg.tokens} tokens
                </Text>
              </View>
              
              <Button
                title="Purchase"
                onPress={() => handlePurchase(pkg)}
                variant={pkg.popular ? 'primary' : 'outline'}
                size="medium"
              />
            </View>
          </View>
        ))}
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            Each game costs 1 token to play. Tokens are non-refundable.
          </Text>
        </View>
      </ScrollView>
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
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  packageCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  popularText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  packageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenCount: {
    fontSize: 16,
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  }
});