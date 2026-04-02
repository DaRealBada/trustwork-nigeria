import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

const sizes = { sm: 12, md: 16, lg: 20 }

export function StarRating({ rating, max = 5, size = 'md', showValue = false }: StarRatingProps) {
  const px = sizes[size]
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <Star
            key={i}
            size={px}
            className={filled || partial ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
