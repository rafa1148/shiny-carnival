import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-6 py-3.5 pr-12 rounded-pill border-none bg-surface-50 text-dark appearance-none cursor-pointer shadow-inner',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:bg-white',
              error
                ? 'ring-2 ring-accent-300 bg-accent-50'
                : 'focus:ring-primary-500/20',
              'disabled:bg-surface-100 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-coral-600">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-surface-500">{hint}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
