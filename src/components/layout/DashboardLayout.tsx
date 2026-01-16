'use client'

import { Sidebar } from './Sidebar'
import { AuthProvider } from '@/lib/auth-context'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-canvas p-4 flex gap-8">
        <Sidebar />
        <main className="flex-1 ml-[calc(16rem+2rem)] pr-4">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
