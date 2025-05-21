import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { useData } from '@/context/DataContext';
import SavedChatCard from '@/components/SavedChatCard';
import EmptyState from '@/components/EmptyState';
import { MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import CategoryList from '@/components/CategoryList';

export default function SavedScreen() {
  const { savedChats, categories } = useData();
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [localChats, setLocalChats] = useState(savedChats);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Update local state when savedChats changes
  useEffect(() => {
    setLocalChats(savedChats);
  }, [savedChats]);

  // Filter chats by selected category
  const filteredChats = selectedCategoryId
    ? localChats.filter(chat => chat.promptCategoryId === selectedCategoryId)
    : localChats;

  // Sort chats by most recent first
  const sortedChats = [...filteredChats].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const navigateToHome = () => {
    router.navigate('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <View style={styles.categoriesContainer}>
          <CategoryList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </View>
        
        <View style={styles.chatsContainer}>
          {sortedChats.length > 0 ? (
            <FlatList
              data={sortedChats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SavedChatCard chat={item} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState
              icon={<MessageSquare size={32} color={colors.tint} />}
              title="No saved chats"
              message="You haven't saved any chats yet. Start by browsing prompts and creating your first chat!"
              actionLabel="Browse Prompts"
              onAction={navigateToHome}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    height: 40,
    marginTop: 25,
    marginBottom: 10,
  },
  chatsContainer: {
    flex: 1,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});