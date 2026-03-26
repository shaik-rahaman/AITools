# RAGAS & All Metrics - Architecture & Flow Diagrams

## 📋 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/TypeScript)                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              LLMEvalForm Component                         │    │
│  │  ┌──────────────────────────────────────────────────────┐ │    │
│  │  │  Metric Dropdown (10 options)                        │ │    │
│  │  │  ┌─ Individual Metrics (7)                           │ │    │
│  │  │  │  • Faithfulness                                   │ │    │
│  │  │  │  • Answer Relevancy                               │ │    │
│  │  │  │  • Contextual Precision                           │ │    │
│  │  │  │  • Contextual Recall                              │ │    │
│  │  │  │  • PII Leakage                                    │ │    │
│  │  │  │  • Bias                                           │ │    │
│  │  │  │  • Hallucination                                  │ │    │
│  │  │  ├─ Composite & All (3) ✨ NEW                       │ │    │
│  │  │  │  • RAGAS (Composite)                              │ │    │
│  │  │  │  • All DeepEval Metrics                           │ │    │
│  │  │  │  • All RAGAS Metrics                              │ │    │
│  │  │  └─────────────────────────────────────────────────  │ │    │
│  │  └──────────────────────────────────────────────────────┘ │    │
│  │                                                            │    │
│  │  Form Fields (Dynamic Display)                            │    │
│  │  • Query (Always shown)                                   │    │
│  │  • Output (Hidden for contextual metrics)                 │    │
│  │  • Context (Required for most metrics)                    │    │
│  │  • Expected Output (Required for RAGAS metrics)           │    │
│  │                                                            │    │
│  │  Submit → validation.ts → llmEvalApi.ts                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              llmEvalApi.ts (Services)                      │    │
│  │                                                            │    │
│  │  evaluateLLM(formData)                                     │    │
│  │         ↓                                                  │    │
│  │    Check metric type                                       │    │
│  │         ↓                                                  │    │
│  │    ┌────────────────────────────────────────────────────┐ │    │
│  │    │ RAGAS Metrics?                                     │ │    │
│  │    │ ✓ faithfulness                                     │ │    │
│  │    │ ✓ contextual_precision                             │ │    │
│  │    │ ✓ contextual_recall                                │ │    │
│  │    │ ✓ ragas          ✨ NEW                            │ │    │
│  │    │ ✓ all_ragas      ✨ NEW                            │ │    │
│  │    └────────────────────────────────────────────────────┘ │    │
│  │              ↓ YES → evaluateWithRagas()                  │    │
│  │              ↓ NO                                          │    │
│  │    ┌────────────────────────────────────────────────────┐ │    │
│  │    │ DeepEval Metrics?                                  │ │    │
│  │    │ ✓ All others                                       │ │    │
│  │    │ ✓ all_deepeval  ✨ NEW                             │ │    │
│  │    └────────────────────────────────────────────────────┘ │    │
│  │              ↓ YES → evaluateWithDeepEval()               │    │
│  │              ↓ NO → Error                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              ResponsePanel (Display)                       │    │
│  │  • Single metric: Shows score + explanation               │    │
│  │  • All metrics: Shows overall score + results array        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
              ↓ HTTP POST with metric & fields
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              evalRoutes.ts                                 │    │
│  │                                                            │    │
│  │  POST /api/eval-only (Enhanced)                            │    │
│  │  POST /api/ragas/eval-only (NEW)  ✨                       │    │
│  │                                                            │    │
│  │  Handles:                                                  │    │
│  │  • Single metrics (existing)                               │    │
│  │  • ragas metric (NEW)                                      │    │
│  │  • all_deepeval (NEW)                                      │    │
│  │  • all_ragas (NEW)                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│           ↓                                                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              evalClient.ts (Services)                      │    │
│  │  • evalWithFields() - Enhanced to handle new metrics       │    │
│  └────────────────────────────────────────────────────────────┘    │
│           ↓                                                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              DeepEval Python Service                       │    │
│  │  (External HTTP service on port 8000)                      │    │
│  │                                                            │    │
│  │  • Individual metric evaluation                            │    │
│  │  • RAGAS component metrics                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
              ↓ HTTP Response with results
                Back to Frontend ResponsePanel
```

## 🔄 Request/Response Flow for "All" Metrics

### All DeepEval Metrics Flow

```
User selects "All DeepEval Metrics"
           ↓
Frontend validates form
  • Query ✓
  • Output ✓
  • Context ✓
  • Expected Output ✓ (only if needed)
           ↓
POST to /api/eval-only with metric="all_deepeval"
           ↓
Backend receives all_deepeval metric
           ↓
Backend loops through 7 metrics:
┌─────────────────────────────────────────┐
│ 1. faithfulness       → Call evalWithFields
│    ↓ Score: 0.85     ↓ Explanation: "..."
│
│ 2. answer_relevancy   → Call evalWithFields
│    ↓ Score: 0.92     ↓ Explanation: "..."
│
│ 3. contextual_precision → Call evalWithFields
│    ↓ Score: 0.78     ↓ Explanation: "..."
│
│ 4. contextual_recall  → Call evalWithFields
│    ↓ Score: 0.80     ↓ Explanation: "..."
│
│ 5. pii_leakage       → Call evalWithFields
│    ↓ Score: 0.95     ↓ Explanation: "..."
│
│ 6. bias              → Call evalWithFields
│    ↓ Score: 0.70     ↓ Explanation: "..."
│
│ 7. hallucination     → Call evalWithFields
│    ↓ Score: 0.88     ↓ Explanation: "..."
└─────────────────────────────────────────┘
           ↓
Calculate overall score = (0.85 + 0.92 + 0.78 + 0.80 + 0.95 + 0.70 + 0.88) / 7
                        = 5.88 / 7 = 0.84
           ↓
Determine verdict = "EXCELLENT" (>= 0.75)
           ↓
Response to frontend:
{
  metric: "all_deepeval",
  score: 0.84,
  verdict: "EXCELLENT",
  explanation: "Comprehensive evaluation across 7 metrics. Average score: 0.84",
  results: [
    {metric_name: "faithfulness", score: 0.85, verdict: "GOOD", ...},
    {metric_name: "answer_relevancy", score: 0.92, verdict: "EXCELLENT", ...},
    // ... 5 more
  ]
}
           ↓
Frontend displays ResponsePanel with:
• Overall score: 0.84
• Verdict: EXCELLENT
• Expandable results for each metric
```

### RAGAS Composite Metric Flow

```
User selects "RAGAS (Composite)"
           ↓
Frontend validates form
  • Query ✓
  • Output ✓
  • Context ✓
  • Expected Output ✓ (REQUIRED)
           ↓
POST to /api/eval-only with metric="ragas"
           ↓
Backend receives ragas metric
           ↓
Backend loops through 3 RAGAS components:
┌──────────────────────────────────────┐
│ 1. faithfulness          → evalWithFields
│    ↓ Score: 0.85        ↓ Explanation: "..."
│
│ 2. contextual_precision  → evalWithFields
│    ↓ Score: 0.78        ↓ Explanation: "..."
│
│ 3. contextual_recall     → evalWithFields
│    ↓ Score: 0.80        ↓ Explanation: "..."
└──────────────────────────────────────┘
           ↓
Calculate overall score = (0.85 + 0.78 + 0.80) / 3
                        = 2.43 / 3 = 0.81
           ↓
Determine verdict = "HIGH" (>= 0.7)
           ↓
Response to frontend:
{
  metric: "ragas",
  score: 0.81,
  verdict: "HIGH",
  explanation: "RAGAS evaluation combining faithfulness, context_precision, and context_recall...",
  results: [
    {metric_name: "faithfulness", score: 0.85, verdict: "...", ...},
    {metric_name: "contextual_precision", score: 0.78, verdict: "...", ...},
    {metric_name: "contextual_recall", score: 0.80, verdict: "...", ...}
  ]
}
           ↓
Frontend displays results
```

## 🧭 Metric Selection Decision Tree

```
Select a metric
    ↓
    ├─ Want to evaluate ONE specific aspect?
    │  └─ Use Individual Metrics (7 options)
    │     └─ Result: Single score + explanation
    │
    ├─ Want comprehensive RAG evaluation?
    │  ├─ In one composite metric?
    │  │  └─ Use "RAGAS (Composite)"
    │  │     └─ Result: One RAGAS score (avg of 3 components)
    │  │
    │  └─ See all component scores?
    │     └─ Use "All RAGAS Metrics"
    │        └─ Result: 3 component scores + average
    │
    └─ Want COMPLETE LLM output audit?
       └─ Use "All DeepEval Metrics"
          └─ Result: 7 metric scores + overall average
```

## 📊 Metric Requirement Matrix

```
                  Query  Output  Context  Expected  Endpoint
                                          Output    
─────────────────────────────────────────────────────────────
faithfulness       ✓      ✓       ✓        ✗       /eval-only
answer_relevancy   ✓      ✓       ✗        ✗       /eval-only
contextual_p...    ✓      ✗       ✓        ✓       /eval-only
contextual_r...    ✓      ✗       ✓        ✓       /eval-only
pii_leakage        ✓      ✓       ✗        ✗       /eval-only
bias               ✓      ✓       ✗        ✗       /eval-only
hallucination      ✓      ✓       ✓        ✗       /eval-only
─────────────────────────────────────────────────────────────
ragas              ✓      ✓       ✓        ✓       /ragas or /eval-only
all_deepeval       ✓      ✓       ✓        ✓*      /eval-only
all_ragas          ✓      ✗       ✓        ✓       /ragas or /eval-only
─────────────────────────────────────────────────────────────

✓  = Required
✗  = Not required
✓* = Required for contextual metrics only
```

## 🔗 Dependency Chain

```
User Action (Select Metric)
    ↓
Dropdown renders via getMetricsForProvider() [validation.ts]
    ↓
User submits form
    ↓
validateForm() [validation.ts] checks requirements
    ├─ shouldShowExpectedOutput() [validation.ts]
    ├─ shouldShowLLMOutput() [validation.ts]
    └─ isContextRequired() [validation.ts]
    ↓
evaluateLLM() [llmEvalApi.ts] routes to provider
    ├─ evaluateWithRagas() [llmEvalApi.ts]
    │   → POST /api/ragas/eval-only
    │   → Backend /ragas/eval-only route
    │   → evalWithFields() [evalClient.ts]
    │
    └─ evaluateWithDeepEval() [llmEvalApi.ts]
        → POST /api/eval-only
        → Backend /eval-only route
        → evalWithFields() [evalClient.ts]
    ↓
Backend processes (loops for "All" metrics)
    ↓
DeepEval Python service evaluates
    ↓
Response to frontend with results
    ↓
ResponsePanel displays results [ResponsePanel.tsx]
    ├─ Single metric → Simple display
    └─ All metrics → Expandable results array
```

## 🎯 Verdict Assignment Logic

### DeepEval Verdicts
- **Score >= 0.75**: EXCELLENT ✓✓✓
- **Score >= 0.50**: GOOD ✓✓
- **Score < 0.50**: NEEDS_IMPROVEMENT ✓

### RAGAS Verdicts
- **Score >= 0.70**: HIGH ✓✓✓
- **Score >= 0.50**: PARTIAL ✓✓
- **Score < 0.50**: LOW ✓

### Component-specific Verdicts
Each metric has specialized verdicts:
- Faithfulness: FACTUAL, PARTIAL_HALLUCINATION, HALLUCINATED
- Answer Relevancy: RELEVANT, PARTIAL, NOT_RELEVANT
- PII Leakage: SAFE, PARTIAL_LEAKAGE, HIGH_LEAKAGE
- Bias: UNBIASED, PARTIAL_BIAS, BIASED
- etc.

