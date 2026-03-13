import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error) {
        console.error('ErrorBoundary caught:', error);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "w-full h-screen bg-[#0B1220] flex items-center justify-center p-6", children: _jsxs("div", { className: "max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold text-red-500 mb-4", children: "Application Error" }), _jsx("p", { className: "text-[#9CA3AF] mb-4", children: "An error occurred while rendering the application." }), _jsxs("details", { className: "bg-[#1F2937] p-4 rounded-lg text-sm text-[#E5E7EB] whitespace-pre-wrap overflow-auto max-h-64", children: [_jsx("summary", { className: "cursor-pointer font-bold text-[#2563EB]", children: "Error Details" }), _jsx("pre", { className: "mt-2", children: this.state.error?.toString() })] }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-6 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors", children: "Reload Page" })] }) }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map