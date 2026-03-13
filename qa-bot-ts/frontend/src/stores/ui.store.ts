import { create } from 'zustand'
import { Candidate } from '../types/search.types'

interface UIStore {
  sidebarOpen: boolean
  documentModalOpen: boolean
  selectedCandidate: Candidate | null

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openDocumentModal: (candidate: Candidate) => void
  closeDocumentModal: () => void
  setSelectedCandidate: (candidate: Candidate | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  documentModalOpen: false,
  selectedCandidate: null,

  toggleSidebar: () =>
    set((state: any) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  openDocumentModal: (candidate: Candidate) =>
    set({ documentModalOpen: true, selectedCandidate: candidate }),

  closeDocumentModal: () =>
    set({ documentModalOpen: false, selectedCandidate: null }),

  setSelectedCandidate: (candidate: Candidate | null) =>
    set({ selectedCandidate: candidate }),
}))
