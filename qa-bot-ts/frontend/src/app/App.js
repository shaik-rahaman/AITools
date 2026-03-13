import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ErrorBoundary';
import AppShell from '../components/layout/AppShell';
import KnowledgeChatPage from '../pages/KnowledgeChatPage';
const queryClient = new QueryClient();
function App() {
    console.log('App component rendering');
    return (_jsx(ErrorBoundary, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(AppShell, {}), children: [_jsx(Route, { path: "/", element: _jsx(KnowledgeChatPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map