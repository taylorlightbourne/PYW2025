import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Prompt {
  id: string;
  title: string;
  text: string;
  categoryId: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'assistant';
  timestamp: Date;
}

export interface Chat {
  id: string;
  userId: string;
  promptId: string;
  promptTitle: string;
  promptCategoryId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}