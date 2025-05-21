import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Message } from '@/types/data';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isUser = message.sender === 'user';
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer,
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isUser ? colors.userMessageBubble : colors.aiMessageBubble,
        },
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUser ? colors.userMessageText : colors.aiMessageText }
        ]}>
          {message.text}
        </Text>
      </View>
      <Text style={[
        styles.timestamp,
        { color: colors.textSecondary }
      ]}>
        {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '85%',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 42,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
});