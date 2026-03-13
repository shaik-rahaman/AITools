# QA Bot — System Architecture

## Overview

QA Bot is a single-server, full-stack document Question & Answer application.
Users upload one or more documents (PDF, DOCX, CSV, TXT) through a browser, type a natural-language question,
and receive an AI-generated answer drawn exclusively from the content of those documents.

The backend is a Node.js/Express server written in TypeScript. The frontend is a single vanilla-HTML page
served by the same server. LangChain orchestrates the prompt pipeline and communicates with a pluggable
AI provider (Groq, OpenAI, or Anthropic/Claude).

---

## High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        Client Browser                          │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐    │
│   │                  index.html  (SPA)                   │    │
│   │                                                      │    │
│   │   QABotApp (Vanilla JS class)                        │    │
│   │   ┌─────────────────┐  ┌───────────────────────┐    │    │
│   │   │  File Upload UI │  │  Question / Prompt UI  │    │    │
│   │   │  drag-and-drop  │  │  textarea + <select>   │    │    │
│   │   │  FileList mgmt  │  │  submit button         │    │    │
│   │   └────────┬────────┘  └──────────┬─────────────┘    │    │
│   │            │                      │                  │    │
│   │            └──────────────────────┘                  │    │
│   │                        │                             │    │
│   │              FormData (multipart)                    │    │
│   └────────────────────────┼─────────────────────────────┘    │
└────────────────────────────┼───────────────────────────────────┘
                             │  HTTP POST /search/documents
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                   Express Server  (server.ts)                  │
│                                                                │
│  Routes                                                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  GET  /                  → serve index.html              │ │
│  │  GET  /health            → model info + status           │ │
│  │  POST /search/document   → JSON body (path or text)      │ │
│  │  POST /search/documents  → multipart file upload         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Middleware                                                    │
│  ┌──────────────────────────┐  ┌───────────────────────────┐  │
│  │  express.json (50 MB)    │  │  multer (disk storage)    │  │
│  │                          │  │  10 MB/file · max 10 files│  │
│  │                          │  │  allowed: pdf docx txt csv│  │
│  └──────────────────────────┘  └───────────────────────────┘  │
│                                                                │
│  Core Modules                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │  loaders.ts     │  │  chain.ts         │  │  prompts.ts │  │
│  │                 │  │                  │  │             │  │
│  │  loadDocument   │  │  buildQAChain()  │  │  4 variants │  │
│  │  ToString()     │  │  LangChain pipe  │  │  default    │  │
│  │                 │  │  prompt→model    │  │  detailed   │  │
│  │  PDF  → pages   │  │    →parser       │  │  concise    │  │
│  │  DOCX → paras   │  │                  │  │  technical  │  │
│  │  CSV  → rows    │  │  In-memory cache │  │             │  │
│  │  TXT  → raw     │  │  per model+style │  │  ICE POT    │  │
│  └────────┬────────┘  └────────┬─────────┘  └─────────────┘  │
│           │                   │                               │
│           └───────────────────┘                               │
│                      │                                        │
│           ┌──────────▼──────────┐                             │
│           │     model.ts        │                             │
│           │                     │                             │
│           │  createChatModel()  │                             │
│           │  getModelInfo()     │                             │
│           │                     │                             │
│           │  Groq  |  OpenAI   |│                             │
│           │  Anthropic (Claude) │                             │
│           └──────────┬──────────┘                             │
│                      │                                        │
│           ┌──────────▼──────────┐                             │
│           │    types.ts         │                             │
│           │  Zod schemas        │                             │
│           │  InvokeSchema       │                             │
│           │  FileUploadSchema   │                             │
│           └─────────────────────┘                             │
└──────────────────────────────────┬─────────────────────────────┘
                                   │  HTTPS API call
                                   ▼
              ┌────────────────────────────────────┐
              │        AI Provider  (external)     │
              │                                    │
              │   Groq      (llama3, mixtral, …)   │
              │   OpenAI    (gpt-4o, gpt-4, …)     │
              │   Anthropic (claude-3-5-sonnet, …) │
              └────────────────────────────────────┘
```

---

## Component Details

### 1. Frontend — `index.html`

| Aspect | Detail |
|---|---|
| Technology | Vanilla HTML5 + CSS3 + ES2020 JavaScript (no framework) |
| Pattern | Single-class `QABotApp` with OOP-style event binding |
| File input | `<input type="file" multiple accept=".txt,.csv,.pdf,.docx">` |
| Drag & drop | `dragover / dragleave / drop` events on the drop-zone div |
| File list | Dynamic DOM manipulation; individual file removal via `DataTransfer` |
| Submission | `FormData` appending all files + `question` + `promptType` |
| API target | `POST /search/documents` (multipart/form-data) |
| Response | Parsed JSON; `escapeHtml()` used before rendering to prevent XSS |
| Loading UX | Spinner while awaiting response; button disabled |

### 2. Server Entry-Point — `src/server.ts`

| Aspect | Detail |
|---|---|
| Framework | Express 4 |
| JSON limit | 50 MB (for the inline-text endpoint) |
| Unique request IDs | `req_{timestamp}_{random}` logged on every request |
| File storage | `multer.diskStorage` → `uploads/` directory (auto-created) |
| Cleanup | Uploaded files deleted from disk after processing (both success and error paths) |
| Endpoints | See table below |

**API Endpoints**

| Method | Path | Payload | Description |
|---|---|---|---|
| `GET` | `/` | — | Serves `index.html` |
| `GET` | `/health` | — | Returns `{ status, timestamp, model }` |
| `POST` | `/search/document` | JSON `{ question, documentPath?, documentText?, promptType? }` | Single document Q&A via path or inline text |
| `POST` | `/search/documents` | `multipart/form-data` `files[]`, `question`, `promptType` | Multi-file upload Q&A |

### 3. Document Loaders — `src/loaders.ts`

| Format | Library | Output Strategy |
|---|---|---|
| `.pdf` | `@langchain/community` PDFLoader | Per-page sections: `[Page N]\n...` |
| `.docx` | `@langchain/community` DocxLoader | Paragraphs joined with `\n\n` |
| `.csv` | `@langchain/community` CSVLoader | Per-row sections: `[Row N]\n...` |
| `.txt` and other text types | Native `fs.readFile` | Raw content; truncated at 5 MB |

Loaders are lazily imported and cached in a `Map` to avoid module re-loading.
Files larger than 5 MB are automatically truncated with a warning.

### 4. QA Chain — `src/chain.ts`

Built with LangChain's `ChatPromptTemplate` pipeline:

```
ChatPromptTemplate (system + human)
        ↓
  BaseChatModel (provider-specific)
        ↓
  StringOutputParser
```

Chains are cached in a `Map` keyed by `{model_constructor_name}_{promptType}` to avoid rebuilding
on every request.

### 5. Prompt System — `src/prompts.ts`

All prompts follow the **ICE POT** format:
- **I**nstructions — step-by-step rules
- **C**ontext — injects the document via `{document}` placeholder
- **E**xamples — few-shot examples
- **P**ersona — role description
- **O**utput format — structure expectations
- **T**one — desired communication style

| Prompt Type | Use Case |
|---|---|
| `default` | Balanced, document-grounded answers |
| `detailed` | Comprehensive multi-aspect analysis |
| `concise` | Brief, bullet-point answers |
| `technical` | Technical precision and terminology |

### 6. Model Layer — `src/model.ts`

Pluggable via environment variables. Supports three providers:

| Provider | Env Var | Model Env Var |
|---|---|---|
| Groq (default) | `GROQ_API_KEY` | `GROQ_MODEL` |
| OpenAI | `OPENAI_API_KEY` | `OPENAI_MODEL` |
| Anthropic | `ANTHROPIC_API_KEY` or `CLAUDE_API_KEY` | `ANTHROPIC_MODEL` / `CLAUDE_MODEL` |

Common settings: `MODEL_PROVIDER`, `TEMPERATURE` (0–2), `MAX_TOKENS`.

### 7. Validation — `src/types.ts`

Zod schemas enforce request integrity at the API boundary:

| Schema | Fields | Rules |
|---|---|---|
| `InvokeSchema` | `question`, `documentPath?`, `documentText?`, `promptType?` | At least one of `documentPath` or `documentText` must be provided |
| `FileUploadSchema` | `question`, `promptType?` | Defaults `promptType` to `"default"` |

---

## Data Flow

### Multi-File Upload Flow (`POST /search/documents`)

```
Browser
  │
  ├─ User selects files + types question + chooses prompt style
  ├─ FormData built: files[], question, promptType
  └─ POST /search/documents
       │
       ▼
 Multer middleware
  ├─ Validates file types (.pdf .docx .txt .csv)
  ├─ Enforces 10 MB per file
  └─ Saves to uploads/{timestamp}-{random}.ext
       │
       ▼
 Route handler
  ├─ For each file: loadDocumentToString(file.path)
  │     ├─ PDF  → PDFLoader  → [Page N] sections
  │     ├─ DOCX → DocxLoader → paragraph text
  │     ├─ CSV  → CSVLoader  → [Row N] sections
  │     └─ TXT  → fs.readFile → raw content
  │
  ├─ Combine: "=== filename ===\ncontent\n\n---\n\n..."
  │
  ├─ createChatModel()      → provider instance
  ├─ buildQAChain(model, promptType) → cached LangChain pipeline
  ├─ chain.invoke({ document, question }) → AI response string
  │
  ├─ Delete uploaded files from disk
  │
  └─ Respond: { output, model, provider, promptType }
       │
       ▼
 Browser
  └─ Render answer + metadata (model / provider / style)
```

### Inline Text Flow (`POST /search/document`)

```
API Client (or legacy frontend)
  └─ POST /search/document  { question, documentText, promptType }
       │
       ▼
 Route handler
  ├─ Zod validation (InvokeSchema)
  ├─ Use documentText directly (no file I/O)
  ├─ createChatModel() + buildQAChain()
  ├─ chain.invoke({ document, question })
  └─ Respond: { output, model, provider, promptType }
```

---

## Project Structure

```
qa-bot-ts_fileupload/
├── index.html              ← Single-page frontend (SPA)
├── package.json            ← Dependencies and npm scripts
├── tsconfig.json           ← TypeScript ESM compiler config
│
├── src/
│   ├── server.ts           ← Express server, routes, multer config
│   ├── chain.ts            ← LangChain QA pipeline builder + cache
│   ├── loaders.ts          ← Document-to-string converters (PDF/DOCX/CSV/TXT)
│   ├── model.ts            ← AI provider factory (Groq / OpenAI / Anthropic)
│   ├── prompts.ts          ← Prompt templates (ICE POT, 4 variants)
│   └── types.ts            ← Zod schemas and TypeScript types
│
├── uploads/                ← Temporary upload staging (auto-created, auto-purged)
│
└── testdocs_questions/     ← Sample documents and test cases
    ├── fee1.txt
    ├── fee2.txt
    ├── fee3.txt
    └── Testcases_HealthCare_Ingestion_Pipeline_100.csv
```

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | >= 18.17 |
| Language | TypeScript (ESM) | ^5.6.3 |
| Web framework | Express | ^4.19.2 |
| AI orchestration | LangChain Core | ^0.3.0 |
| AI providers | @langchain/groq, openai, anthropic | see package.json |
| Document parsers | @langchain/community | ^0.3.57 |
| File upload | Multer | ^2.0.2 |
| PDF parser | pdf-parse | ^1.1.1 |
| DOCX parser | mammoth (via DocxLoader) | ^1.11.0 |
| Validation | Zod | ^3.23.8 |
| Frontend | Vanilla HTML/CSS/JS | ES2020 |
| Dev tooling | tsx (watch), tsc | ^4.16.2 / ^5.6.3 |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MODEL_PROVIDER` | No | `groq` | AI provider: `groq`, `openai`, `anthropic` |
| `GROQ_API_KEY` | Yes (Groq) | — | Groq API key |
| `GROQ_MODEL` | No | provider default | Groq model name |
| `OPENAI_API_KEY` | Yes (OpenAI) | — | OpenAI API key |
| `OPENAI_MODEL` | No | provider default | OpenAI model name |
| `ANTHROPIC_API_KEY` | Yes (Anthropic) | — | Anthropic API key |
| `ANTHROPIC_MODEL` | No | `claude-3-5-sonnet-20241022` | Anthropic model name |
| `TEMPERATURE` | No | `0.1` | Model temperature (0–2) |
| `MAX_TOKENS` | No | `4096` | Max output tokens (Anthropic only) |
| `PORT` | No | `8787` | Server port |
| `HOST` | No | `localhost` | Server host |
| `SERVER_URL` | No | `http://{HOST}:{PORT}` | Public server URL |

---

## Security Considerations

- **File type allowlist**: Only `.pdf`, `.docx`, `.txt`, `.csv` accepted by multer filter.
- **File size limit**: 10 MB per file, max 10 files per request.
- **Temp file cleanup**: Uploaded files are always deleted after processing (including on error).
- **XSS prevention**: Frontend uses `escapeHtml()` before inserting AI output into the DOM.
- **Input validation**: Zod schemas validate all incoming request bodies at the API boundary.
- **JSON payload cap**: 50 MB limit on the JSON endpoint prevents memory exhaustion via inline text.
- **no path traversal**: File paths are validated via `path.isAbsolute` and `path.join(process.cwd(), ...)`.
