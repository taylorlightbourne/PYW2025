import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { DataProvider } from '@/context/DataContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <LanguageProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </LanguageProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
