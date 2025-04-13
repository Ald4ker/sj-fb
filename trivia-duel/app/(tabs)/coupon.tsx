import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@/store/game-store';

const CouponRedemption: React.FC = () => {
  const [couponCode, setCouponCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const gameStore = useGameStore(); // Get the entire store

  const handleRedeem = async () => {
    if (!couponCode.trim()) {
      setFeedback('Please enter a coupon code.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await gameStore.applyCoupon(couponCode); // Access applyCoupon from the store
      setFeedback(success 
        ? 'Coupon redeemed successfully!' 
        : 'Invalid coupon code.');
    } catch (error: any) {
      setFeedback('An error occurred. Please try again.');
      console.error('Coupon redemption error:', error);
    } finally {
      setIsLoading(false);
      setCouponCode('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter coupon code"
        value={couponCode}
        onChangeText={setCouponCode}
      />
      <Button
        color="#2196F3"
        title={isLoading ? "Processing..." : "Redeem"}
        onPress={handleRedeem}
        disabled={isLoading}
      />
      {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  feedbackText: {
    marginTop: 10,
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default CouponRedemption;
