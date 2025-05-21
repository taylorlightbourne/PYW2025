import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Send } from 'lucide-react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const handleSend = () => {
    console.log('ChatInput: handleSend called with message:', message);
    if (message.trim() === '' || disabled) {
      console.log('ChatInput: Message not sent - empty or disabled:', { message, disabled });
      return;
    }
    
    console.log('ChatInput: Calling onSend with message:', message.trim());
    onSend(message.trim());
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 64}
    >
      <View style={[
        styles.container,
        { backgroundColor: colors.card, borderTopColor: colors.border }
      ]}>
        <View style={[
          styles.inputContainer,
          { backgroundColor: colorScheme === 'light' ? '#F3F4F6' : '#2D3748' }
        ]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholderText}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            editable={!disabled}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              { 
                backgroundColor: message.trim() === '' || disabled
                  ? colors.disabledButton
                  : colors.tint
              }
            ]}
            onPress={handleSend}
            disabled={message.trim() === '' || disabled}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});