import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

const MODEL_PROVIDER = process.env.MODEL_PROVIDER || 'groq';
const TEMPERATURE = parseFloat(process.env.TEMPERATURE || '0.1');
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '4096');

export function createChatModel(): BaseChatModel {
  switch (MODEL_PROVIDER.toLowerCase()) {
    case 'groq':
      return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: process.env.GROQ_MODEL,
        temperature: TEMPERATURE,
      });
    case 'openai':
      return new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL,
        temperature: TEMPERATURE,
      });
    case 'anthropic':
      return new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
        model: process.env.ANTHROPIC_MODEL || process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        temperature: TEMPERATURE,
        maxTokens: MAX_TOKENS,
      });
    default:
      throw new Error(`Unsupported model provider: ${MODEL_PROVIDER}`);
  }
}

export function getModelInfo(): { model: string; provider: string } {
  switch (MODEL_PROVIDER.toLowerCase()) {
    case 'groq':
      return { model: process.env.GROQ_MODEL || 'llama3-8b-8192', provider: 'Groq' };
    case 'openai':
      return { model: process.env.OPENAI_MODEL || 'gpt-4o', provider: 'OpenAI' };
    case 'anthropic':
      return { model: process.env.ANTHROPIC_MODEL || process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022', provider: 'Anthropic' };
    default:
      return { model: 'unknown', provider: 'unknown' };
  }
}