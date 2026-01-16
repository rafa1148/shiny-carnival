import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed opacity-100'

    const variants = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-transparent',
      secondary: 'bg-white text-surface-900 border border-surface-200 hover:bg-surface-50 hover:border-surface-300 focus:ring-primary-500 shadow-sm hover:shadow-md',
      ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:ring-surface-400',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
