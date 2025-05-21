import { Category, Prompt, Chat, Message } from '@/types/data';

export const dummyCategories: Category[] = [
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: 'heart',
    color: '#FF6B6B'
  },
  {
    id: 'beauty',
    name: 'Beauty & Style',
    icon: 'sparkles',
    color: '#4ECDC4'
  },
  {
    id: 'work',
    name: 'Career & Work',
    icon: 'briefcase',
    color: '#6A0572'
  },
  {
    id: 'personal',
    name: 'Personal Growth',
    icon: 'trending-up',
    color: '#F7B801'
  },
  {
    id: 'creative',
    name: 'Creative Projects',
    icon: 'palette',
    color: '#7400B8'
  }
];

export const dummyPrompts: Prompt[] = [
  {
    id: 'health-1',
    title: 'Create a personalized morning fitness routine',
    text: 'I need a morning fitness routine that takes about 20 minutes. I want something that combines cardio and strength training but requires no equipment. Focus on exercises that can be done in a small space. Please include warm-up and cool-down stretches.',
    categoryId: 'health'
  },
  {
    id: 'health-2',
    title: 'Design a weekly meal plan for plant-based eating',
    text: 'I want to transition to a more plant-based diet. Can you create a 7-day meal plan with breakfast, lunch, dinner, and two snacks? Focus on whole foods, adequate protein sources, and meals that can be prepared in under 30 minutes. I have no allergies but don\'t like mushrooms.',
    categoryId: 'health'
  },
  {
    id: 'beauty-1',
    title: 'Skincare routine for oily, acne-prone skin',
    text: 'I need a skincare routine for oily skin that\'s prone to breakouts. Please recommend a morning and evening routine, including product types (not specific brands). I\'m looking for advice on cleansers, treatments, and moisturizers that won\'t clog pores but will help with oil control and acne prevention.',
    categoryId: 'beauty'
  },
  {
    id: 'beauty-2',
    title: 'Capsule wardrobe essentials for fall season',
    text: 'I want to create a minimalist capsule wardrobe for fall. Please recommend 15 essential items that can be mixed and matched for both casual and business casual settings. Include clothing, shoes, and accessories. My style preference is classic with modern touches, and I prefer neutral colors with occasional pops of color.',
    categoryId: 'beauty'
  },
  {
    id: 'work-1',
    title: 'Effective email templates for workplace communication',
    text: 'I need templates for common workplace emails that sound professional but friendly. Please provide templates for: 1) Following up on a project, 2) Requesting feedback, 3) Declining a meeting request politely, 4) Introducing a new team member, and 5) Addressing a missed deadline. Each template should be concise and customizable.',
    categoryId: 'work'
  },
  {
    id: 'work-2',
    title: 'Negotiation script for salary discussion',
    text: 'I have a performance review coming up and want to negotiate a salary increase. Please provide a script I can use to confidently ask for a raise. Include how to highlight my achievements, market value research, and how to respond to potential pushback. I\'ve been with the company for 2 years and have taken on responsibilities beyond my original role.',
    categoryId: 'work'
  },
  {
    id: 'personal-1',
    title: 'Daily mindfulness practice for anxiety management',
    text: 'I\'m looking for a short daily mindfulness practice to help manage anxiety. Please suggest a 10-minute routine that incorporates breathing techniques, gentle movement, and guided visualization. I\'m a beginner to mindfulness and need something I can do at home, preferably in the morning before work.',
    categoryId: 'personal'
  },
  {
    id: 'creative-1',
    title: 'Creative writing prompt for short story',
    text: 'I\'d like a detailed creative writing prompt for a short story with elements of magical realism. Please include suggestions for the setting, main character(s), a central conflict, and a twist or unique element that makes the story stand out. I prefer character-driven narratives and am interested in exploring themes of identity and transformation.',
    categoryId: 'creative'
  }
];