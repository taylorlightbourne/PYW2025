import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Mail, ChevronLeft, Lock } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, updateUserProfile } = useAuth();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const [newName, setNewName] = useState(user?.displayName || '');

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      await updateUserProfile(newName.trim());
      router.replace('/(tabs)/profile');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleEmailPress = () => {
    Alert.alert(
      'Email',
      'Email address cannot be changed.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Profile Form */}
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme === 'light' ? '#FFFFFF' : colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme === 'light' ? '#FFFFFF' : colors.text }]}>
            Edit Profile
          </Text>
        </View>

        <Card style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme === 'light' ? '#FFFFFF' : colors.text }]}>
              Name
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme === 'light' ? '#FFFFFF20' : colors.card }]}>
              <User size={20} color={theme === 'light' ? '#FFFFFF' : colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme === 'light' ? '#FFFFFF' : colors.text }]}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme === 'light' ? '#FFFFFF' : colors.text }]}>
              Email
            </Text>
            <TouchableOpacity 
              onPress={handleEmailPress}
              activeOpacity={0.7}
              style={styles.emailContainer}
            >
              <View style={[styles.inputContainer, { 
                backgroundColor: theme === 'light' ? '#FFFFFF20' : colors.card,
                opacity: 0.7
              }]}>
                <Mail size={20} color={theme === 'light' ? '#FFFFFF' : colors.textSecondary} style={styles.inputIcon} />
                <Text style={[styles.emailText, { color: theme === 'light' ? '#FFFFFF' : colors.textSecondary }]}>
                  {user?.email || 'email@example.com'}
                </Text>
                <Lock size={16} color={theme === 'light' ? '#FFFFFF' : colors.textSecondary} style={styles.lockIcon} />
              </View>
            </TouchableOpacity>
            <Text style={[styles.helperText, { color: theme === 'light' ? '#FFFFFF' : colors.textSecondary }]}>
              Email address cannot be changed
            </Text>
          </View>

          <Button
            title="Save Changes"
            onPress={handleUpdateName}
            style={styles.saveButton}
          />
        </Card>

        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.returnLink}
        >
          <Text style={[styles.returnText, { color: colors.tint }]}>
            Return to Account Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emailContainer: {
    width: '100%',
  },
  emailText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  lockIcon: {
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  returnLink: {
    marginTop: 16,
    padding: 8,
  },
  returnText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
}); 