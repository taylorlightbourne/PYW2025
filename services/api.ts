import { Platform } from 'react-native';

// For web, use relative path; for native, use full URL
const API_URL = Platform.select({
  web: '/api',  // This will be handled by Firebase hosting rewrites
  default: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.0.219:3000/api'
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
  try {
    console.log('API: Starting sendMessage request', { 
      messages, 
      url: `${API_URL}/chat/send`,
      messageCount: messages.length,
      platform: Platform.OS
    });
    
    const response = await fetch(`${API_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ messages }),
    });

    console.log('API: Received response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', { 
        status: response.status, 
        statusText: response.statusText,
        error,
        url: `${API_URL}/chat/send`
      });
      throw new Error(error.message || `Failed to send message: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API: Successfully parsed response:', { 
      responseLength: data.response?.length,
      preview: data.response?.substring(0, 50) + '...'
    });

    if (!data.response) {
      console.error('API: No response in data:', data);
      throw new Error('No response received from server');
    }

    return data.response;
  } catch (error: any) {
    console.error('API: Error in sendMessage:', {
      error: error.message,
      stack: error.stack,
      url: `${API_URL}/chat/send`
    });
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  // For now, return an empty string since we're not using authentication yet
  return '';
}; 