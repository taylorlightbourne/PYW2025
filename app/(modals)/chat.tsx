import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import { Message } from '@/types/data';
import { ChevronLeft, Home, MessageSquare, Settings, User } from 'lucide-react-native';
import { db } from '@/config/firebase';
import { sendMessage, ChatMessage } from '@/services/api';

export default function ChatScreen() {
  const { promptId, chatId, isNewChat } = useLocalSearchParams();
  const { user } = useAuth();
  const { prompts, savedChats, saveChat, updateChat } = useData();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptTitle, setPromptTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  // Add loading message state
  const [loadingMessage, setLoadingMessage] = useState<Message | null>(null);

  // Add authentication check logging
  useEffect(() => {
    console.log('Authentication Status Check:');
    console.log('- Is user logged in?', !!user);
    if (user) {
      console.log('- User ID:', user.uid);
      console.log('- User Email:', user.email);
      console.log('- User Display Name:', user.displayName);
    }
  }, [user]);

  // Load chat data
  useEffect(() => {
    const loadContent = async () => {
      console.log('=== Starting loadContent ===');
      console.log('Parameters:', { isNewChat, promptId, chatId, userId: user?.uid });
      
      // If it's a new chat from a prompt
      if (isNewChat === 'true' && promptId && typeof promptId === 'string') {
        try {
          console.log('Loading new chat from prompt:', promptId);
          
          // Check if a chat already exists for this prompt
          const existingChat = savedChats.find(chat => 
            chat.promptId === promptId && 
            chat.userId === user?.uid
          );
          
          if (existingChat) {
            console.log('Found existing chat for this prompt:', existingChat.id);
            setPromptTitle(existingChat.promptTitle);
            setMessages(existingChat.messages);
            setCurrentChatId(existingChat.id);
            // Only call generateAIResponse if the last message is from the user and there is no AI response after it
            const lastMessage = existingChat.messages[existingChat.messages.length - 1];
            const hasPendingAI = existingChat.messages.some((msg, idx) =>
              msg.sender === 'assistant' && idx > existingChat.messages.findLastIndex(m => m.sender === 'user')
            );
            if (lastMessage && lastMessage.sender === 'user' && !hasPendingAI) {
              console.log('Last message is from user and no AI response after, generating AI response');
              generateAIResponse(lastMessage.text, existingChat.id);
            }
            return;
          }

          // Fall back to original prompt if no user-specific version exists
          console.log('Falling back to original prompt');
          const prompt = prompts.find(p => p.id === promptId);
          if (prompt) {
            console.log('Found original prompt:', prompt);
            const title = prompt.title || 'Untitled Chat';
            setPromptTitle(title);
            const initialMessages: Message[] = [
              {
                id: 'initial-msg',
                text: prompt.text,
                sender: 'user',
                timestamp: new Date(),
              }
            ];
            setMessages(initialMessages);
            
            // Save the initial chat immediately
            if (user) {
              try {
                const chatToSave = {
                  userId: user.uid,
                  promptId: promptId,
                  promptTitle: title,
                  promptCategoryId: prompt.categoryId || 'creative',
                  messages: initialMessages,
                  createdAt: new Date(),
                  updatedAt: new Date()
                };
                
                const savedChatId = await saveChat(chatToSave);
                console.log('Initial chat saved with ID:', savedChatId);
                setCurrentChatId(savedChatId);
                
                // Generate AI response for the prompt
                generateAIResponse(prompt.text, savedChatId);
              } catch (saveError) {
                console.error('Error saving initial chat:', saveError);
              }
            }
          } else {
            console.warn('No prompt found with ID:', promptId);
          }
        } catch (error: any) {
          console.error('Error in loadContent:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          Alert.alert('Error', 'Failed to load prompt');
        }
      } 
      // If it's an existing chat
      else if (chatId && typeof chatId === 'string') {
        console.log('Loading existing chat:', chatId);
        const chat = savedChats.find(c => c.id === chatId);
        if (chat) {
          console.log('Found existing chat:', chat);
          setPromptTitle(chat.promptTitle);
          setMessages(chat.messages);
          setCurrentChatId(chatId);

          // Check if the last message is from the user and needs an AI response
          const lastMessage = chat.messages[chat.messages.length - 1];
          if (lastMessage && lastMessage.sender === 'user') {
            console.log('Last message is from user, generating AI response');
            generateAIResponse(lastMessage.text, chatId);
          }
        } else {
          console.warn('No chat found with ID:', chatId);
        }
      }
    };

    loadContent();
  }, [promptId, chatId, isNewChat, user?.uid, savedChats]);

  // Send a message
  const handleSendMessage = async (text: string) => {
    console.log('handleSendMessage called with text:', text);
    if (!text.trim() || !currentChatId) {
      console.log('Message not sent - invalid text or no chat ID:', { text, currentChatId });
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    console.log('Adding user message to state:', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setIsSending(true);

    let loadingMsg: Message | null = null;
    try {
      // Add loading message
      loadingMsg = {
        id: 'loading-' + Date.now(),
        text: '...',
        sender: 'assistant',
        timestamp: new Date(),
      };
      console.log('Adding loading message:', loadingMsg);
      setLoadingMessage(loadingMsg);
      if (loadingMsg) {
        setMessages(prev => [...prev, loadingMsg as Message]);
      }

      // Convert messages to API format
      const chatMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant' as const,
        content: msg.text
      }));
      
      // Add the new message
      chatMessages.push({
        role: 'user' as const,
        content: text
      });

      console.log('Sending messages to API:', chatMessages);

      // Get response from API
      const response = await sendMessage(chatMessages);
      console.log('Received response from API:', response);

      // Remove loading message and add actual response
      setLoadingMessage(null);
      if (loadingMsg) {
        console.log('Removing loading message');
        setMessages(prev => prev.filter(msg => msg.id !== loadingMsg!.id));
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant' as 'assistant',
        timestamp: new Date(),
      };

      console.log('Adding AI response to state:', aiMessage);
      const updatedMessages = [...messages.filter(msg => !loadingMsg || msg.id !== loadingMsg.id), newMessage, aiMessage];
      setMessages(updatedMessages);

      // Update chat in database
      if (currentChatId) {
        const existingChat = savedChats.find(c => c.id === currentChatId);
        if (existingChat) {
          console.log('Updating chat in database:', { chatId: currentChatId, messageCount: updatedMessages.length });
          await updateChat(currentChatId, {
            ...existingChat,
            messages: updatedMessages,
            updatedAt: new Date()
          });
        }
      }
    } catch (error: any) {
      // Remove loading message on error
      setLoadingMessage(null);
      if (loadingMsg) {
        console.log('Removing loading message due to error');
        setMessages(prev => prev.filter(msg => msg.id !== loadingMsg!.id));
      }
      
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const generateAIResponse = async (userMessage: string, chatId?: string) => {
    if (!chatId) return;

    setIsSending(true);
    let loadingMsg: Message | null = null;
    let loadingTimeout: any = null;
    let loadingShown = false;
    try {
      // Set a timeout to show the loading message after 500ms
      loadingTimeout = setTimeout(() => {
        // Only add a loading message if one doesn't already exist
        setMessages(prev => {
          const alreadyLoading = prev.some(msg => msg.text === '...' && msg.sender === 'assistant');
          if (alreadyLoading) return prev;
          loadingMsg = {
            id: 'loading-' + Date.now(),
            text: '...',
            sender: 'assistant' as 'assistant',
            timestamp: new Date(),
          };
          setLoadingMessage(loadingMsg);
          return [...prev, loadingMsg as Message];
        });
        loadingShown = true;
      }, 500);

      // Prepare full chat history for context, excluding loading message
      const chatMessages: ChatMessage[] = [
        ...messages
          .filter(msg => msg.id !== loadingMsg?.id)
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.text
          })),
        { role: 'user' as const, content: userMessage }
      ];

      console.log('Sending message to API:', chatMessages);

      // Get response from API
      const response = await sendMessage(chatMessages);

      // Clear the loading timeout if the response arrives quickly
      if (loadingTimeout) clearTimeout(loadingTimeout);
      setLoadingMessage(null);
      setMessages(prev => {
        // Remove loading message if present
        const filtered = prev.filter(msg => !loadingMsg || msg.id !== loadingMsg.id);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            text: response,
            sender: 'assistant' as 'assistant',
            timestamp: new Date(),
          }
        ];
      });

      // Update chat in database
      const updatedMessages = [
        ...messages.filter(msg => !loadingMsg || msg.id !== loadingMsg.id),
        {
          id: Date.now().toString(),
          text: response,
          sender: 'assistant' as 'assistant',
          timestamp: new Date(),
        }
      ];
      const existingChat = savedChats.find(c => c.id === chatId);
      if (existingChat) {
        await updateChat(chatId, {
          ...existingChat,
          messages: updatedMessages,
          updatedAt: new Date()
        });
      }
    } catch (error: any) {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      setLoadingMessage(null);
      setMessages(prev => prev.filter(msg => !loadingMsg || msg.id !== loadingMsg.id));
      console.error('Error generating AI response:', error);
      Alert.alert('Error', 'Failed to generate response. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Inter-SemiBold' }]} numberOfLines={1}>
          {promptTitle}
        </Text>
        
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.headerButton}>
          <Home size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} disabled={isSending} />

      {/* Bottom Navigation */}
      <View style={[
        styles.bottomNav, 
        { 
          backgroundColor: colors.card, 
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        }
      ]}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.replace('/(tabs)')}
        >
          <Home size={24} color={colors.tint} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.replace('/(tabs)/saved')}
        >
          <MessageSquare size={24} color={colors.tabIconDefault} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.replace('/(tabs)/account')}
        >
          <User size={24} color={colors.tabIconDefault} />
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});