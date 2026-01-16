import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-6 py-4 rounded-2xl border-none bg-surface-50 text-dark placeholder:text-muted shadow-inner',
            'focus:outline-none focus:ring-2 focus:bg-white transition-all duration-300',
            'resize-none',
            error
              ? 'ring-2 ring-accent-300 bg-accent-50'
              : 'focus:ring-primary-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-coral-600">{error}</p>}
        {hint && !error && <p className="text-sm text-surface-500">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
