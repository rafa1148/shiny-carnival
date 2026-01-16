import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function StarRating({ rating, maxRating = 5, size = 'md', showValue = false }: StarRatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizes[size],
              i < rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            )}
            style={i < rating ? { color: '#FBBF24' } : undefined}
          />
        ))}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-surface-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
