import React, { useState } from 'react';
import { StyleSheet, View, Switch, Alert, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsItem from '@/components/settings/SettingsItem';
import { Shield, Lock, Trash2, History, ArrowLeft, Bell } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newPromptsEnabled, setNewPromptsEnabled] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic here
            Alert.alert('Not Implemented', 'Account deletion is not implemented yet.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={theme === 'light' ? '#2D3748' : colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme === 'light' ? '#2D3748' : colors.textSecondary }]}>
          Back to Account Settings
        </Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <SettingsSection title="Notifications">
            <SettingsItem
              icon={<Bell size={22} color="#FFFFFF" />}
              title="Enable Notifications"
              subtitle="Receive notifications about your account"
              rightIcon={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.tint }}
                  thumbColor={colors.card}
                />
              }
            />
            <SettingsItem
              icon={<Bell size={22} color="#FFFFFF" />}
              title="New Prompts"
              subtitle="Get notified when new prompts are available"
              rightIcon={
                <Switch
                  value={newPromptsEnabled}
                  onValueChange={setNewPromptsEnabled}
                  trackColor={{ false: colors.border, true: colors.tint }}
                  thumbColor={colors.card}
                  disabled={!notificationsEnabled}
                />
              }
            />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsItem
              icon={<Shield size={22} color="#FFFFFF" />}
              title="Two-Factor Authentication"
              subtitle="Add an extra layer of security"
              rightIcon={
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                  trackColor={{ false: colors.border, true: colors.tint }}
                  thumbColor={colors.card}
                />
              }
            />
            <SettingsItem
              icon={<Lock size={22} color="#FFFFFF" />}
              title="Change Password"
              onPress={() => Alert.alert('Not Implemented', 'Password change is not implemented yet.')}
            />
          </SettingsSection>

          <SettingsSection title="Data & Privacy">
            <SettingsItem
              icon={<History size={22} color="#FFFFFF" />}
              title="Save Chat History"
              subtitle="Keep record of your conversations"
              rightIcon={
                <Switch
                  value={saveHistory}
                  onValueChange={setSaveHistory}
                  trackColor={{ false: colors.border, true: colors.tint }}
                  thumbColor={colors.card}
                />
              }
            />
          </SettingsSection>

          <SettingsSection title="Account">
            <Button
              title="Delete Account"
              variant="destructive"
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
              icon={<Trash2 size={20} color={colors.error} />}
            />
          </SettingsSection>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  content: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  deleteButton: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
}); 