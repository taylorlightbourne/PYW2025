import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: colorScheme === 'light' ? '#F3F4F6' : '#2D3748' }
      ]}>
        {icon}
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    minWidth: 150,
  }
});