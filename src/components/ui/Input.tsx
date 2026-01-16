import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-3.5 rounded-pill border-none bg-surface-50 text-dark placeholder:text-muted shadow-inner',
              icon ? 'pl-11 pr-6' : 'px-6',
              'focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300',
              error
                ? 'ring-2 ring-accent-300 bg-accent-50'
                : 'focus:ring-primary-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-coral-600">{error}</p>}
        {hint && !error && <p className="text-sm text-surface-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
