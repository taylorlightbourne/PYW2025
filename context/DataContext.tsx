import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, setDoc, limit, serverTimestamp, orderBy, deleteDoc } from '@firebase/firestore';
import { Timestamp } from '@firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './AuthContext';
import { Chat, Prompt, Category } from '@/types/data';
import { dummyPrompts, dummyCategories } from '@/data/dummyData';
import { Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface DataContextType {
  prompts: Prompt[];
  categories: Category[];
  savedChats: Chat[];
  isLoading: boolean;
  error: string | null;
  getPromptsByCategory: (categoryId: string) => Prompt[];
  saveChat: (chat: Omit<Chat, 'id'>) => Promise<string>;
  updateChat: (chatId: string, chat: Omit<Chat, 'id'>) => Promise<void>;
  editPrompt: (promptId: string, text: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>(dummyPrompts);
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [savedChats, setSavedChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      console.log('Waiting for auth to initialize before loading chats...');
      return;
    }

    if (!user) {
      console.log('No authenticated user, clearing saved chats');
      setSavedChats([]);
      return;
    }

    let isMounted = true;
    let loadAttempts = 0;
    const MAX_LOAD_ATTEMPTS = 1;

    const loadSavedChats = async () => {
      if (loadAttempts >= MAX_LOAD_ATTEMPTS) {
        console.log('LoadChats: Maximum load attempts reached, stopping');
        return;
      }
      loadAttempts++;

      try {
        console.log('LoadChats: Starting to load chats for user', user.uid);
        setIsLoading(true);
        setError(null);

        // Query chats collection for user's chats
        const chatsQuery = query(
          collection(db, 'chats'),
          where('userId', '==', user.uid)
        );

        console.log('LoadChats: Executing query...');
        const querySnapshot = await getDocs(chatsQuery);
        
        if (!isMounted) {
          console.log('LoadChats: Component unmounted, aborting state updates');
          return;
        }
        
        const chats: Chat[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
          const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date();
          
          // Find the prompt to get its category
          const prompt = prompts.find(p => p.id === data.promptId);
          
          chats.push({
            id: doc.id,
            userId: data.userId,
            promptId: data.promptId,
            promptTitle: data.promptTitle,
            promptCategoryId: prompt?.categoryId || 'creative',
            messages: data.messages.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date()
            })),
            createdAt,
            updatedAt
          });
        });

        // Sort chats in memory
        chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        console.log('LoadChats: Successfully loaded chats', {
          count: chats.length,
          chatIds: chats.map(c => c.id)
        });

        setSavedChats(chats);
      } catch (error: any) {
        console.error('LoadChats: Error loading chats', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSavedChats();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, isInitialized]);

  useEffect(() => {
    // Fetch prompts from Firestore on mount
    const fetchPrompts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'prompts'));
        const promptList: Prompt[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prompt));
        if (promptList.length > 0) {
          setPrompts(promptList);
        } else {
          setPrompts(dummyPrompts);
        }
      } catch (err) {
        console.error('Error fetching prompts from Firestore:', err);
        setPrompts(dummyPrompts);
      }
    };
    fetchPrompts();
  }, []);

  const getPromptsByCategory = (categoryId: string) => prompts.filter(prompt => prompt.categoryId === categoryId);

  const saveChat = async (chat: Omit<Chat, 'id'>): Promise<string> => {
    if (!user || !user.uid) {
      console.error('SaveChat: No authenticated user');
      throw new Error('User must be logged in to save chats');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('SaveChat: Starting save process', { 
        userId: user.uid,
        messageCount: chat.messages.length,
        promptId: chat.promptId
      });
      
      // Find the prompt to get its category
      const prompt = prompts.find(p => p.id === chat.promptId);
      
      const chatData = {
        userId: user.uid,
        promptId: chat.promptId || 'default',
        promptTitle: chat.promptTitle || 'Untitled Chat',
        promptCategoryId: prompt?.categoryId || 'creative', // Default to creative if no category found
        messages: chat.messages.map(msg => ({
          ...msg,
          timestamp: new Date()
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Create a new document reference in the chats collection
      const chatRef = doc(collection(db, 'chats'));
      console.log('SaveChat: Created document reference', { chatId: chatRef.id });
      
      // Save the chat data
      try {
        await setDoc(chatRef, chatData);
        console.log('SaveChat: Chat saved successfully', { chatId: chatRef.id });
        
        // Update local state
        setSavedChats(prevChats => {
          const newChat = { 
            id: chatRef.id, 
            ...chatData,
            promptCategoryId: prompt?.categoryId || 'creative'
          };
          return [newChat, ...prevChats];
        });
        
        return chatRef.id;
      } catch (saveError: any) {
        console.error('SaveChat: Error during save operation', {
          code: saveError.code,
          message: saveError.message,
          stack: saveError.stack
        });
        throw new Error(`Failed to save chat: ${saveError.message}`);
      }
    } catch (error: any) {
      console.error('SaveChat: Error saving chat', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateChat = async (chatId: string, chat: Omit<Chat, 'id'>): Promise<void> => {
    if (!user || !user.uid) {
      console.error('UpdateChat: No authenticated user');
      throw new Error('User must be logged in to update chats');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('UpdateChat: Starting update process', { 
        chatId,
        userId: user.uid,
        messageCount: chat.messages.length
      });
      
      const chatRef = doc(db, 'chats', chatId);
      
      // Find the prompt to get its category
      const prompt = prompts.find(p => p.id === chat.promptId);
      
      const chatData = {
        userId: user.uid,
        promptId: chat.promptId || 'default',
        promptTitle: chat.promptTitle || 'Untitled Chat',
        promptCategoryId: prompt?.categoryId || 'creative', // Default to creative if no category found
        messages: chat.messages.map(msg => ({
          ...msg,
          timestamp: new Date()
        })),
        updatedAt: new Date()
      };
      
      await updateDoc(chatRef, chatData);
      console.log('UpdateChat: Chat updated successfully', { chatId });
      
      // Update local state
      setSavedChats(prevChats => {
        const updatedChats = prevChats.map(c => 
          c.id === chatId 
            ? { ...c, ...chatData, promptCategoryId: prompt?.categoryId || 'creative' }
            : c
        );
        return updatedChats;
      });
    } catch (error: any) {
      console.error('UpdateChat: Error updating chat', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const editPrompt = async (promptId: string, text: string): Promise<void> => {
    if (!user || !user.uid) {
      console.error('EditPrompt: No authenticated user');
      throw new Error('You must be logged in to edit prompts');
    }
    
    if (!promptId || !text) {
      console.error('EditPrompt: Missing required parameters', { promptId, text });
      throw new Error('Prompt ID and text are required');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('EditPrompt: Starting edit process', { promptId, userId: user.uid });
      
      const originalPrompt = prompts.find(p => p.id === promptId);
      if (!originalPrompt) {
        console.error('EditPrompt: Original prompt not found', { promptId });
        throw new Error('Original prompt not found');
      }
      
      // Only save to userPrompts if the text is different from the original
      if (text === originalPrompt.text) {
        console.log('EditPrompt: No changes detected, not saving to userPrompts');
        return;
      }
      
      const userPromptId = `${user.uid}_${promptId}`;
      console.log('EditPrompt: Creating/updating user prompt', { userPromptId });
      
      const userPromptData = {
        userId: user.uid,
        originalPromptId: promptId,
        text,
        title: originalPrompt.title,
        categoryId: originalPrompt.categoryId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        _type: 'userPrompt'
      };
      
      const userPromptRef = doc(db, 'userPrompts', userPromptId);
      
      try {
        console.log('EditPrompt: Checking for existing user prompt');
        const existingDoc = await getDoc(userPromptRef);
        
        if (existingDoc.exists()) {
          console.log('EditPrompt: Updating existing user prompt');
          await setDoc(userPromptRef, {
            ...userPromptData,
            createdAt: existingDoc.data().createdAt,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } else {
          console.log('EditPrompt: Creating new user prompt');
          await setDoc(userPromptRef, userPromptData);
        }
        
        console.log('EditPrompt: Successfully saved user prompt');
      } catch (error: any) {
        console.error('EditPrompt: Firestore operation failed', error);
        if (error.code === 'permission-denied') {
          throw new Error('You do not have permission to edit this prompt');
        }
        throw new Error(`Failed to save customized prompt: ${error.message}`);
      }
      
    } catch (error: any) {
      console.error('EditPrompt: Operation failed', error);
      setError(error.message || 'Failed to save customized prompt');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string): Promise<void> => {
    if (!user || !user.uid) {
      console.error('DeleteChat: No authenticated user');
      throw new Error('User must be logged in to delete chats');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('DeleteChat: Starting delete process', { chatId });
      
      const chatRef = doc(db, 'chats', chatId);
      await deleteDoc(chatRef);
      
      console.log('DeleteChat: Chat deleted successfully', { chatId });
      
      // Update local state
      setSavedChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    } catch (error: any) {
      console.error('DeleteChat: Error deleting chat', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    console.log('Waiting for auth to initialize before rendering DataContext...');
    return null;
  }

  return (
    <DataContext.Provider value={{
      prompts,
      categories,
      savedChats,
      isLoading,
      error,
      getPromptsByCategory,
      saveChat,
      updateChat,
      editPrompt,
      deleteChat
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
