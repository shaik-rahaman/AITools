# Resume Intelligence Platform --- Frontend Architecture

## Project Overview

Build a modern AI‑powered Resume Intelligence Platform UI that allows
recruiters and hiring managers to:

-   Search candidate resumes using Keyword, Vector, or Hybrid search
-   Ask natural language queries via AI chat
-   View ranked candidate matches
-   Open resume viewer with structured candidate data
-   Manage conversation history
-   Refine candidate results through follow‑up conversational queries

Target users: - Recruiters - Hiring Managers - HR Analysts - Technical
Interviewers

The UI communicates with the QA Bot backend APIs.

------------------------------------------------------------------------

# Design Philosophy

Theme: AI Talent Intelligence Platform

UI Style: Modern AI SaaS interface similar to Perplexity, Linear, and
Vercel dashboards.

Design principles:

-   Chat‑first interaction
-   Fast search experience
-   Minimal cognitive load
-   Elegant motion design
-   Data‑rich candidate insights

------------------------------------------------------------------------

# Color Palette

Primary: #2563EB\
Secondary: #14B8A6\
Accent: #F59E0B

Background: #0B1220\
Surface: #111827\
Card: #1F2937

Text Primary: #E5E7EB\
Text Muted: #9CA3AF

Success: #22C55E\
Error: #EF4444

------------------------------------------------------------------------

# Technology Stack

Core - Vite - React 18 - TypeScript - React Router v6

State Management - Zustand

UI - TailwindCSS - Shadcn/ui - Lucide React Icons - Framer Motion

Data - Axios - React Query - React Hook Form - Zod Validation

Rendering - react-markdown - react-syntax-highlighter

Charts - Recharts

------------------------------------------------------------------------

# Project Structure

resume-intelligence-web/

public/ - favicon.ico - logo.svg

src/

main.tsx\
App.tsx

config/ - api.config.ts

lib/ api/ - search.api.ts - chat.api.ts - conversation.api.ts

stores/ - chat.store.ts - search.store.ts - ui.store.ts

utils/ - formatters.ts - date.ts

hooks/ - use-resume-search.ts - use-chat.ts -
use-conversation-history.ts - use-resume-viewer.ts

components/

layout/ - AppShell.tsx - Sidebar.tsx - TopNavbar.tsx - MobileDrawer.tsx

chat/ - ChatContainer.tsx - ChatMessage.tsx - ChatInput.tsx -
ChatSuggestionChips.tsx

search/ - SearchModeSelector.tsx - CandidateResultCard.tsx -
SearchResultsList.tsx - ResultScoreBadge.tsx

resume/ - ResumeViewerModal.tsx - CandidateHeader.tsx -
CandidateMetadata.tsx - SkillsTagList.tsx

conversation/ - ConversationHistoryPanel.tsx - ConversationItem.tsx

ui/ - LoadingSpinner.tsx - EmptyState.tsx - ErrorState.tsx

pages/ - ResumeSearchPage.tsx - ConversationPage.tsx - AnalyticsPage.tsx

types/ - search.types.ts - resume.types.ts - chat.types.ts

------------------------------------------------------------------------

# Core Layout

Sidebar \| Main Workspace

Sidebar contains: - Search mode selector - Filters - Conversation
history

Main workspace contains: - Chat interface - Candidate result cards -
Resume viewer modal

------------------------------------------------------------------------

# Sidebar

Search Modes:

-   Hybrid Search
-   Vector Search
-   Keyword Search

Filters:

-   Skills
-   Experience
-   Location
-   Current Company
-   Education

Conversation history shows previous recruiter queries.

------------------------------------------------------------------------

# Chat Interface

Primary interaction happens through AI chat.

ChatTopbar shows:

Resume Intelligence AI\
Search Mode\
LLM Provider

Welcome message example:

Welcome to the Resume Intelligence Platform.

Try asking:

• Find Python developers with ML experience\
• Show React engineers with AWS knowledge\
• DevOps engineers with Kubernetes

Suggestion chips:

-   Python ML engineers
-   React developers
-   DevOps Kubernetes engineers
-   Backend Java engineers

------------------------------------------------------------------------

# Candidate Result Cards

Each card displays:

Rank\
Candidate name\
Skills\
Experience\
Current company\
Location\
Relevance score

Example:

#1 Alice Johnson

Skills: Python, TensorFlow, PyTorch\
Experience: 6 years\
Company: TechCorp\
Score: 0.94

------------------------------------------------------------------------

# Resume Viewer

Clicking a result opens ResumeViewerModal.

Layout:

Candidate Header\
Candidate Metadata\
Skills and Highlights\
Full Resume Content

Metadata fields:

-   Current company
-   Experience
-   Key highlights
-   Skills
-   Location

------------------------------------------------------------------------

# API Integration

Base URL

VITE_API_BASE_URL=http://localhost:3000

Search resumes:

POST /search/resumes

Chat:

POST /chat

Conversation history:

POST /chat/history

Delete conversation:

DELETE /chat/:conversationId

------------------------------------------------------------------------

# State Management

Chat Store

-   messages
-   conversationId
-   addUserMessage()
-   addAssistantMessage()
-   clearConversation()

Search Store

-   searchType
-   results
-   setResults()
-   clearResults()

UI Store

-   sidebarOpen
-   resumeModalOpen
-   selectedCandidate

------------------------------------------------------------------------

# Animations

Framer Motion animations:

Chat bubbles: slide + fade\
Result cards: staggered fade\
Resume modal: scale animation\
Sidebar: slide transition

------------------------------------------------------------------------

# Mobile Experience

On mobile:

Sidebar becomes drawer\
Chat becomes full width\
Resume viewer becomes full screen modal\
Cards stack vertically

------------------------------------------------------------------------

# Running Frontend and Backend Together

Use **concurrently** to start both services.

Install:

npm install concurrently --save-dev

Root project structure:

project-root/ - backend/ - frontend/

Root package.json

{ "scripts": { "dev": "concurrently \"npm run backend\" \"npm run
frontend\"", "backend": "cd backend && npm run dev", "frontend": "cd
frontend && npm run dev" } }

Run both:

npm run dev

This will start:

Frontend → http://localhost:5173\
Backend → http://localhost:3000

------------------------------------------------------------------------

# Deployment

Frontend deployment:

Vercel

Environment variables:

VITE_API_BASE_URL=http://localhost:3000 VITE_APP_NAME=Resume
Intelligence AI

------------------------------------------------------------------------

# Expected User Flow

Recruiter enters query\
→ AI chat processes request\
→ Backend retrieval pipeline executes search\
→ Candidate results returned\
→ Recruiter opens resume viewer\
→ Recruiter refines query using follow-up chat
