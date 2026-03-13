# RecruitBot Frontend — Copilot Side Chat Instructions

> Use this document to guide Copilot code generation, editing, debugging, and refactoring for the **RecruitBot Web Frontend** React + TypeScript project.

## Project Context

- **App Name**: RecruitBot
- **Purpose**: Modern chat-style recruiter UI for resume search
- **Backend**: Express.js running on `http://localhost:3000`
- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, Shadcn/ui
- **Frontend Port**: `http://localhost:5173`
- **Design**: Dark-themed, single-page chat interface

## Directory Structure

```
resume-search-rag/
├── recruitbot-web/                    # Frontend React app (this project)
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── config/
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   ├── stores/
│   │   │   └── utils/
│   │   ├── hooks/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   ├── common/
│   │   │   └── features/
│   │   ├── pages/
│   │   ├── types/
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env
│
└── resume-search-rag-backend/         # Backend (already exists)
    ├── src/
    ├── package.json
    └── .env
```

## Code Generation Guidelines

### 1. Component Creation

When asked to create a React component:

**Template**:
```typescript
import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  // Define all props with types
  children?: ReactNode;
  className?: string;
}

export const MyComponent: FC<MyComponentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('base-class', className)}>
      {children}
    </div>
  );
};

export default MyComponent;
```

**Checklist**:
- ✅ Use named exports + default export
- ✅ Props interface explicitly typed
- ✅ Use `cn()` utility for conditional classes
- ✅ Shadcn/ui components imported from `@/components/ui/*`
- ✅ Icons from `lucide-react`
- ✅ No inline styles; use TailwindCSS classes only
- ✅ Add `aria-label` to icon-only buttons

### 2. Custom Hooks

Template:
```typescript
import { useState, useCallback } from 'react';
import { useSearchStore } from '@/lib/stores/search.store';

export function useMyHook() {
  const { searchType } = useSearchStore();
  const [value, setValue] = useState('');

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { value, handleChange };
}
```

**Checklist**:
- ✅ File named `use-*.ts` in `src/hooks/`
- ✅ All hook dependencies declared
- ✅ Use `useCallback` for event handlers passed as props
- ✅ Return object with consistent naming

### 3. Zustand Store

Template:
```typescript
import { create } from 'zustand';

interface MyStoreState {
  value: string;
  setValue: (v: string) => void;
  reset: () => void;
}

export const useMyStore = create<MyStoreState>((set) => ({
  value: '',
  setValue: (v) => set({ value: v }),
  reset: () => set({ value: '' }),
}));
```

**Checklist**:
- ✅ Store file in `src/lib/stores/`
- ✅ Interface name: `XxxState`
- ✅ Hook name: `useXxxStore`
- ✅ All state + actions defined in interface
- ✅ Exported as named export

### 4. API Service

Template:
```typescript
import { apiClient } from './client';
import { SearchRequest, SearchResponse } from '@/types/search.types';

export const searchApi = {
  async searchResumes(params: SearchRequest): Promise<SearchResponse> {
    const response = await apiClient.post('/search/resumes', params);
    return response.data;
  },
};
```

**Checklist**:
- ✅ File in `src/lib/api/`
- ✅ Async/await, not `.then()`
- ✅ Return typed responses
- ✅ Use `apiClient` (axios instance)
- ✅ Document query/path params in comments

### 5. Type Definitions

Template:
```typescript
export type SearchMode = 'vector' | 'bm25' | 'hybrid';

export interface SearchRequest {
  query: string;
  topK: number;
  searchType: SearchMode;
}

export interface SearchResult {
  candidateId: string;
  name: string;
  score: number;
}
```

**Checklist**:
- ✅ File in `src/types/`
- ✅ Types match backend API contracts
- ✅ Use `interface` for objects, `type` for unions/literals
- ✅ All fields documented

## Common Tasks

### Task: Add a new Shadcn/ui component

```bash
npx shadcn-ui@latest add <component-name>
# e.g., npx shadcn-ui@latest add slider
```

Then import and use:
```typescript
import { Slider } from '@/components/ui/slider';

<Slider value={value} onValueChange={setValue} max={100} />
```

### Task: Update TailwindCSS color token

Edit `tailwind.config.js` → `theme.extend.colors`:
```javascript
colors: {
  primary: '#6366f1',
  accent: '#ec4899',
  // ...
}
```

Then use class:
```jsx
<button className="bg-primary text-white">...</button>
```

### Task: Style a component with Framer Motion

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### Task: Add form validation

Use React Hook Form + Zod:
```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  query: z.string().min(1, 'Query required'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle submit
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('query')} />
    </form>
  );
}
```

### Task: Show a toast notification

```typescript
import toast from 'react-hot-toast';

// Error
toast.error('Failed to search');

// Success
toast.success('Search complete!');

// Custom
toast('Loading...', { icon: '⏳' });
```

### Task: Debug API response

Add logging to `src/lib/api/client.ts`:
```typescript
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.data);
    return Promise.reject(error);
  }
);
```

## Testing Guidelines

### Unit Test Pattern

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMyHook } from '@/hooks/use-my-hook';

describe('useMyHook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('');
  });
});
```

### Component Test Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '@/components/features/my-component';

describe('MyComponent', () => {
  it('should render with text', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Performance Best Practices

1. **Memoization**:
   ```typescript
   import { memo } from 'react';
   export const MyComponent = memo(function MyComponent(props) { ... });
   ```

2. **useCallback** for stable references:
   ```typescript
   const handleClick = useCallback(() => { ... }, [dep1, dep2]);
   ```

3. **Lazy-load modals**:
   ```typescript
   const CandidateModal = lazy(() => import('@/components/candidate-modal'));
   
   <Suspense fallback={<div>Loading...</div>}>
     <CandidateModal />
   </Suspense>
   ```

4. **React Query for server state** (if needed later):
   ```typescript
   import { useQuery } from '@tanstack/react-query';
   
   const { data, isLoading } = useQuery({
     queryKey: ['candidate', id],
     queryFn: () => candidateApi.getCandidate(id),
   });
   ```

## Accessibility (a11y) Checklist

- ✅ All interactive elements have `aria-label` or visible label
- ✅ Buttons use `<button>`, not `<div onClick>`
- ✅ Links use `<a href>` or `<Link to>`
- ✅ Form inputs have associated `<label>`
- ✅ Focus trap in modal (use Radix Dialog)
- ✅ `aria-live` regions for dynamic content
- ✅ Colour not sole indicator (e.g., use icon + colour for status)
- ✅ Keyboard navigation works (Tab, Enter, Escape)
- ✅ Images have `alt` text (if needed)

## Styling Conventions

### Class Naming

```typescript
// Container layout
className="flex flex-col gap-4 p-5"

// Card styling
className="bg-card border border-border rounded-lg p-4"

// Text styling
className="text-sm font-medium text-text-muted"

// Responsive
className="w-full md:max-w-2xl"

// Hover/active states
className="hover:bg-card/80 active:scale-95 transition-all"

// Dark mode (already dark, but for future reference)
className="dark:bg-gray-900"
```

### TailwindCSS Custom Config

Tokens are defined in `tailwind.config.js`. Use semantic names:
- `bg-primary`, `bg-accent`, `bg-card`, `bg-surface`, `bg-base`
- `text-primary`, `text-muted`
- `border-border`
- `score-vector`, `score-bm25`, `score-hybrid`

## Environment Variables

Frontend `.env` inherits from backend via shared `.env` file or separate:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=RecruitBot
VITE_ENABLE_MOCK=false
```

Access in code:
```typescript
const apiBase = import.meta.env.VITE_API_BASE_URL;
```

## Debugging Tips

1. **Zustand DevTools**:
   ```typescript
   import { devtools } from 'zustand/middleware';
   
   export const useMyStore = create<MyStoreState>(
     devtools((set) => ({ ... }), { name: 'MyStore' })
   );
   ```

2. **React DevTools**:
   - Install React DevTools browser extension
   - Inspect component tree, props, hooks

3. **Network Tab**:
   - Check API requests/responses in browser DevTools
   - Verify correct endpoint + payload

4. **Console Logs**:
   - Add `console.log()` before suspect code
   - Use `debugger;` statement to pause execution

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '@/...'` | Path alias not set up | Check `vite.config.ts` and `tsconfig.json` |
| `Property 'X' does not exist` | Missing type definition | Add field to interface in `src/types/` |
| `Hydration mismatch` | SSR issue (shouldn't happen) | Not applicable for SPA |
| `useStore is not a function` | Forgot `()` when calling hook | Change `useStore` to `useStore()` |
| `Cannot read property of undefined` | Store not initialized | Check Zustand store creation |

## Phase Completion Checklist

After completing each phase, verify:

- ✅ All files created match directory structure
- ✅ No TypeScript errors (`npm run type-check`)
- ✅ No linting errors (`npm run lint`)
- ✅ Dev server runs without errors (`npm run dev`)
- ✅ UI renders visually as specified
- ✅ All interactions work as expected
- ✅ Mobile (375 px) and desktop (1440 px) layouts functional
- ✅ Dark theme applied consistently

## Getting Help

When stuck or generating new code:

1. **Clarify the task**: "Create [component name] that [does X, receives Y props]"
2. **Reference the architecture**: "Use the pattern from Phase X"
3. **Provide context**: "This component should integrate with [store/api/hook]"
4. **Ask for specifics**: "Should this use Framer Motion or plain CSS transitions?"

---

*Last Updated: March 1, 2026*
