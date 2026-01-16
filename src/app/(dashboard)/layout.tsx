'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MessageSquareText,
  Mail,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reviews', href: '/dashboard/reviews', icon: MessageSquareText },
  { name: 'Guest Emails', href: '/dashboard/emails', icon: Mail },
  { name: 'My Hotel', href: '/dashboard/hotel', icon: Building2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-display font-bold text-lg text-neutral-900">HoteliaOS</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Hotel Selector */}
          <div className="p-4 border-b border-neutral-200">
            <button className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900">Demo Hotel</p>
                  <p className="text-xs text-neutral-500">Kuala Lumpur</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-neutral-400')} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">RV</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">Raj Vadivelu</p>
                <p className="text-xs text-neutral-500 truncate">raj@example.com</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-neutral-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
