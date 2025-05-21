import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { 
          color: theme === 'light' ? '#2D3748' : colors.textSecondary,
          fontFamily: 'Inter-Medium' 
        }]}>
          {title}
        </Text>
      )}
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 12,
  },
  content: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});