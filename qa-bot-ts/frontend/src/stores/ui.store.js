import { create } from 'zustand';
export const useUIStore = create((set) => ({
    sidebarOpen: true,
    documentModalOpen: false,
    selectedCandidate: null,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    openDocumentModal: (candidate) => set({ documentModalOpen: true, selectedCandidate: candidate }),
    closeDocumentModal: () => set({ documentModalOpen: false, selectedCandidate: null }),
    setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),
}));
//# sourceMappingURL=ui.store.js.map