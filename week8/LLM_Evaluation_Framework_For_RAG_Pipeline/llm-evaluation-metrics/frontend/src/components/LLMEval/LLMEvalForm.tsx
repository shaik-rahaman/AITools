import React, { useState } from 'react';
import { FormState, MetricOption, LLMEvalResponse, FormValidationErrors, ApiError } from './types';
import { validateForm, isFormValid, getMetricsForProvider, shouldShowExpectedOutput, isContextRequired, shouldShowLLMOutput, getMetricDisplayName } from './validation';
import { ContextList } from './ContextList';
import { ResponsePanel } from './ResponsePanel';
import { evaluateLLM } from '../../services/llmEvalApi';

interface LLMEvalFormProps {
  onEvaluate?: (formData: FormState) => void;
}

export const LLMEvalForm: React.FC<LLMEvalFormProps> = ({ onEvaluate }) => {
  const [formState, setFormState] = useState<FormState>({
    provider: 'deepeval',
    metric: 'faithfulness' as MetricOption,
    query: '',
    output: '',
    context: [''],
    expected_output: '',
  });

  const [response, setResponse] = useState<LLMEvalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const availableMetrics = getMetricsForProvider();
  const showExpectedOutput = shouldShowExpectedOutput(formState.metric);
  const contextRequired = isContextRequired(formState.metric);
  const showLLMOutput = shouldShowLLMOutput(formState.metric);

  const handleMetricChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState({
      ...formState,
      metric: e.target.value as MetricOption,
    });
    // Clear metric error
    if (errors.metric) {
      const newErrors = { ...errors };
      delete newErrors.metric;
      setErrors(newErrors);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      query: e.target.value,
    });
    // Clear query error
    if (errors.query) {
      const newErrors = { ...errors };
      delete newErrors.query;
      setErrors(newErrors);
    }
  };

  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      output: e.target.value,
    });
    // Clear output error
    if (errors.output) {
      const newErrors = { ...errors };
      delete newErrors.output;
      setErrors(newErrors);
    }
  };

  const handleExpectedOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      expected_output: e.target.value,
    });
    // Clear expected_output error if present
    if (errors.expected_output) {
      const newErrors = { ...errors };
      delete newErrors.expected_output;
      setErrors(newErrors);
    }
  };

  const handleContextChange = (newContext: string[]) => {
    setFormState({
      ...formState,
      context: newContext,
    });
    // Clear context errors
    if (errors.context) {
      const newErrors = { ...errors };
      delete newErrors.context;
      setErrors(newErrors);
    }
  };

  const handleAddContext = () => {
    setFormState({
      ...formState,
      context: [...formState.context, ''],
    });
  };

  const handleEvaluate = async () => {
    setApiError(null);
    setResponse(null);

    const validationErrors = validateForm(formState);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      console.log('Form validation failed:', validationErrors);
      // Show validation errors to user
      setApiError({
        message: 'Form validation failed',
        details: Object.entries(validationErrors)
          .map(([field, error]) => `${field}: ${error}`)
          .join('; ')
      });
      return;
    }

    setIsLoading(true);
    let hadError = false;

    try {
      console.log(`📊 Starting LLM evaluation with metric: ${formState.metric}...`);
      console.log('Form state:', formState);
      const result = await evaluateLLM(formState);
      console.log('✅ LLM Evaluation successful:', result);
      setResponse(result);
    } catch (error) {
      hadError = true;
      console.error('❌ LLM Evaluation error:', error);
      let apiError: ApiError;
      
      if (error instanceof Error) {
        if ('status' in error || 'details' in error) {
          // Already an ApiError
          apiError = error as ApiError;
        } else {
          // Generic Error, convert to ApiError
          apiError = {
            message: error.message || 'Unknown error occurred',
            details: error.stack
          };
        }
      } else if (typeof error === 'object' && error !== null) {
        // Object but not Error
        apiError = error as ApiError;
      } else {
        // Something else
        apiError = {
          message: 'An unexpected error occurred',
          details: String(error)
        };
      }
      
      setApiError(apiError);
    } finally {
      setIsLoading(false);
      // Call callback on successful evaluation
      if (!hadError) {
        onEvaluate?.(formState);
      }
    }
  };

  return (
    <div className="llm-eval-form-container">
      {/* Framework Name Display Banner */}
      <div className="llm-eval-framework-banner">
        <div className="llm-eval-framework-badge">
          <span className="llm-eval-framework-label">Active Framework:</span>
          <span className="llm-eval-framework-name">🔍 DeepEval</span>
        </div>
      </div>

      {/* Active Provider Info */}
      <div className="provider-info deepeval">
        <p>
          ✓ <strong>DeepEval</strong> - Metrics: Faithfulness, Answer Relevancy, Contextual Precision, Contextual Recall, PII Leakage, Bias, Hallucination
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          📦 <strong>RAGAS</strong> - Composite metric combining Contextual Precision, Contextual Recall, Faithfulness
        </p>
      </div>

      {/* Metric Dropdown */}
      <div className="llm-eval-form-group">
        <label htmlFor="metric" className="llm-eval-form-label">
          Metric
          <span className="llm-eval-required">*</span>
        </label>
        <select
          id="metric"
          className={`llm-eval-input llm-eval-select ${errors.metric ? 'llm-eval-input-error' : ''}`}
          value={formState.metric}
          onChange={handleMetricChange}
        >
          <optgroup label="Individual Metrics">
            {availableMetrics.slice(0, 7).map((metric) => (
              <option key={metric} value={metric}>
                {getMetricDisplayName(metric)}
              </option>
            ))}
          </optgroup>
          <optgroup label="Composite & All Metrics">
            {availableMetrics.slice(7).map((metric) => (
              <option key={metric} value={metric}>
                {getMetricDisplayName(metric)}
              </option>
            ))}
          </optgroup>
        </select>
        {errors.metric && (
          <span className="llm-eval-error-message">{errors.metric}</span>
        )}
      </div>

      {/* Query Input */}
      <div className="llm-eval-form-group">
        <label htmlFor="query" className="llm-eval-form-label">
          Query/User Input
          <span className="llm-eval-required">*</span>
        </label>
        <input
          id="query"
          type="text"
          className={`llm-eval-input ${errors.query ? 'llm-eval-input-error' : ''}`}
          placeholder="Enter your query here"
          value={formState.query}
          onChange={handleQueryChange}
        />
        {errors.query && (
          <span className="llm-eval-error-message">{errors.query}</span>
        )}
      </div>

      {/* Output Textarea */}
      {showLLMOutput && (
        <div className="llm-eval-form-group">
          <label htmlFor="output" className="llm-eval-form-label">
            LLM Output/Actual output from LLM
            <span className="llm-eval-required">*</span>
          </label>
          <textarea
            id="output"
            className={`llm-eval-input llm-eval-textarea ${errors.output ? 'llm-eval-input-error' : ''}`}
            placeholder="Enter the output/response here"
            rows={4}
            value={formState.output}
            onChange={handleOutputChange}
          />
          {errors.output && (
            <span className="llm-eval-error-message">{errors.output}</span>
          )}
        </div>
      )}

      {/* Expected Output - For DeepEval contextual_recall and contextual_precision */}
      {showExpectedOutput && (
        <div className="llm-eval-form-group expected-output-group">
          <label htmlFor="expected_output" className="llm-eval-form-label expected-output-label">
            Expected Output <span className="llm-eval-required">*</span>
            <span className="label-info">
              {formState.metric === 'ragas' || formState.metric === 'all_ragas'
                ? '(Required for RAGAS metrics)'
                : '(Required for Contextual Precision and Contextual Recall metrics)'}
            </span>
          </label>
          <textarea
            id="expected_output"
            className={`llm-eval-input llm-eval-textarea expected-output-textarea ${errors.expected_output ? 'llm-eval-input-error' : ''}`}
            placeholder="Enter the expected/reference answer here"
            rows={4}
            value={formState.expected_output || ''}
            onChange={handleExpectedOutputChange}
          />
          {errors.expected_output && (
            <span className="llm-eval-error-message">{errors.expected_output}</span>
          )}
        </div>
      )}

      {/* Context List */}
      <ContextList
        context={formState.context}
        onContextChange={handleContextChange}
        errors={errors.context ? [errors.context] : []}
        contextRequired={contextRequired}
      />

      {/* Evaluate Button */}
      <button
        className="llm-eval-btn llm-eval-btn-evaluate"
        onClick={handleEvaluate}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Evaluating...' : '✨ Click for Evaluation'}
      </button>

      {/* API Error Display */}
      {apiError && (
        <div className="llm-eval-error-alert">
          <div className="llm-eval-error-header">
            <span className="llm-eval-error-icon">⚠️</span>
            <span className="llm-eval-error-title">Evaluation Failed</span>
          </div>
          <div className="llm-eval-error-message-box">{apiError.message}</div>
          {apiError.details && (
            <div className="llm-eval-error-details">{apiError.details}</div>
          )}
          {apiError.status && (
            <div className="llm-eval-error-status">Status Code: {apiError.status}</div>
          )}
        </div>
      )}

      {/* Response Panel */}
      <ResponsePanel response={response} isLoading={isLoading} />
    </div>
  );
};
