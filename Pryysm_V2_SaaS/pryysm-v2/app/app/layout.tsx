import Topbar from '@/components/layout/Topbar'
import Sidebar from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
