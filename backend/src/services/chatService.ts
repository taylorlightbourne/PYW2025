import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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'
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
  try {
    console.log('Sending message to OpenAI:', { messageCount: messages.length });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('Received response from OpenAI:', { 
      responseLength: response.choices[0]?.message?.content?.length,
      preview: response.choices[0]?.message?.content?.substring(0, 50) + '...'
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw new Error('Failed to get response from ChatGPT');
  }
}; 