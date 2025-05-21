import React from 'react';
import { StyleSheet, View, ViewProps, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  elevation?: number;
}

export default function Card({ 
  children, 
  style, 
  variant = 'elevated',
  elevation = 2,
  ...props 
}: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
          ...styles.card,
        };
      case 'filled':
        return {
          backgroundColor: colorScheme === 'light' ? '#F9FAFB' : '#2D3748',
          ...styles.card,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.card,
          shadowOpacity: colorScheme === 'light' ? 0.1 : 0.3,
          shadowRadius: elevation * 2,
          shadowOffset: { 
            height: elevation, 
            width: 0 
          },
          elevation: elevation,
          ...styles.card,
        };
    }
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    overflow: 'hidden',
  },
});