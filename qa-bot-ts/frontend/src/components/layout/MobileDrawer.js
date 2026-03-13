import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useUIStore } from '../../stores/ui.store';
import Sidebar from './Sidebar';
export default function MobileDrawer() {
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    if (!sidebarOpen)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "lg:hidden fixed inset-0 bg-black/50 z-40", onClick: () => setSidebarOpen(false) }), _jsx("div", { className: "lg:hidden fixed left-0 top-0 h-full w-64 bg-[#111827] border-r border-[#374151] z-50 overflow-auto", children: _jsx(Sidebar, {}) })] }));
}
//# sourceMappingURL=MobileDrawer.js.map