import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsItem from '@/components/settings/SettingsItem';
import { Globe, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/constants/translations';

export default function LanguageScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <SettingsSection title={translations.selectLanguage[language]}>
            {languages.map((lang) => (
              <SettingsItem
                key={lang.code}
                icon={<Globe size={22} color="#FFFFFF" />}
                title={lang.name}
                onPress={() => setLanguage(lang.code as any)}
                rightIcon={language === lang.code ? (
                  <View style={[styles.checkmark, { backgroundColor: colors.tint }]} />
                ) : undefined}
              />
            ))}
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
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.7)',
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
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
}); 