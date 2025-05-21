import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Platform, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, Eye, EyeOff, ChevronRight, UserX } from 'lucide-react-native';

export default function AccountEditScreen() {
  const { user, updateUserProfile, updatePassword, signOut, deleteAccount } = useAuth();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
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
      router.back();
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

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please check your current password and try again.');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      setIsDeleteModalVisible(false);
      await signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const PasswordChangeModal = () => (
    <Modal
      visible={isPasswordModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsPasswordModalVisible(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
        <View style={[styles.modalContent, { 
          backgroundColor: theme === 'light' ? '#FFFFFF' : colors.card,
          borderWidth: 1,
          borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { 
              color: theme === 'light' ? '#000000' : '#FFFFFF',
              fontFamily: 'Inter-Bold',
            }]}>
              Change Password
            </Text>
            <TouchableOpacity
              onPress={() => setIsPasswordModalVisible(false)}
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={[styles.closeButtonText, { 
                color: theme === 'light' ? '#000000' : '#FFFFFF',
                fontFamily: 'Inter-Medium',
              }]}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { 
                color: theme === 'light' ? '#000000' : '#FFFFFF',
                fontFamily: 'Inter-Medium',
              }]}>
                Current Password
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme === 'light' ? '#F3F4F6' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: theme === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                }
              ]}>
                <Lock size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { 
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    fontFamily: 'Inter-Regular',
                  }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} />
                  ) : (
                    <Eye size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { 
                color: theme === 'light' ? '#000000' : '#FFFFFF',
                fontFamily: 'Inter-Medium',
              }]}>
                New Password
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme === 'light' ? '#F3F4F6' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: theme === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                }
              ]}>
                <Lock size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { 
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    fontFamily: 'Inter-Regular',
                  }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} />
                  ) : (
                    <Eye size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { 
                color: theme === 'light' ? '#000000' : '#FFFFFF',
                fontFamily: 'Inter-Medium',
              }]}>
                Confirm New Password
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme === 'light' ? '#F3F4F6' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: theme === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                }
              ]}>
                <Lock size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { 
                    color: theme === 'light' ? '#000000' : '#FFFFFF',
                    fontFamily: 'Inter-Regular',
                  }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={theme === 'light' ? '#9CA3AF' : '#6B7280'}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} />
                  ) : (
                    <Eye size={20} color={theme === 'light' ? '#4B5563' : '#9CA3AF'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Update Password"
              onPress={handlePasswordChange}
              style={styles.modalButton}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: theme === 'light' ? '#111827' : colors.text }]}>Edit Profile</Text>
            <Text style={[styles.headerSubtitle, { color: theme === 'light' ? '#4B5563' : colors.textSecondary }]}>Update your personal information</Text>
          </View>

          <Card style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme === 'light' ? '#FFFFFF' : colors.text }]}>
                Name
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme === 'light' ? '#F3F4F6' : colors.card,
                  borderColor: theme === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                }
              ]}>
                <User size={20} color={theme === 'light' ? '#4B5563' : colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme === 'light' ? '#111827' : colors.text }]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter your name"
                  placeholderTextColor={theme === 'light' ? '#9CA3AF' : colors.textSecondary}
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
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme === 'light' ? '#F3F4F6' : colors.card,
                    opacity: 0.7,
                    borderColor: theme === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                  }
                ]}>
                  <Mail size={20} color={theme === 'light' ? '#4B5563' : colors.textSecondary} style={styles.inputIcon} />
                  <Text style={[styles.emailText, { color: theme === 'light' ? '#4B5563' : colors.textSecondary }]}>
                    {user?.email || 'email@example.com'}
                  </Text>
                  <Lock size={16} color={theme === 'light' ? '#4B5563' : colors.textSecondary} style={styles.lockIcon} />
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

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme === 'light' ? '#4B5563' : colors.textSecondary }]}>
              Security
            </Text>
            <TouchableOpacity
              onPress={() => setIsPasswordModalVisible(true)}
              activeOpacity={0.7}
              style={styles.passwordCardWrapper}
            >
              <Card style={[styles.passwordCard, { 
                backgroundColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
              }]}>
                <View style={styles.passwordCardContent}>
                  <View style={styles.passwordCardLeft}>
                    <Lock size={24} color={theme === 'light' ? '#374151' : colors.text} />
                    <View style={styles.passwordCardText}>
                      <Text style={[styles.passwordCardTitle, { color: theme === 'light' ? '#111827' : colors.text }]}>
                        Change Password
                      </Text>
                      <Text style={[styles.passwordCardDescription, { color: theme === 'light' ? '#4B5563' : colors.textSecondary }]}>
                        Update your password
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={theme === 'light' ? '#374151' : colors.text} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          <PasswordChangeModal />

          <View style={{ height: 24 }} />

          <TouchableOpacity
            onPress={() => setIsDeleteModalVisible(true)}
            activeOpacity={0.7}
            style={[
              styles.signOutButton,
              {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: 'red',
                marginBottom: 32,
              }
            ]}
          >
            <UserX size={20} color={'red'} style={{ opacity: 1 }} />
            <Text style={[styles.signOutText, { color: 'red', opacity: 1 }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account Modal */}
        <Modal
          visible={isDeleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme === 'light' ? '#fff' : colors.card, padding: 28 }]}> 
              <Text style={[styles.modalTitle, { color: theme === 'light' ? '#111827' : colors.text }]}>Delete Account</Text>
              <Text style={[styles.modalBody, { color: theme === 'light' ? '#374151' : colors.textSecondary }]}>Are you sure you want to delete your account? This action cannot be undone.</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24 }}>
                <TouchableOpacity
                  onPress={() => setIsDeleteModalVisible(false)}
                  style={{ marginRight: 16, paddingVertical: 8, paddingHorizontal: 16 }}
                  disabled={deleting}
                >
                  <Text style={{ color: theme === 'light' ? '#374151' : colors.text, fontFamily: 'Inter-Medium', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: 'red' }}
                  disabled={deleting}
                >
                  <Text style={{ color: '#fff', fontFamily: 'Inter-Bold', fontSize: 16 }}>{deleting ? 'Deleting...' : 'Delete'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    padding: 16,
  },
  headerContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
  sectionContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passwordCardWrapper: {
    width: '100%',
  },
  passwordCard: {
    marginTop: 0,
  },
  passwordCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  passwordCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordCardText: {
    marginLeft: 12,
  },
  passwordCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  passwordCardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 24,
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 28,
    lineHeight: 28,
  },
  modalBody: {
    padding: 24,
  },
  modalInputGroup: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  modalInputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  modalButton: {
    marginTop: 8,
    borderRadius: 12,
    height: 52,
  },
  signOutButton: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 24,
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
}); 