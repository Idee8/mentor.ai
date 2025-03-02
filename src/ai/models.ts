import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-google-small';

export const myProvider = customProvider({
  languageModels: {
    'chat-model-openai-small': openai('gpt-4o-mini'),
    'chat-model-openai-large': openai('gpt-4o'),
    'chat-model-google-small': google('gemini-1.5-pro'),
    'chat-model-google-large': google('gemini-2.0-flash-001'),
    'chat-model-reasoning': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/deepseek-v3'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': google('gemini-1.5-pro'),
    'artifact-model': openai('gpt-4o-mini'),
  },
  imageModels: {
    'small-model': openai.image('dall-e-2'),
    'large-model': openai.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-google-small',
    name: 'Gemini 1.5',
    description: 'Small model for fast, lightweight taks',
  },
  {
    id: 'chat-model-google-large',
    name: 'Gemini 2.0 Flash',
    description: 'Small model for fast, lightweight taks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
