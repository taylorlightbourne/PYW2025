import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Pressable, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';
import { User, Mail, LogOut, Moon, Sun, Settings, Shield, ChevronRight, ChevronLeft, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { translations } from '../../../constants/translations';

export default function AccountScreen() {
  const { user, signOut, isLoading, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const { language } = useLanguage();

  const handleSignOut = async () => {
    console.log('Sign out process starting...');
    try {
      console.log('Attempting to sign out directly...');
      await signOut();
      console.log('Sign out successful, navigating...');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      await updateUserProfile(newName.trim());
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update name. Please try again.');
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    theme === 'dark' ? setTheme('light') : setTheme('dark');
  };

  const menuItems = [
    {
      icon: isDarkMode
        ? <Moon size={24} color={theme === 'light' ? '#FFFFFF' : colors.text} />
        : <Sun size={24} color={theme === 'light' ? '#FFFFFF' : colors.text} />,
      title: isDarkMode ? translations.darkMode[language] : translations.lightMode[language],
      description: isDarkMode
        ? translations.switchToLightMode[language]
        : translations.switchToDarkMode[language],
      rightElement: (
        <Switch
          value={isDarkMode}
          onValueChange={handleThemeToggle}
          trackColor={{ false: colors.border, true: colors.tint }}
          thumbColor={colors.card}
        />
      ),
    },
    {
      icon: <Globe size={24} color={theme === 'light' ? '#FFFFFF' : colors.text} />,
      title: translations.language[language],
      description: translations.selectYourLanguage[language],
      onPress: () => router.push('/settings/language'),
      rightIcon: <ChevronRight size={20} color={theme === 'light' ? '#FFFFFF' : colors.text} />,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Profile Card */}
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/account/edit')}
      >
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <User size={20} color={theme === 'light' ? '#FFFFFF' : colors.textSecondary} />
              <View style={styles.nameContainer}>
                <Text style={[styles.infoText, { color: theme === 'light' ? '#FFFFFF' : colors.text, fontFamily: 'Inter-Medium' }]}>
                  {user?.displayName || 'User'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Mail size={20} color={theme === 'light' ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme === 'light' ? '#FFFFFF' : colors.text, fontFamily: 'Inter-Regular' }]}>
                {user?.email || 'email@example.com'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={theme === 'light' ? '#FFFFFF' : colors.text} />
        </Card>
      </TouchableOpacity>
      
      {/* Settings Menu */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingsHeader}>
          <Text style={[styles.sectionTitle, { color: theme === 'light' ? '#FFFFFF' : colors.textSecondary, fontFamily: 'Inter-Medium' }]}>
            {translations.settings[language]}
          </Text>
        </View>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={item.onPress ? 0.7 : 1}
            onPress={item.onPress}
            disabled={!item.onPress}
          >
            <Card style={styles.menuItem}>
              <View style={styles.menuIconContainer}>{item.icon}</View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: theme === 'light' ? '#FFFFFF' : colors.text, fontFamily: 'Inter-Medium' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuDescription, { color: theme === 'light' ? '#FFFFFF' : colors.textSecondary, fontFamily: 'Inter-Regular' }]}>
                  {item.description}
                </Text>
              </View>
              {item.rightElement ? item.rightElement : item.rightIcon}
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Sign Out Button */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            console.log('Pressable onPress triggered');
            handleSignOut();
          }}
          style={({ pressed }) => [
            styles.signOutButton,
            {
              borderWidth: 1,
              borderColor: colors.error,
              borderRadius: 8,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.7 : 1,
            }
          ]}
        >
          <View style={styles.signOutContent}>
            <LogOut size={20} color={colors.error} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.error, fontFamily: 'Inter-Medium', fontSize: 16 }}>
              Sign Out
            </Text>
          </View>
          <ChevronRight size={20} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  profileInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  settingsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  menuIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  menuTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
  },
  signOutButton: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 8,
  },
});
