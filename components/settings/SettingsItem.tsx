import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
}

export default function SettingsItem({ 
  icon, 
  title, 
  subtitle, 
  rightIcon,
  onPress 
}: SettingsItemProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { 
          borderBottomColor: colors.border,
          backgroundColor: theme === 'light' ? '#2D3748' : colors.card
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { 
          color: theme === 'light' ? '#FFFFFF' : colors.text,
          fontFamily: 'Inter-Medium' 
        }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { 
            color: theme === 'light' ? '#FFFFFF' : colors.textSecondary,
            fontFamily: 'Inter-Regular' 
          }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightIcon && (
        <View style={styles.rightIcon}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  rightIcon: {
    marginLeft: 8,
  },
});