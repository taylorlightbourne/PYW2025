import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { X } from 'lucide-react-native';

export default function EditPromptScreen() {
  const { promptId } = useLocalSearchParams();
  const { prompts, editPrompt } = useData();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [editedPrompt, setEditedPrompt] = useState('');
  const [promptTitle, setPromptTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Find the selected prompt
  useEffect(() => {
    if (promptId && typeof promptId === 'string') {
      const prompt = prompts.find(p => p.id === promptId);
      if (prompt) {
        setOriginalPrompt(prompt.text);
        setEditedPrompt(prompt.text);
        setPromptTitle(prompt.title);
      }
    }
  }, [promptId, prompts]);

  const handleContinue = async () => {
    if (!promptId || typeof promptId !== 'string') {
      setError('Invalid prompt ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting prompt edit process...');
      await editPrompt(promptId, editedPrompt);
      
      console.log('Successfully edited prompt, navigating to chat...');
      router.push({
        pathname: '/(modals)/chat',
        params: { 
          promptId,
          isNewChat: 'true'
        }
      });
    } catch (error: any) {
      console.error('Error in handleContinue:', error);
      setError(error.message || 'Failed to save prompt. Please try again.');
      
      // If it's an authentication error, redirect to sign in
      if (error.message.includes('must be logged in') || error.code === 'permission-denied') {
        Alert.alert(
          'Authentication Required',
          'Please sign in to continue.',
          [
            {
              text: 'Sign In',
              onPress: () => router.replace('/(auth)/sign-in')
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const hasChanges = originalPrompt !== editedPrompt;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
          Edit Prompt
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + '10' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          </View>
        )}
        
        <Text style={[styles.title, { color: colors.text, fontFamily: 'Inter-SemiBold' }]}>
          {promptTitle}
        </Text>
        
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'Inter-Medium' }]}>
          Modify the prompt below before starting the chat
        </Text>
        
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border
            }
          ]}
          value={editedPrompt}
          onChangeText={setEditedPrompt}
          multiline
          textAlignVertical="top"
          placeholder="Edit your prompt here..."
          placeholderTextColor={colors.placeholderText}
          editable={!isLoading}
        />
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button
          title={isLoading ? "Saving..." : "Continue"}
          onPress={handleContinue}
          disabled={!editedPrompt.trim() || isLoading}
          style={styles.button}
          textStyle={{ fontFamily: 'Inter-SemiBold' }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    height: 50,
  },
});