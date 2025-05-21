import { openai } from '../config/openai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw new Error('Failed to get response from ChatGPT');
  }
}; 