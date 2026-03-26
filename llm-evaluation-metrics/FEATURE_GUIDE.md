# RAGAS & All Metrics Implementation - Feature Guide

## 📊 New Dropdown Structure

The metric selection dropdown now displays an organized categorization of all available evaluation options:

### Dropdown Layout:
```
┌─────────────────────────────────────────────┐
│ Individual Metrics                          │
├─────────────────────────────────────────────┤
│ • Faithfulness                              │
│ • Answer Relevancy                          │
│ • Contextual Precision                      │
│ • Contextual Recall                         │
│ • PII Leakage                               │
│ • Bias                                      │
│ • Hallucination                             │
├─────────────────────────────────────────────┤
│ Composite & All Metrics                     │
├─────────────────────────────────────────────┤
│ • RAGAS (Composite)                         │
│ • All DeepEval Metrics                      │
│ • All RAGAS Metrics                         │
└─────────────────────────────────────────────┘
```

## 🎯 Metric Categories Explained

### Individual Metrics (7 options)
These evaluate specific aspects of LLM output:

| Metric | Purpose | Requires | Output Required |
|--------|---------|----------|-----------------|
| **Faithfulness** | Output faithful to context | Context, Query | ✓ Yes |
| **Answer Relevancy** | Output relevant to query | Query | ✓ Yes |
| **Contextual Precision** | Context relevance ranking | Context, Expected Output | ✗ No |
| **Contextual Recall** | Context completeness | Context, Expected Output | ✗ No |
| **PII Leakage** | PII detection in output | Query | ✓ Yes |
| **Bias** | Bias detection in output | Query | ✓ Yes |
| **Hallucination** | Hallucination detection | Context, Query | ✓ Yes |

### Composite Metrics (3 options)

#### 🔄 RAGAS (Composite)
- **What it does**: Single composite metric that combines three RAGAS components
- **Components**: Faithfulness + Context Precision + Context Recall
- **Score**: Average of the three components
- **Requires**: Context, Query, Output, Expected Output
- **Use case**: Complete RAG system evaluation in one metric

#### 📦 All DeepEval Metrics
- **What it does**: Runs all 7 individual DeepEval metrics (except those requiring missing fields)
- **Returns**: Individual scores + overall average score
- **Requires**: Context, Query, Output (Expected Output for contextual metrics)
- **Use case**: Comprehensive evaluation of LLM output across all dimensions

#### 📦 All RAGAS Metrics
- **What it does**: Runs all 3 RAGAS component metrics
- **Components**: Faithfulness, Context Precision, Context Recall
- **Score**: Average of three components
- **Requires**: Context, Query (Optional), Expected Output
- **Use case**: Focused RAG evaluation without LLM output dependencies

## 🔀 Intelligent Field Management

The form automatically shows/hides required fields based on metric selection:

### Field Visibility Rules

| Metric | Query | Output | Context | Expected Output |
|--------|-------|--------|---------|-----------------|
| Faithfulness | ✓ | ✓ | ✓ | ✗ |
| Answer Relevancy | ✓ | ✓ | ✗ | ✗ |
| Contextual Precision | ✓ | ✗ | ✓ | ✓ |
| Contextual Recall | ✓ | ✗ | ✓ | ✓ |
| PII Leakage | ✓ | ✓ | ✗ | ✗ |
| Bias | ✓ | ✓ | ✗ | ✗ |
| Hallucination | ✓ | ✓ | ✓ | ✗ |
| RAGAS | ✓ | ✓ | ✓ | ✓ |
| All DeepEval | ✓ | ✓ | ✓ | ✓* |
| All RAGAS | ✓ | ✗ | ✓ | ✓ |

*Expected Output only shown when needed for contextual metrics

## 📥 Request Format Examples

### 1. Single RAGAS Metric
```json
{
  "metric": "ragas",
  "query": "What is machine learning?",
  "output": "Machine learning is...",
  "context": ["Context about ML..."],
  "expected_output": "Expected answer about ML..."
}
```

### 2. All DeepEval Metrics
```json
{
  "metric": "all_deepeval",
  "query": "How do I deploy?",
  "output": "To deploy, follow these steps...",
  "context": ["Deployment guide..."],
  "expected_output": "Expected deployment answer..."
}
```

### 3. All RAGAS Metrics
```json
{
  "metric": "all_ragas",
  "query": "What is RAG?",
  "context": ["RAG explanation..."],
  "expected_output": "Expected RAG definition..."
}
```

## 📤 Response Format Examples

### Single Metric Response
```json
{
  "metric": "faithfulness",
  "score": 0.85,
  "verdict": "GOOD",
  "explanation": "The output is largely faithful to the provided context...",
  "query": "What is AI?",
  "context": ["AI is..."]
}
```

### All Metrics Response
```json
{
  "metric": "all_deepeval",
  "score": 0.78,
  "verdict": "EXCELLENT",
  "explanation": "Comprehensive evaluation across 7 metrics. Average score: 0.78",
  "results": [
    {
      "metric_name": "faithfulness",
      "score": 0.85,
      "verdict": "EXCELLENT",
      "explanation": "Output is faithful to context"
    },
    {
      "metric_name": "answer_relevancy",
      "score": 0.92,
      "verdict": "EXCELLENT",
      "explanation": "Output directly addresses the query"
    },
    // ... 5 more metrics
  ]
}
```

## 🔄 Routing Logic

The system intelligently routes requests based on metric selection:

```
Frontend Metric Selection
    ↓
    ├─ RAGAS Metrics (faithfulness, contextual_precision, 
    │  contextual_recall, ragas, all_ragas)
    │  ↓
    │  → /api/ragas/eval-only endpoint
    │
    └─ DeepEval Metrics (all others including all_deepeval)
       ↓
       → /api/eval-only endpoint
```

## 💡 Usage Recommendations

### When to Use Each Option:

1. **Individual Metrics** - When you want to focus on a specific aspect of your LLM output
2. **RAGAS Composite** - When you need a single score for RAG system quality
3. **All DeepEval** - When conducting comprehensive quality audits
4. **All RAGAS** - When evaluating RAG performance without LLM output constraints

## ✅ Validation & Error Handling

- **Missing Context**: ❌ "At least one context item is required for this metric"
- **Missing Output**: ❌ "Output is required" (when needed by metric)
- **Missing Expected Output**: ❌ "Expected output is required for RAGAS metrics"
- **Empty Context**: ❌ "Context cannot be empty for hallucination metric"
- **Partial Failures**: ✓ When running "All" metrics, failures in individual metrics are logged but don't stop the overall evaluation

## 🚀 Performance Considerations

- **Single Metrics**: Fast (milliseconds)
- **All DeepEval**: Moderate (seconds - runs 7 evaluations in sequence)
- **All RAGAS**: Moderate (seconds - runs 3 evaluations in sequence)
- **Timeout**: 20 minutes per evaluation to handle comprehensive runs

## 🔐 Backward Compatibility

All existing code and workflows remain unchanged. The implementation:
- ✓ Preserves existing metric functionality
- ✓ Maintains same response structure for single metrics
- ✓ Extends ResponsePanel to handle results array
- ✓ Keeps all deprecated function names for compatibility

