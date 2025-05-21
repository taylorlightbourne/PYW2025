import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';

export default function AppearanceScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Appearance Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
}); 