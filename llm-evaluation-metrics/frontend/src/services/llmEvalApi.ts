import axios, { AxiosError } from 'axios';
import { FormState, LLMEvalResponse, ApiError } from '../components/LLMEval/types';

const BACKEND_URL = 'http://localhost:3002';

const backendInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 1200000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Evaluate using RAGAS provider (single RAGAS metric or all RAGAS metrics)
 * Supports: faithfulness, context_precision, context_recall, ragas, all_ragas
 */
export const evaluateWithRagas = async (formData: FormState): Promise<LLMEvalResponse> => {
  try {
    // Filter out empty context items before sending
    const payload = {
      metric: formData.metric,
      query: formData.query,
      output: formData.output,
      context: formData.context.filter((ctx) => ctx.trim().length > 0),
      expected_output: formData.expected_output, // Required for RAGAS metrics
    };

    console.log('📤 RAGAS Request:', payload);

    const response = await backendInstance.post<LLMEvalResponse>(
      '/api/ragas/eval-only',
      payload
    );

    console.log('📥 RAGAS Response:', response.data);
    return {
      ...response.data,
      provider: 'ragas' as const,
    };
  } catch (error) {
    console.error('❌ RAGAS Error:', error);
    
    let apiError: ApiError;
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string; detail?: string }>;
      apiError = {
        message: 'Failed to evaluate with RAGAS',
        status: axiosError.response?.status,
        details:
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message,
      };
    } else if (error instanceof Error) {
      apiError = {
        message: 'Network error or unexpected error',
        details: error.message,
      };
    } else {
      apiError = {
        message: 'An unknown error occurred',
        details: String(error),
      };
    }

    throw apiError;
  }
};

/**
 * Evaluate using DeepEval provider (single metric or all metrics)
 * Supports: faithfulness, answer_relevancy, contextual_precision, contextual_recall, pii_leakage, bias, hallucination, all_deepeval
 */
export const evaluateWithDeepEval = async (formData: FormState): Promise<LLMEvalResponse> => {
  try {
    const payload = {
      metric: formData.metric,
      query: formData.query,
      output: formData.output,
      context: formData.context.filter((ctx) => ctx.trim().length > 0),
      expected_output: formData.expected_output, // Required for contextual_recall and contextual_precision
    };

    console.log('📤 DeepEval Request:', payload);

    // Route through backend for clean response (without results array)
    const response = await backendInstance.post<LLMEvalResponse>(
      '/api/eval-only',
      payload
    );

    console.log('📥 DeepEval Response:', response.data);
    return {
      ...response.data,
      provider: 'deepeval' as const,
    };
  } catch (error) {
    console.error('❌ DeepEval Error:', error);
    
    let apiError: ApiError;
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string; detail?: string }>;
      apiError = {
        message: 'Failed to evaluate with DeepEval',
        status: axiosError.response?.status,
        details:
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message,
      };
    } else if (error instanceof Error) {
      apiError = {
        message: 'Network error or unexpected error',
        details: error.message,
      };
    } else {
      apiError = {
        message: 'An unknown error occurred',
        details: String(error),
      };
    }

    throw apiError;
  }
};

/**
 * Universal LLM evaluation function that routes to the correct provider
 * Routes based on metric selection and provider:
 * - If provider is 'deepeval' → DeepEval endpoint
 * - If metric is explicitly RAGAS composite or all_ragas → appropriate endpoint
 */
export const evaluateLLM = async (formData: FormState): Promise<LLMEvalResponse> => {
  // RAGAS composite metrics that must use RAGAS endpoint
  const ragasOnlyMetrics = ['ragas', 'all_ragas'];
  
  // If it's a RAGAS-only metric, use RAGAS endpoint
  if (ragasOnlyMetrics.includes(formData.metric)) {
    return evaluateWithRagas(formData);
  } 
  // Individual metrics (faithfulness, contextual_precision, contextual_recall) can go to either,
  // so route based on provider preference
  else if (formData.provider === 'ragas' && 
           ['faithfulness', 'contextual_precision', 'contextual_recall'].includes(formData.metric)) {
    return evaluateWithRagas(formData);
  } 
  // Default to DeepEval for all others
  else {
    return evaluateWithDeepEval(formData);
  }
};

// Backward compatibility exports (deprecated)
/** @deprecated Use evaluateWithRagas instead */
export const evalRagas = evaluateWithRagas;

/** @deprecated Use evaluateWithDeepEval instead */
export const evalDeepEval = evaluateWithDeepEval;

/** @deprecated Use evaluateLLM instead */
export const evaluate = evaluateLLM;

