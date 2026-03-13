import { Outlet } from 'react-router-dom'
import { DocumentModal } from '../modals'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'
import MobileDrawer from './MobileDrawer'
import { useUIStore } from '../../stores/ui.store'

export default function AppShell() {
  // NOTE: UI state is handled via global stores (zustand)
  const { documentModalOpen, selectedCandidate, closeDocumentModal } = useUIStore()

  return (
    <div className="flex h-screen bg-[#0B1220]">
      {/* Debug Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white p-2 text-center text-sm">
        ✓ React & CSS working - AppShell loaded
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-[#111827] border-r border-[#374151]">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Document Modal */}
      <DocumentModal
        isOpen={documentModalOpen}
        candidate={selectedCandidate}
        onClose={closeDocumentModal}
      />
    </div>
  )
}
