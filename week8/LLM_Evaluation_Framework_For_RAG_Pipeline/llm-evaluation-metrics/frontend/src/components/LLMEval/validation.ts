import { FormState, FormValidationErrors } from './types';

/**
 * Individual DeepEval metrics
 */
const DEEPEVAL_METRICS = [
  'faithfulness',
  'answer_relevancy',
  'contextual_precision',
  'contextual_recall',
  'pii_leakage',
  'bias',
  'hallucination'
];

/**
 * RAGAS metric group (subset of DeepEval that are part of RAGAS composite)
 */
const RAGAS_METRICS = [
  'faithfulness',
  'contextual_precision',
  'contextual_recall'
];

export const validateForm = (formData: FormState): FormValidationErrors => {
  const errors: FormValidationErrors = {};

  // Validate metric
  if (!formData.metric) {
    errors.metric = 'Metric is required';
  }

  // Validate query
  if (!formData.query || !formData.query.trim()) {
    errors.query = 'Query is required';
  }

  // Validate output (NOT required for contextual_precision and contextual_recall)
  const metricsNotRequiringOutput = ['contextual_precision', 'contextual_recall'];
  if (!metricsNotRequiringOutput.includes(formData.metric)) {
    if (!formData.output || !formData.output.trim()) {
      errors.output = 'Output is required';
    }
  }

  // Validate context (required for specific metrics)
  const validContexts = formData.context.filter((ctx) => ctx && ctx.trim().length > 0);
  const metricsRequiringContext = ['contextual_precision', 'contextual_recall', 'hallucination', 'ragas', 'all_ragas', 'all_deepeval'];
  
  if (metricsRequiringContext.includes(formData.metric)) {
    if (validContexts.length === 0) {
      errors.context = 'At least one context item is required for this metric';
    } else {
      const emptyContexts = formData.context.filter((ctx) => !ctx || !ctx.trim());
      if (emptyContexts.length > 0) {
        errors.context = `${emptyContexts.length} context item(s) are empty`;
      }
    }
  }

  // expected_output validation - required for contextual_precision, contextual_recall, ragas, and all_ragas
  const metricsRequiringExpectedOutput = ['contextual_precision', 'contextual_recall', 'ragas', 'all_ragas'];
  if (metricsRequiringExpectedOutput.includes(formData.metric)) {
    if (!formData.expected_output || !formData.expected_output.trim()) {
      errors.expected_output = `Expected output is required for ${formData.metric} metric`;
    }
  }

  return errors;
};

export const isFormValid = (errors: FormValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Get all available metrics including individual, RAGAS, and All options
 */
export const getMetricsForProvider = (): string[] => {
  return [
    // Individual DeepEval metrics
    'faithfulness',
    'answer_relevancy',
    'contextual_precision',
    'contextual_recall',
    'pii_leakage',
    'bias',
    'hallucination',
    // Composite/Group metrics
    'ragas',
    'all_deepeval',
    'all_ragas'
  ];
};

/**
 * Get metric display name with formatting
 */
export const getMetricDisplayName = (metric: string): string => {
  const displayNames: Record<string, string> = {
    'faithfulness': 'Faithfulness',
    'answer_relevancy': 'Answer Relevancy',
    'contextual_precision': 'Contextual Precision',
    'contextual_recall': 'Contextual Recall',
    'pii_leakage': 'PII Leakage',
    'bias': 'Bias',
    'hallucination': 'Hallucination',
    'ragas': 'RAGAS (Composite)',
    'all_deepeval': 'All DeepEval Metrics',
    'all_ragas': 'All RAGAS Metrics'
  };
  
  return displayNames[metric] || metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, ' ');
};

/**
 * Check if expected_output field should be shown
 */
export const shouldShowExpectedOutput = (metric: string): boolean => {
  // contextual_precision, contextual_recall, ragas, and all_ragas require expected_output
  return ['contextual_precision', 'contextual_recall', 'ragas', 'all_ragas'].includes(metric);
};

/**
 * Check if LLM output field should be shown
 */
export const shouldShowLLMOutput = (metric: string): boolean => {
  // contextual_precision and contextual_recall don't use LLM output
  // They evaluate context quality, not LLM output
  const metricsNotUsingOutput = ['contextual_precision', 'contextual_recall'];
  return !metricsNotUsingOutput.includes(metric);
};

/**
 * Check if context field is required for the metric
 */
export const isContextRequired = (metric: string): boolean => {
  // Context is required for: faithfulness, contextual_precision, contextual_recall, hallucination, ragas, all_ragas, all_deepeval
  const metricsRequiringContext = ['faithfulness', 'contextual_precision', 'contextual_recall', 'hallucination', 'ragas', 'all_ragas', 'all_deepeval'];
  return metricsRequiringContext.includes(metric);
};;

