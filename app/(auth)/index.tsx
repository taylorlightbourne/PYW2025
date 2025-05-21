import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Lightbulb as LightBulb } from 'lucide-react-native';

export default function Welcome() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.tint }]}>
          <LightBulb size={40} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: 'Inter-Bold' }]}>
          Prompt Your Way
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
          Discover, customize, and use prompts for health, beauty, work, and more
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Sign In" 
          variant="primary" 
          size="large" 
          style={styles.button}
          onPress={() => router.push('/sign-in')}
          textStyle={{ fontFamily: 'Inter-SemiBold' }}
        />
        <Button 
          title="Create Account" 
          variant="outline" 
          size="large" 
          style={styles.button}
          onPress={() => router.push('/sign-up')}
          textStyle={{ fontFamily: 'Inter-SemiBold' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  footer: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
    height: 56,
  },
});