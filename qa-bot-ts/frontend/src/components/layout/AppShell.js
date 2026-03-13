import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { DocumentModal } from '../modals';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import MobileDrawer from './MobileDrawer';
import { useUIStore } from '../../stores/ui.store';
export default function AppShell() {
    // NOTE: UI state is handled via global stores (zustand)
    const { documentModalOpen, selectedCandidate, closeDocumentModal } = useUIStore();
    return (_jsxs("div", { className: "flex h-screen bg-[#0B1220]", children: [_jsx("div", { className: "fixed top-0 left-0 right-0 z-50 bg-green-600 text-white p-2 text-center text-sm", children: "\u2713 React & CSS working - AppShell loaded" }), _jsx("div", { className: "hidden lg:block w-64 bg-[#111827] border-r border-[#374151]", children: _jsx(Sidebar, {}) }), _jsx(MobileDrawer, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(TopNavbar, {}), _jsx("main", { className: "flex-1 overflow-auto", children: _jsx(Outlet, {}) })] }), _jsx(DocumentModal, { isOpen: documentModalOpen, candidate: selectedCandidate, onClose: closeDocumentModal })] }));
}
//# sourceMappingURL=AppShell.js.map