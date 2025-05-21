import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import Colors from '../../constants/Colors';
import { Home, MessageSquare, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Prompt Your Way',
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          headerTitle: 'Chat History',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Your Profile',
        }}
      />
    </Tabs>
  );
}