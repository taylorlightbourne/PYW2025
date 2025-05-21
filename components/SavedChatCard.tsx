import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import { Chat } from '@/types/data';
import { MessageSquare, ChevronRight, Trash2, X } from 'lucide-react-native';
import { useData } from '@/context/DataContext';

interface SavedChatCardProps {
  chat: Chat;
}

export default function SavedChatCard({ chat }: SavedChatCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { deleteChat } = useData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Format date
  const formattedDate = new Date(chat.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Get first user message and response for preview
  const userMessage = chat.messages.find(msg => msg.sender === 'user');
  const aiMessage = chat.messages.find(msg => msg.sender === 'ai');

  // Get category color based on prompt category
  const getCategoryColor = () => {
    const categoryId = chat.promptCategoryId;
    if (!categoryId) return colors.tint;
    
    const categoryColors: { [key: string]: string } = {
      'health': colors.healthColor,
      'beauty': colors.beautyColor,
      'work': colors.workColor,
      'personal': colors.personalColor,
      'creative': colors.creativeColor,
    };
    
    return categoryColors[categoryId] || colors.tint;
  };
  
  const categoryColor = getCategoryColor();
  
  const handleOpen = () => {
    router.push({
      pathname: '/(modals)/chat',
      params: { chatId: chat.id }
    });
  };

  const handleDelete = () => {
    console.log('Delete button pressed for chat:', chat.id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Attempting to delete chat:', chat.id);
      await deleteChat(chat.id);
      console.log('Chat deleted successfully:', chat.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Delete error:', error);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
        <Pressable 
          onPress={handleOpen}
          style={({ pressed }) => [
            styles.cardContent,
            pressed && styles.cardPressed
          ]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {chat.promptTitle}
              </Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {formattedDate}
              </Text>
            </View>
            <Pressable 
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed
              ]}
              hitSlop={20}
            >
              <Trash2 size={20} color={colors.error} />
            </Pressable>
            <View style={styles.openButton}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </View>
          
          {userMessage && (
            <Text 
              style={[styles.preview, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {userMessage.text}
            </Text>
          )}
          
          <View style={styles.stats}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {chat.messages.length} messages
            </Text>
          </View>
        </Pressable>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Delete Chat
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Are you sure you want to delete this chat? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={cancelDelete}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelButton,
                  pressed && styles.modalButtonPressed
                ]}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={confirmDelete}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.deleteButton,
                  pressed && styles.modalButtonPressed
                ]}
              >
                <Text style={[styles.modalButtonText, { color: colors.error }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
  },
  categoryIndicator: {
    height: 8,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  openButton: {
    padding: 8,
  },
  preview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonPressed: {
    opacity: 0.7,
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});