import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ className, src, name, size = 'md', ...props }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const initials = getInitials(name)

  if (src) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-neutral-200',
          sizes[size],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium',
        sizes[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  )
}
