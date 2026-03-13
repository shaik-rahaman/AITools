import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ErrorBoundary } from '../components/ErrorBoundary'
import AppShell from '../components/layout/AppShell'
import KnowledgeChatPage from '../pages/KnowledgeChatPage'

const queryClient = new QueryClient()

function App() {
  console.log('App component rendering')
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<KnowledgeChatPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
