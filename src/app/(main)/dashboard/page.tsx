import { Avatar } from '@/components/ui/Avatar'
import { StarRating } from '@/components/ui/StarRating'
import Link from 'next/link'
import { Bookmark, Star } from 'lucide-react'

const SAVED_WORKERS = [
  { id: '1', name: 'Emeka Okonkwo', headline: 'Professional Chef | Lagos', avgRating: 4.9, avatarUrl: null },
  { id: '4', name: 'Chukwudi Eze', headline: 'Certified Electrician | Lagos', avgRating: 4.5, avatarUrl: null },
]

const MY_REVIEWS = [
  { workerId: '1', workerName: 'Emeka Okonkwo', rating: 5, title: 'Exceptional cook', createdAt: '2024-03-15' },
]

export default function DashboardPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Bookmark size={16} className="text-gray-500" />
          <h2 className="font-semibold text-gray-900">Saved Workers</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{SAVED_WORKERS.length}</span>
        </div>
        <div className="space-y-3">
          {SAVED_WORKERS.map(w => (
            <Link key={w.id} href={`/worker/${w.id}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 hover:border-green-200 transition-colors">
                <Avatar src={w.avatarUrl} name={w.name} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{w.name}</p>
                  <p className="text-xs text-gray-500">{w.headline}</p>
                </div>
                <div className="flex items-center gap-1">
                  <StarRating rating={w.avgRating} size="sm" />
                  <span className="text-xs text-gray-500">{w.avgRating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-gray-500" />
          <h2 className="font-semibold text-gray-900">Reviews I&apos;ve Written</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{MY_REVIEWS.length}</span>
        </div>
        <div className="space-y-3">
          {MY_REVIEWS.map(r => (
            <Link key={r.workerId} href={`/worker/${r.workerId}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-3 hover:border-green-200 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{r.workerName}</span>
                  <StarRating rating={r.rating} size="sm" />
                </div>
                <p className="text-xs text-gray-500">{r.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
