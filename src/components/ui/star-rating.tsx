'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating)
        const partial = index === Math.floor(rating) && rating % 1 !== 0
        const partialWidth = partial ? `${(rating % 1) * 100}%` : '0%'

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
          >
            {/* Background (empty) star */}
            <Star
              className={cn(
                sizes[size],
                'text-neutral-300 fill-neutral-300'
              )}
            />
            
            {/* Filled star (overlay) */}
            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : partialWidth }}
              >
                <Star
                  className={cn(
                    sizes[size],
                    'text-accent-400 fill-accent-400'
                  )}
                />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Compact rating display with number
export function RatingBadge({ 
  rating, 
  reviewCount,
  size = 'md',
  className 
}: { 
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string 
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Star className={cn('h-4 w-4 text-accent-400 fill-accent-400', size === 'sm' && 'h-3.5 w-3.5')} />
      <span className={cn('font-semibold text-neutral-900', sizes[size])}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={cn('text-neutral-500', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
