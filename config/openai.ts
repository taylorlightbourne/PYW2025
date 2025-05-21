import OpenAI from 'openai';

// You'll need to replace this with your actual API key
export const OPENAI_API_KEY = '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';

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow browser usage
}); 