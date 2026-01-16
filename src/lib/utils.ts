import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  })
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(d)
}

// Format rating to one decimal place
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

// Get sentiment color
export function getSentimentColor(sentiment: 'positive' | 'neutral' | 'negative' | null): string {
  switch (sentiment) {
    case 'positive':
      return 'text-success-500'
    case 'negative':
      return 'text-error-500'
    case 'neutral':
    default:
      return 'text-neutral-500'
  }
}

// Get rating color
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-success-500'
  if (rating >= 4.0) return 'text-success-700'
  if (rating >= 3.5) return 'text-warning-500'
  if (rating >= 3.0) return 'text-warning-700'
  return 'text-error-500'
}

// Get platform display name
export function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
    google: 'Google',
    tripadvisor: 'TripAdvisor',
    booking: 'Booking.com',
    agoda: 'Agoda',
    other: 'Other',
  }
  return names[platform] || platform
}

// Get platform color
export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    google: 'bg-blue-500',
    tripadvisor: 'bg-green-500',
    booking: 'bg-blue-600',
    agoda: 'bg-red-500',
    other: 'bg-neutral-500',
  }
  return colors[platform] || 'bg-neutral-500'
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
