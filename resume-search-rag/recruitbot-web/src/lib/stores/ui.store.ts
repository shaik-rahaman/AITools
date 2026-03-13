import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIStoreState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modals
  candidateModalOpen: boolean;
  setCandidateModalOpen: (open: boolean) => void;

  // Toasts
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning';
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  clearToast: () => void;

  // Theme
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const useUIStore = create<UIStoreState>()(
  devtools(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Modals
      candidateModalOpen: false,
      setCandidateModalOpen: (open) => set({ candidateModalOpen: open }),

      // Toasts
      toastMessage: null,
      toastType: 'info',
      showToast: (message, type) => set({ toastMessage: message, toastType: type }),
      clearToast: () => set({ toastMessage: null }),

      // Theme (always dark)
      isDark: true,
      setIsDark: (dark) => set({ isDark: dark }),
    }),
    { name: 'UIStore' }
  )
);
