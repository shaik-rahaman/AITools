# Resume Search RAG

Minimal scaffold for RAG-based resume search API.

Run locally:

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install deps:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```
# Resume Search RAG

## Overview

The Resume Search RAG (Retrieval-Augmented Generation) project is designed to provide an enterprise-grade resume search API. This API focuses on delivering high-quality search results with a response time of approximately 3-5 seconds. It is built using Node.js and Express, with MongoDB for data storage and Mistral for embeddings and language model functionalities.

## Features

- **Low to Moderate Traffic Handling**: Optimized for quality-focused searches.
- **On-Demand Embeddings**: Utilizes the Mistral API to generate embeddings dynamically based on user queries.
- **Hybrid Search Capabilities**: Combines BM25 and vector search methodologies to enhance search accuracy.
- **LLM Re-Ranking**: Employs a language model to re-rank candidates based on relevance.
- **Centralized Logging**: Implements structured logging for monitoring and debugging.

## Project Structure

```
resume-search-rag
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   ├── env.ts
│   │   └── constants.ts
│   ├── middleware
│   │   ├── requestId.ts
│   │   ├── logging.ts
│   │   ├── errorHandler.ts
│   │   └── sizeLimit.ts
│   ├── routes
│   │   ├── health.ts
│   │   ├── search.ts
│   │   └── embeddings.ts
│   ├── services
│   │   ├── SearchService.ts
│   │   ├── EmbeddingService.ts
│   │   ├── LLMService.ts
│   │   └── LoggingService.ts
│   ├── repositories
│   │   └── ResumeRepository.ts
│   └── types
│       ├── index.ts
│       ├── request.ts
│       ├── response.ts
│       └── resume.ts
├── prompts
│   ├── COPILOT_INSTRUCTIONS.md
│   ├── rerank-prompt.txt
│   ├── summarize-prompt.txt
│   └── metadata-extraction-prompt.txt
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or Atlas)
- API keys for Mistral and any other services used

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resume-search-rag.git
   cd resume-search-rag
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

### Running the Application

To start the application, run:
```
npm start
```

The server will start on the configured port, and you can access the API endpoints.

### API Documentation

Refer to the individual route files in the `src/routes` directory for detailed API endpoint documentation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.