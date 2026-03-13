# QA Bot Backend Architecture

## Project Overview

**QA Bot** is a TypeScript-based backend service that provides intelligent resume search and candidate analysis through a conversational RAG (Retrieval-Augmented Generation) system. It supports multiple search types (keyword, vector, hybrid) with optional LLM-based re-ranking and maintains conversation memory for multi-turn interactions.

**Tech Stack:**
- Runtime: Node.js 18.17+
- Language: TypeScript 5.6+
- Framework: Express.js 4.21+
- LLM Integration: LangChain Core 0.3.22+
- Database: MongoDB 6.10+
- Vector Store: MongoDB Atlas Vector Search
- Multiple LLM Providers: Groq, OpenAI, Anthropic, Mistral, Testleaf

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Express Server                       │
│                    (API Endpoints Layer)                    │
└────────────────┬─────────────────────────────────────────────┘
                 │
        ┌────────┴───────────────────────┐
        │                                │
┌───────▼──────────┐            ┌────────▼─────────────┐
│  Search Endpoints│            │   Chat Endpoints     │
│  - /search/*     │            │  - /chat             │
│  - Hybrid Search │            │  - /chat/history     │
│                  │            │  - /chat/:id (delete)│
└────────┬─────────┘            └────────┬──────────────┘
         │                              │
         ├──────────────────────────────┤
         │                              │
    ┌────▼──────────────────────────────▼────┐
    │      Retrieval Pipeline Layer          │
    │   (Core Search & Reranking Logic)      │
    └────┬──────────────────┬─────────────────┘
         │                  │
    ┌────▼────┐   ┌────────▼──────┐   ┌─────────────┐
    │ Keyword │   │ Vector Search │   │ Hybrid Merge│
    │ Search  │   │ Engine        │   │ Engine      │
    └─────────┘   └───────────────┘   └──────┬──────┘
                                             │
                                    ┌────────▼────────┐
                                    │ LLM Reranker    │
                                    │ (Optional)      │
                                    └────────┬────────┘
                                             │
    ┌────────────────────────────────────────┼───────────────┐
    │                                        │               │
┌───▼─────────────┐   ┌──────────────┐   ┌──▼────────┐  ┌──▼────────┐
│ Conversational  │   │   Memory     │   │ LLM Model │  │ MongoDB   │
│ RAG Chain       │   │   Manager    │   │  Factory  │  │ Collection│
│ (Multi-turn)    │   │ (Chat Ctx)   │   │           │  │           │
└─────────────────┘   └──────────────┘   └───────────┘  └───────────┘
```

---

## Core Components

### 1. **Server Layer** (`src/server.ts`)
The Express.js application server that handles HTTP requests and orchestrates the entire flow.

**Responsibilities:**
- HTTP endpoint routing and request validation
- Error handling and logging with request tracing
- Connection management (MongoDB, LLM models)
- Response formatting

**Key Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check and status |
| `/search/resumes` | POST | Resume search (keyword/vector/hybrid) |
| `/chat` | POST | Conversational search with memory |
| `/chat/history` | POST | Retrieve conversation history |
| `/chat/:conversationId` | DELETE | Delete conversation |

---

### 2. **Configuration Layer** (`src/config/index.ts`)
Centralized configuration management loading from environment variables.

**Managed Settings:**
- **Model Provider Selection**: Groq, OpenAI, Anthropic, Mistral, Testleaf
- **LLM Parameters**: Temperature (0-2), Max tokens (default 4096)
- **MongoDB Connection**: URI, database, collections, vector index names
- **Embeddings**: Model selection (default: Mistral Embed)
- **Hybrid Search**: Vector/Keyword weight tuning
- **LLM Re-ranking**: Toggle and configuration

---

### 3. **Retrieval Pipeline** (`src/pipelines/retrieval/`)
The core search orchestration layer that manages all search types and optional LLM re-ranking.

**Components:**

#### a. **RetrievalPipeline** (`pipeline.ts`)
Main orchestrator managing the complete search flow:
1. Route to appropriate search engine (keyword/vector/hybrid)
2. Apply LLM re-ranking if enabled
3. Return ranked results

**Key Features:**
- Flexible search type routing
- Configurable LLM re-ranking pipeline
- Request tracing for debugging
- Performance metrics collection

#### b. **KeywordSearchEngine** (`keywordSearch.ts`)
Full-text MongoDB search using text indexes.
- MongoDB text search API
- Score normalization (0-100)
- Fast, lexical matching

#### c. **VectorSearchEngine** (`vectorSearch.ts`)
Semantic vector search using embeddings.
- Mistral embeddings by default
- MongoDB Atlas Vector Search integration
- $vectorSearch aggregation pipeline
- Cosine similarity scoring

#### d. **HybridSearchEngine** (`hybridSearch.ts`)
Combines keyword and vector results using weighted normalization.

**Weighting Logic:**
```typescript
finalScore = (vectorScore * vectorWeight + keywordScore * keywordWeight) 
            / (vectorWeight + keywordWeight)
```
- Configurable weights
- Result deduplication (by name)
- Automatic score normalization

#### e. **LLMReranker** (`llmReranker.ts`)
Optional semantic re-ranking using LLM to refine initial results.

**Process:**
1. Retrieve top N candidates (default 10)
2. Send to LLM for relevance assessment
3. Re-rank based on semantic fit
4. Return top K final results

**Optional - Can be disabled** for faster responses or cost savings.

---

### 4. **Conversational RAG Chain** (`src/lib/conversationalRAGChain.ts`)
Manages multi-turn conversations with context preservation and search integration.

**Features:**
- Chat memory management with conversation history
- Dynamic search result caching
- Context-aware prompt construction
- Search result formatting for LLM input
- Structured result extraction

**Flow:**
```
User Message
    ↓
[Is filter query?] → YES → ConversationalFilter (filter cached results)
    ↓ NO
ConversationalRAGChainManager
    ↓
RAG Prompt Template + Chat History
    ↓
Retrieval Pipeline (hybrid search)
    ↓
Format results + LLM response
    ↓
Cache results for potential filtering
    ↓
Return structured response
```

---

### 5. **Conversational Filter** (`src/lib/conversationalFilter.ts`)
Intelligent filtering of cached search results for follow-up queries.

**Detection:**
- Filter keywords: "filter", "from those", "narrow down", etc.
- Follow-up detection on existing conversations
- Zero-shot classification using LLM

**Benefit:** Avoids redundant full searches for contextual refinements.

---

### 6. **Memory Management** (`src/lib/memory/`)

#### a. **ChatMemoryManager** (`chatMemory.ts`)
Per-conversation memory storage.

**Stored Data:**
- Message history (User/Assistant pairs)
- Last search results
- Conversation metadata

**Methods:**
- `addExchange()` - Add message pair to history
- `getMessages()` - Retrieve full conversation
- `setLastSearchResults()` - Cache search results
- `getLastSearchResults()` - Retrieve cached results
- `hasSearchResults()` - Check cache status

#### b. **ConversationStore** (`memory/index.ts`)
Global in-memory conversation registry.

**Purpose:**
- Map conversation IDs to ChatMemoryManager instances
- Lazy initialization (create on first use)
- Support cleanup and deletion

---

### 7. **Model Factory** (`src/lib/models/factory.ts`)
Centralized LLM model instantiation with multi-provider support.

**Supported Providers:**
- **Testleaf**: Custom wrapper (`ChatTestleaf`)
- **OpenAI**: GPT-4, GPT-4o, etc.
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, etc.
- **Mistral**: Mistral Large
- **Groq**: Fast inference models

**Factory Pattern:**
```typescript
createChatModel(): BaseChatModel
  → Reads MODEL_PROVIDER env variable
  → Validates required API keys
  → Returns configured LLM instance
```

---

### 8. **Vector Store** (`src/lib/vectorstore/`)

#### a. **ResumeVectorStore** (`resumeVectorStore.ts`)
MongoDB Atlas Vector Search wrapper.

**Responsibilities:**
- Index management (create, list, describe)
- Vector document insertion/deletion
- Similarity search queries
- Embedding generation integration

#### b. **Mistral Embeddings** (`embeddings/mistralEmbeddings.ts`)
Embedding generation using Mistral Embed model.
- Dimension: 1024
- Configurable via `MISTRAL_EMBEDDING_MODEL`
- Batch processing support

---

### 9. **Document Processing** (`src/lib/loaders.ts`, `src/utils/`)

**Supported Formats:**
- Plain text (`.txt`)
- PDF documents (`.pdf`)
- Microsoft Word (`.docx`)

**Processing Pipeline:**
1. Load file (local or remote)
2. Extract text content
3. Parse structured fields (email, phone)
4. Generate embeddings
5. Store in MongoDB

---

### 10. **Type Definitions** (`src/types/`)

#### a. **API Types** (`api.ts`)
- `InvokeSchema/InvokeBody` - QA chain invocation
- `ConversationalQuerySchema` - Chat requests
- `GetConversationHistorySchema` - History retrieval
- `ChatMessage` - Message format

#### b. **Search Types** (`search.ts`)
- `SearchRequest` - Query parameters
- `SearchResultItem` - Individual result
- `SearchResponse` - Complete response
- `ErrorResponse` - Error format

#### c. **Resume Types** (`resume.ts`)
- `ResumeData` - Structured resume fields
- `ExtractionResult` - Parsed document data

---

## Data Flow Diagrams

### Search Request Flow
```
POST /search/resumes
    ↓
[Validate with SearchRequestSchema]
    ↓
[Determine retrieval count]
    ↓ (LLM re-ranking enabled? → use retrievalTopK, else → use topK)
    ↓
[Execute Search Engine]
├─ keyword → KeywordSearchEngine.search()
├─ vector → VectorSearchEngine.search()
└─ hybrid → HybridSearchEngine.search()
    ↓
[Optional: LLM Re-ranking]
    ↓ (if enabled)
    ↓
[Normalize scores & limit to topK]
    ↓
[Format response with metadata]
    ↓
JSON Response (SearchResponse)
```

### Conversational Chat Flow
```
POST /chat
    ↓
[Validate with ConversationalQuerySchema]
    ↓
[Get or create conversation + memory]
    ↓
[Analyze message type]
    ↓
[Is filter query on cached results?] 
    ├─ YES → ConversationalFilter.filterResults()
    │         └─ Return filtered summary
    │
    └─ NO → ConversationalRAGChainManager.chat()
            ├─ Add to chat history
            ├─ Execute retrieval pipeline (hybrid search)
            ├─ Format results
            ├─ Call LLM with RAG prompt
            ├─ Cache results for potential filtering
            └─ Return response + results

[Format final response]
    ↓
JSON Response (ConversationalQueryResult)
```

### Hybrid Search Merge Logic
```
Query: "Python developers in NYC"
    ↓
┌─ Keyword Search → {score: 85}  ───┐
│                                    │
│  Both normalize to 0-100 scale    │
│                                    │
└─ Vector Search → {score: 72}   ───┤
                                     ↓
Weighted Average:
  finalScore = (85 × vectorWeight + 72 × keywordWeight) 
             / (vectorWeight + keywordWeight)
    ↓
[Sort by final score]
    ↓
[Deduplicate by name]
    ↓
Return top K results
```

---

## MongoDB Schema

### Collections

#### 1. **resumes** (default name via `MONGODB_COLLECTION`)
```typescript
{
  _id: ObjectId,
  name: string,          // Candidate name
  email: string,         // Email address
  phoneNumber: string,   // Phone
  content: string,       // Full resume text
  embedding: [1024],     // Vector embedding (Mistral 1024-dim)
  fileName: string,      // Original file name
  extractedInfo: {       // LLM-extracted fields
    currentCompany?: string,
    location?: string,
    skills?: string[],
    experience?: string,
    keyHighlights?: string[]
  },
  uploadedAt: Date,
  processedAt: Date
}
```

#### 2. **Vector Index** (MongoDB Atlas)
```json
{
  "name": "vector_index_resumes",
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "similarity": "cosine",
      "dimensions": 1024
    }
  ]
}
```

---

## API Request/Response Examples

### 1. Search Resumes
**Request:**
```json
{
  "query": "Python developer with 5 years experience",
  "searchType": "hybrid",
  "topK": 5
}
```

**Response:**
```json
{
  "query": "Python developer with 5 years experience",
  "searchType": "hybrid",
  "topK": 5,
  "resultCount": 3,
  "duration": 245,
  "results": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1-555-0100",
      "content": "5+ years Python development...",
      "score": 0.892,
      "matchType": "hybrid"
    }
  ],
  "metadata": {
    "hybridWeights": {
      "vector": 0.7,
      "keyword": 0.3
    },
    "traceId": "search_1234567890_abc123def"
  }
}
```

### 2. Conversational Chat
**Request:**
```json
{
  "message": "Find me Python developers with ML experience",
  "conversationId": "conv_123456_xyz789",
  "topK": 10,
  "includeHistory": true
}
```

**Response:**
```json
{
  "response": "I found 3 excellent candidates with Python and ML expertise...",
  "conversationId": "conv_123456_xyz789",
  "messageCount": 5,
  "model": "gpt-4o-mini",
  "provider": "testleaf",
  "searchResults": [
    {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phoneNumber": "+1-555-0101",
      "score": 0.945,
      "matchType": "hybrid",
      "extractedInfo": {
        "currentCompany": "Tech Corp",
        "skills": ["Python", "TensorFlow", "PyTorch"],
        "experience": "6 years"
      }
    }
  ],
  "searchMetadata": {
    "query": "Find me Python developers with ML experience",
    "searchType": "hybrid",
    "resultCount": 3,
    "duration": 312
  }
}
```

### 3. Get Conversation History
**Request:**
```json
{
  "conversationId": "conv_123456_xyz789"
}
```

**Response:**
```json
{
  "conversationId": "conv_123456_xyz789",
  "messageCount": 4,
  "messages": [
    {
      "role": "user",
      "content": "Find me Python developers"
    },
    {
      "role": "assistant",
      "content": "I found 5 Python developers..."
    }
  ]
}
```

---

## Key Features & Capabilities

### 1. **Multi-Provider LLM Support**
- Seamless provider switching via environment variable
- Unified interface through LangChain
- Provider-specific optimizations

### 2. **Flexible Search**
- **Keyword Search**: Fast, lexical matching
- **Vector Search**: Semantic similarity (embeddings)
- **Hybrid Search**: Combined relevance ranking

### 3. **Conversational Intelligence**
- Multi-turn conversation memory
- Filter queries on cached results
- Context preservation across interactions
- Conversation history management

### 4. **LLM Re-ranking**
- Optional semantic re-ranking pipeline
- Reduces hallucination through ranked relevance
- Configurable retrieval count
- Can be disabled for cost optimization

### 5. **Document Processing**
- Multiple format support (TXT, PDF, DOCX)
- Structured field extraction (email, phone, skills)
- Automatic embedding generation
- MongoDB integration

### 6. **Production Monitoring**
- Comprehensive request tracing with trace IDs
- Detailed logging at each pipeline stage
- Performance metrics (duration, result counts)
- Error tracking and stack traces

---

## Environment Variables

```bash
# Model Provider
MODEL_PROVIDER=groq              # Options: groq, openai, anthropic, mistral, testleaf
TEMPERATURE=0.1                  # 0-2 range
MAX_TOKENS=4096                  # Max output tokens

# LLM Provider Keys
GROQ_API_KEY=xxx
GROQ_MODEL=mixtral-8x7b-32768

OPENAI_API_KEY=xxx
OPENAI_MODEL=gpt-4o-mini

ANTHROPIC_API_KEY=xxx
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

MISTRAL_API_KEY=xxx
MISTRAL_EMBEDDING_MODEL=mistral-embed

TESTLEAF_API_KEY=xxx
TESTLEAF_MODEL=gpt-4o-mini

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DB_NAME=resumes-agent
MONGODB_COLLECTION=resumes
MONGODB_VECTOR_INDEX=vector_index_resumes

# Embeddings
EMBEDDING_PROVIDER=mistral       # Default: mistral

# Hybrid Search Configuration
HYBRID_SEARCH_VECTOR_WEIGHT=0.7
HYBRID_SEARCH_KEYWORD_WEIGHT=0.3

# LLM Re-ranking
LLM_RERANK_ENABLED=true
LLM_RERANK_RETRIEVAL_TOP_K=10
```

---

## Running the Backend

**Development:**
```bash
npm run dev                    # Watch mode with tsx
```

**Production:**
```bash
npm run build                 # Compile TypeScript
npm run start                 # Run compiled server
```

**Type Checking:**
```bash
npm run typecheck             # Verify TypeScript without compiling
```

**Server Port:**
- Default: `3000` (configurable via PORT env variable if added)
- Health check: `GET http://localhost:3000/health`

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Descriptive error message",
  "details": "Stack trace or additional context",
  "timestamp": "2024-03-13T10:30:00.000Z"
}
```

**Common Status Codes:**
- `200` - Successful request
- `400` - Validation error or processing error
- `404` - Conversation not found
- `500` - Server error

---

## Performance Considerations

### 1. **Search Performance**
- Keyword search: Fast (~50-100ms) with indexed collections
- Vector search: Medium (~100-300ms) depends on dataset size
- Hybrid search: Slightly slower than individual searches
- LLM re-ranking: Slowest (~500-1000ms) but optional

### 2. **Optimization Strategies**
- Enable/disable LLM re-ranking based on accuracy needs
- Tune hybrid weights for your dataset
- Use vector search for semantic requirements
- Cache results to avoid redundant searches
- Limit topK for large result sets

### 3. **Scaling**
- In-memory conversation storage (suitable for medium usage)
- MongoDB handles horizontal scaling of embeddings
- Multiple Express instances possible with external session store
- Consider Redis for conversation store in high-load scenarios

---

## Security Notes

- API keys stored in environment variables only
- No sensitive data in logs (use trace IDs for debugging)
- Request validation with Zod schemas
- Error responses don't expose internal implementation details
- MongoDB URI should use authenticated connections

---

## Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| @langchain/core | ^0.3.22 | Core LLM chain abstractions |
| @langchain/anthropic | ^0.3.8 | Claude model integration |
| @langchain/openai | ^0.3.15 | OpenAI models |
| @langchain/groq | ^0.1.3 | Groq models |
| @langchain/mistralai | ^0.2.1 | Mistral models |
| @langchain/community | ^0.3.16 | Community integrations |
| @langchain/mongodb | ^0.1.0 | MongoDB integration |
| mongodb | ^6.10.0 | MongoDB driver |
| express | ^4.21.1 | Web framework |
| zod | ^3.23.8 | Schema validation |
| pdf-parse | ^1.1.1 | PDF extraction |
| mammoth | ^1.8.0 | DOCX extraction |
| dotenv | ^16.4.7 | Environment variables |

---

## Future Enhancement Opportunities

1. **Persistent Conversation Storage**: Move from in-memory to MongoDB
2. **Conversation Expiration**: Auto-cleanup old conversations
3. **User Authentication**: Add auth layer for multi-user scenarios
4. **Rate Limiting**: Prevent abuse and control costs
5. **Caching Layer**: Redis for frequently accessed results
6. **Advanced Filtering**: More sophisticated context preservation
7. **Multi-document Context**: Support document sets beyond resumes
8. **Analytics**: Track popular queries and search patterns
9. **A/B Testing**: Test different search weights/reranking configs
10. **WebSocket Support**: Real-time streaming responses
