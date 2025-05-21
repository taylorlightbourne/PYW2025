import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsItem from '@/components/settings/SettingsItem';
import { Bell, Moon, Globe, Shield, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <SettingsSection title="App Settings">
        <SettingsItem
          icon={<Bell size={22} color="#FFFFFF" />}
          title="Notifications"
          subtitle="Manage push notifications"
          onPress={() => router.push('/(tabs)/settings/notifications')}
          rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
        />
        <SettingsItem
          icon={<Moon size={22} color="#FFFFFF" />}
          title="Appearance"
          subtitle={`Currently using ${theme} mode`}
          onPress={() => router.push('/(tabs)/settings/appearance')}
          rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
        />
        <SettingsItem
          icon={<Globe size={22} color="#FFFFFF" />}
          title="Language"
          subtitle="English (US)"
          onPress={() => router.push('/(tabs)/settings/language')}
          rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
        />
      </SettingsSection>

      <SettingsSection title="Privacy & Security">
        <SettingsItem
          icon={<Shield size={22} color="#FFFFFF" />}
          title="Privacy & Security"
          subtitle="Manage your data and security settings"
          onPress={() => router.push('/(tabs)/settings/privacy')}
          rightIcon={<ChevronRight size={20} color="#FFFFFF" />}
        />
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
  },
}); 