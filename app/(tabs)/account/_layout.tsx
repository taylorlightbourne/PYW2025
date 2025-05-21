import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import Colors from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AccountLayout() {
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
          fontSize: 17,
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
          headerTitle: 'Account Settings',
          headerBackVisible: false,
          headerLeft: () => null
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          headerTitle: 'Back to Account',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/account')}
              style={{ marginLeft: 16 }}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="language" 
        options={{ 
          headerTitle: 'Back to Account',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/account')}
              style={{ marginLeft: 16 }}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          headerTitle: 'Privacy & Security',
        }} 
      />
    </Stack>
  );
} 