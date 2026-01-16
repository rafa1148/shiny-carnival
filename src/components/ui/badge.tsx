import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-surface-200 text-muted',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-orange-50 text-orange-700',
    error: 'bg-accent-50 text-accent-700',
    info: 'bg-primary-50 text-primary-700',
    brand: 'bg-primary-50 text-primary-700',
  }

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold tracking-wide rounded-pill uppercase text-[10px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
