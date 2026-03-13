import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptType, getPromptTemplate } from './prompts.js';

const chainCache = new Map<string, RunnableSequence>();

export function buildQAChain(model: BaseChatModel, promptType: PromptType): RunnableSequence {
  const cacheKey = `${model.constructor.name}_${promptType}`;

  if (chainCache.has(cacheKey)) {
    return chainCache.get(cacheKey)!;
  }

  const prompt = getPromptTemplate(promptType);
  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  chainCache.set(cacheKey, chain);
  return chain;
}