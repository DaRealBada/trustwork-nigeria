'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Star } from 'lucide-react'

export default function ReviewPage({ params }: { params: { workerId: string } }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isVerifiedHire, setIsVerifiedHire] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push(`/worker/${params.workerId}`)
    }, 1000)
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Write a Review</h1>
        <p className="text-sm text-gray-500 mt-1">Your honest review helps others in your network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star rating */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-sm font-medium text-gray-700 mb-3">Overall rating</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={36}
                  className={i <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Great chef, very punctual"
            maxLength={100}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Tell others about your experience..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            required
          />
        </div>

        <label className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 cursor-pointer">
          <input
            type="checkbox"
            checked={isVerifiedHire}
            onChange={e => setIsVerifiedHire(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">I actually hired this worker</p>
            <p className="text-xs text-gray-500">Verified hire reviews carry more trust</p>
          </div>
        </label>

        <Button type="submit" className="w-full" size="lg" loading={loading} disabled={rating === 0}>
          Submit Review
        </Button>
      </form>
    </div>
  )
}
