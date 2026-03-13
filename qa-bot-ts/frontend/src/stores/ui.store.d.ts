import { Candidate } from '../types/search.types';
interface UIStore {
    sidebarOpen: boolean;
    documentModalOpen: boolean;
    selectedCandidate: Candidate | null;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    openDocumentModal: (candidate: Candidate) => void;
    closeDocumentModal: () => void;
    setSelectedCandidate: (candidate: Candidate | null) => void;
}
export declare const useUIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UIStore>>;
export {};
//# sourceMappingURL=ui.store.d.ts.map