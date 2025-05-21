import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

export default function SettingsLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          color: colors.text,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        headerBackVisible: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerTitle: 'Settings',
          headerBackVisible: true,
          headerBackTitle: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/account')}
              style={{ marginLeft: 16 }}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          headerTitle: 'Notifications',
        }} 
      />
      <Stack.Screen 
        name="appearance" 
        options={{ 
          headerTitle: 'Appearance',
        }} 
      />
      <Stack.Screen 
        name="language" 
        options={{ 
          headerTitle: 'Language',
          headerBackVisible: false
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          headerTitle: 'Privacy & security',
        }} 
      />
    </Stack>
  );
} 