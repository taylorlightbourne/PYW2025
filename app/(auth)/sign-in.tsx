import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ChevronLeft } from 'lucide-react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const { signIn, isLoading, error } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    try {
      console.log('SignIn: Starting sign in process');
      await signIn(email, password);
      
      // Add a small delay to ensure Firebase auth state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('SignIn: Sign in successful, navigating to tabs');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('SignIn: Error during sign in:', error);
      // Error handling is done in the AuthContext
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontFamily: 'Inter-Bold' }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
          Sign in to your account
        </Text>
      </View>
      
      <View style={styles.form}>
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: 'rgba(252, 129, 129, 0.1)' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          </View>
        )}
        
        <Input
          label="Email"
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={formErrors.email}
          leftIcon={<Mail size={20} color={colors.textSecondary} />}
        />
        
        <Input
          label="Password"
          placeholder="Your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={formErrors.password}
          leftIcon={<Lock size={20} color={colors.textSecondary} />}
        />
        
        <Button
          title="Sign In"
          size="large"
          onPress={handleSignIn}
          isLoading={isLoading}
          loadingText="Signing in..."
          style={styles.button}
          textStyle={{ fontFamily: 'Inter-SemiBold' }}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={[styles.footerLink, { color: colors.tint, fontFamily: 'Inter-Medium' }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
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
    marginTop: 60,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    height: 56,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    fontSize: 16,
  },
});