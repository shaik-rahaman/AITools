# Resume Intelligence Platform - Frontend

A modern, AI-powered React 18 + TypeScript frontend for the Resume Intelligence Platform with chat-first interface, advanced search, and resume viewing capabilities.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
# From project root (runs both backend + frontend)
npm run dev

# Frontend only (port 5173)
npm run dev:frontend

# Backend only (port 3000)
npm run dev:backend
```

### Build
```bash
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run typecheck    # TypeScript type checking
```

## Features

- 💬 **Chat Interface** - Conversational search with AI assistant
- 🔍 **Multi-Mode Search** - Vector, Keyword, and Hybrid search modes
- 📊 **Results Cards** - Interactive cards with relevance scoring
- 📄 **Document Modal** - Full resume viewing with download/print
- 🎨 **Dark Theme** - Modern UI with smooth animations
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Real-time Updates** - React Query for data caching
- 🗂️ **Conversation History** - Track and manage searches

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router v6** - Routing
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

## Project Structure

```
src/
├── app/
│   └── App.tsx                 # Root component with routing
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        # Main layout wrapper
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── TopNavbar.tsx       # Header navbar
│   │   └── MobileDrawer.tsx    # Mobile menu
│   ├── chat/
│   │   ├── ChatContainer.tsx   # Message list
│   │   ├── ChatMessage.tsx     # Message component
│   │   ├── ChatInput.tsx       # Message input
│   │   └── SuggestionChips.tsx # Suggestion buttons
│   ├── knowledge/
│   │   ├── ResultScoreBadge.tsx # Score display
│   │   ├── KnowledgeCard.tsx   # Result card
│   │   ├── KnowledgeResultsList.tsx # Results container
│   │   └── index.ts
│   ├── modals/
│   │   ├── DocumentModal.tsx   # Resume viewer
│   │   └── index.ts
│   └── ui/
│       ├── LoadingSpinner.tsx
│       ├── ErrorState.tsx
│       └── EmptyState.tsx
├── config/
│   └── api.config.ts           # Axios configuration
├── hooks/
│   ├── useConversation.ts      # Chat hook with React Query
│   └── useSearch.ts            # Search hook
├── lib/
│   └── api/
│       ├── search.api.ts       # Search endpoints
│       ├── chat.api.ts         # Chat endpoints
│       └── conversation.api.ts # Conversation endpoints
├── pages/
│   └── KnowledgeChatPage.tsx   # Main page
├── stores/
│   ├── chat.store.ts           # Chat state
│   ├── search.store.ts         # Search state
│   └── ui.store.ts             # UI state
├── types/
│   ├── api.ts
│   ├── chat.ts
│   ├── search.ts
│   └── index.ts
├── main.tsx                    # React DOM render
└── index.css                   # Global styles
```

## API Integration

### Endpoints
- `POST /chat` - Send message and get results
- `POST /search/resumes` - Search candidates
- `GET /chat/history/{conversationId}` - Get conversation history
- `DELETE /chat/{conversationId}` - Delete conversation
- `GET /health` - Backend health check

### Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Components

### Chat Components
- **ChatContainer** - Message list with auto-scroll
- **ChatMessage** - Message with markdown rendering and syntax highlighting
- **ChatInput** - Message input form
- **SuggestionChips** - Animated suggestion buttons

### Knowledge Components
- **KnowledgeCard** - Individual result card with candidate info
- **KnowledgeResultsList** - Results container with staggered animations
- **ResultScoreBadge** - Color-coded relevance score

### Layout Components
- **AppShell** - Main layout wrapper with sidebar and content
- **Sidebar** - Navigation, role selector, filters, conversation history
- **TopNavbar** - Header with mobile menu toggle
- **MobileDrawer** - Mobile sidebar overlay

### Modal Components
- **DocumentModal** - Full resume viewer with download/print/scroll

## State Management

### Zustand Stores
```typescript
// chatStore - Chat messages and conversation
useChatStore() → { messages, conversationId, isLoading, error }

// searchStore - Search results and filters
useSearchStore() → { searchMode, results, filters, isLoading }

// uiStore - UI state
useUIStore() → { sidebarOpen, documentModalOpen, selectedCandidate }
```

### Custom Hooks
```typescript
// useConversation - Chat with React Query
useConversation() → { sendMessage, isLoading, history, deleteConversation }

// useSearch - Search with filter application
useSearch() → { search, isLoading, error }
```

## Design System

### Colors
- **Primary:** `#2563EB` (Blue)
- **Secondary:** `#14B8A6` (Teal)
- **Accent:** `#F59E0B` (Amber)
- **Background:** `#0B1220` (Deep blue-black)
- **Surface:** `#111827` (Dark gray)
- **Text Primary:** `#E5E7EB` (Light)
- **Text Secondary:** `#9CA3AF` (Medium gray)

### Responsive Breakpoints
- **Mobile:** Default (small screen)
- **Desktop:** `lg:` breakpoint (1024px+)

## Development

### Adding Components
1. Create in appropriate `components/` folder
2. Define TypeScript interfaces for props
3. Use TailwindCSS for styling
4. Export from parent index file

### Working with State
- UI state → Zustand stores
- Async data → React Query hooks
- Combine both in custom hooks

### Running Tests
```bash
npm run typecheck    # TypeScript type checking
```

## Responsive Design

- **Mobile-first** approach
- **Sidebar** hidden on mobile (drawer overlay)
- **Modal** full-screen on mobile, side-panel on desktop
- **Grid** single column on mobile, responsive on desktop
- **Navbar** compact on mobile with hamburger menu

## Performance

- Code splitting with React Router
- React Query caching and background sync
- Zustand selector memoization
- Framer Motion GPU acceleration
- TailwindCSS tree-shaking

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Documentation

- [Phase 1: Project Setup](./PHASE1_SUMMARY.md)
- [Phase 2: Sidebar Module](./PHASE2_COMPLETE.md)
- [Phase 3: Chat Interface](./PHASE3_COMPLETE.md)
- [Phase 4: Knowledge Cards](./PHASE4_COMPLETE.md)
- [Phase 5: Document Modal](./PHASE5_COMPLETE.md)
- [Project Complete](./PROJECT_COMPLETE.md)

## Troubleshooting

### API Connection Failed
1. Verify backend running on port 3000
2. Check `.env` VITE_API_BASE_URL
3. Check browser network tab

### Port Already in Use
1. Kill existing process: `lsof -i :5173`
2. Or change port in `vite.config.ts`

### Type Errors
1. Run `npm run typecheck`
2. Verify imports and paths
3. Check dependency versions

## License

Proprietary - All rights reserved

---

**Status:** ✅ Production Ready
**Framework:** React 18 + TypeScript + Vite
**Last Updated:** March 13, 2026
    └── search.types.ts    # Search types
```

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Resume Intelligence Platform
```

### 3. Run Frontend Only

```bash
npm run dev       # Start dev server on http://localhost:5173
```

## Running Backend + Frontend Together

From the **root** project directory:

```bash
npm run dev       # Starts both backend (3000) and frontend (5173)
```

This uses `concurrently` to run both services simultaneously:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Build

```bash
npm run build     # Create production build
npm run preview   # Preview production build
```

## Type Checking

```bash
npm run typecheck # Check TypeScript types without building
```

## Architecture

### State Management (Zustand)

Three main stores:

1. **ChatStore** - Manages conversation messages and state
2. **SearchStore** - Manages search results and filters
3. **UIStore** - Manages UI state (sidebar, modals, etc.)

### API Integration

All API calls go through centralized Axios client with error handling:

- `src/lib/api/search.api.ts` - Resume search
- `src/lib/api/chat.api.ts` - Chat interactions
- `src/lib/api/conversation.api.ts` - Conversation management

### Design System

Dark theme with brand colors:
- Primary: #2563EB (Blue)
- Secondary: #14B8A6 (Teal)
- Accent: #F59E0B (Amber)
- Background: #0B1220
- Surface: #111827

## Development Phases

- ✅ Phase 1: Project setup, base layout
- ⏳ Phase 2: Sidebar module
- ⏳ Phase 3: Chat interface
- ⏳ Phase 4: Knowledge result cards
- ⏳ Phase 5: Document modal
- ⏳ Phase 6: Layout integration
- ⏳ Phase 7: Mobile optimization

## API Endpoints

- `POST /search/resumes` - Search candidates
- `POST /chat` - Send chat message
- `POST /chat/history` - Get conversation history
- `DELETE /chat/:conversationId` - Delete conversation
- `GET /health` - Health check

## Key Features

- ✅ Multi-search mode (keyword, vector, hybrid)
- ✅ Conversational AI chat
- ✅ Dark theme SaaS UI
- ✅ Responsive design
- ✅ Type-safe state management
- ⏳ Result filtering
- ⏳ Document viewing
- ⏳ Conversation history
