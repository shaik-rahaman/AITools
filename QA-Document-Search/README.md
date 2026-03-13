# QA Bot - Document Question & Answer

A single-server, full-stack document Question & Answer application built with Node.js, Express, TypeScript, and LangChain.

## Features

- Upload multiple documents (PDF, DOCX, CSV, TXT)
- Ask natural language questions about your documents
- Multiple response styles: Default, Detailed, Concise, Technical
- Pluggable AI providers: Groq, OpenAI, Anthropic
- Drag-and-drop file upload interface
- RESTful API endpoints

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:8787
   ```

## API Endpoints

- `GET /` - Serves the frontend application
- `GET /health` - Health check with model information
- `POST /search/document` - Q&A with inline document text
- `POST /search/documents` - Q&A with uploaded files

## Environment Variables

See `.env.example` for all available configuration options.

**Required:** At least one AI provider API key (GROQ_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY)

## Development

- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run production server
- `npm run dev` - Run development server with hot reload

## Project Structure

```
├── index.html          # Frontend SPA
├── src/
│   ├── server.ts       # Express server and routes
│   ├── model.ts        # AI provider factory
│   ├── chain.ts        # LangChain QA pipeline
│   ├── prompts.ts      # Prompt templates
│   ├── loaders.ts      # Document parsers
│   └── types.ts        # TypeScript types and Zod schemas
├── uploads/            # Temporary file storage (auto-cleaned)
└── package.json        # Dependencies and scripts
```