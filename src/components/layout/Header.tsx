'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    onClick: () => void
  }
  customAction?: React.ReactNode
}

export function Header({ title, subtitle, action, customAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface-50/80 backdrop-blur-sm border-b border-surface-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <h1 className="text-xl font-semibold text-surface-900">{title}</h1>
          {subtitle && <p className="text-sm text-surface-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">


          {/* Action button */}
          {customAction}
          {action && (
            <Button onClick={action.onClick} size="sm">
              <Plus className="w-4 h-4" />
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
