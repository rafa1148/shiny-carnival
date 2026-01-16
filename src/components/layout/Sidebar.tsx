'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  HelpCircle,
  Hotel,
  LogOut,
  Loader2,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
  { name: 'Guest Emails', href: '/dashboard/emails', icon: Mail },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

const secondaryNav = [
  { name: 'Hotel Settings', href: '/dashboard/settings', icon: Hotel },
  { name: 'Account', href: '/dashboard/account', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()

  // Get user display info
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || ''
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="fixed left-4 top-4 z-40 h-[calc(100vh-2rem)] w-64 bg-white/80 backdrop-blur-xl rounded-bento shadow-bento border-none">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-surface-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-surface-900">HoteliaOS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="border-t border-surface-100 px-3 py-4 space-y-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* User section */}
        <div className="border-t border-surface-100 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-surface-400" />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">{displayName}</p>
                <p className="text-xs text-surface-500 truncate">{displayEmail}</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-surface-400 hover:text-surface-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
