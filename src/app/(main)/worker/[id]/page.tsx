import { Avatar } from '@/components/ui/Avatar'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { TrustBadge } from '@/components/search/TrustBadge'
import { Button } from '@/components/ui/Button'
import { formatRateRange, timeAgo } from '@/lib/utils/formatters'
import { MapPin, CheckCircle, Bookmark, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const MOCK_WORKER = {
  id: '1',
  name: 'Emeka Okonkwo',
  avatarUrl: null,
  headline: 'Professional Chef | 12 years experience | Lagos',
  bio: 'I have been cooking professionally for over 12 years, specialising in Nigerian, continental, and Asian cuisines. Previously head chef at a Lekki household for 10 years. I take pride in punctuality, hygiene, and making food that people remember.',
  city: 'Lagos', area: 'Lekki',
  avgRating: 4.9, reviewCount: 34,
  rateMin: 15000, rateMax: 30000, rateType: 'daily',
  skills: ['Chef / Cook'],
  yearsExperience: 12,
  isAvailable: true,
  verified: true,
  trustLevel: 1 as const,
}

const MOCK_REVIEWS = [
  {
    id: 'r1',
    authorName: 'Amaka Okonkwo',
    authorAvatar: null,
    rating: 5,
    title: 'Exceptional cook, 10 years with us',
    body: 'Emeka worked with our family for 10 years before moving on. Honest, punctual and an incredible cook. Highly recommend without any reservations.',
    isVerifiedHire: true,
    createdAt: '2024-03-15',
    trustLevel: 1 as const,
    trustViaName: null,
  },
  {
    id: 'r2',
    authorName: 'Tunde Balogun',
    authorAvatar: null,
    rating: 5,
    title: 'Best food at our event',
    body: 'Hired Emeka for a 200-person event. Everything was perfect — quantity, quality, timing. Everyone asked for his contact.',
    isVerifiedHire: true,
    createdAt: '2024-01-20',
    trustLevel: 2 as const,
    trustViaName: 'Chioma',
  },
  {
    id: 'r3',
    authorName: 'Biodun Adeyemi',
    authorAvatar: null,
    rating: 4,
    title: 'Very good chef',
    body: 'Great food quality and very easy to work with. Came fully prepared with his own tools.',
    isVerifiedHire: true,
    createdAt: '2023-11-05',
    trustLevel: 3 as const,
    trustViaName: null,
  },
]

export default function WorkerPage({ params }: { params: { id: string } }) {
  const worker = MOCK_WORKER
  void params

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="flex items-start gap-4">
          <Avatar src={worker.avatarUrl} name={worker.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{worker.name}</h1>
              {worker.verified && <CheckCircle size={18} className="text-green-500" />}
              <TrustBadge level={worker.trustLevel} />
            </div>
            <p className="text-sm text-gray-500 mt-1">{worker.headline}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <StarRating rating={worker.avgRating} size="sm" showValue />
              <span className="text-xs text-gray-400">({worker.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">{worker.area}, {worker.city}</span>
              {worker.isAvailable && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Available</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <span className="text-sm font-semibold text-gray-900">
            {formatRateRange(worker.rateMin, worker.rateMax, worker.rateType)}
          </span>
          <span className="text-xs text-gray-500 ml-2">{worker.yearsExperience} years experience</span>
        </div>

        <div className="flex gap-2 mt-4">
          <Link href={`/review/${worker.id}`} className="flex-1">
            <Button className="w-full" size="lg">Write a Review</Button>
          </Link>
          <Button variant="outline" size="lg" className="px-3">
            <Bookmark size={18} />
          </Button>
          <Button variant="outline" size="lg" className="px-3">
            <MessageCircle size={18} />
          </Button>
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 py-5 border-b border-gray-100 bg-white">
        <h2 className="font-semibold text-gray-900 mb-2">About</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
      </div>

      {/* Skills */}
      <div className="px-4 py-5 border-b border-gray-100 bg-white">
        <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map(s => <Badge key={s} variant="green">{s}</Badge>)}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 py-5 bg-white">
        <h2 className="font-semibold text-gray-900 mb-4">
          Reviews <span className="text-gray-400 font-normal text-sm">({worker.reviewCount})</span>
        </h2>
        <div className="space-y-4">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className={`p-4 rounded-xl border ${review.trustLevel === 1 ? 'border-green-200 bg-green-50' : review.trustLevel === 2 ? 'border-blue-100 bg-blue-50' : 'border-gray-100 bg-white'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Avatar src={review.authorAvatar} name={review.authorName} size="sm" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900">{review.authorName}</span>
                      {review.isVerifiedHire && (
                        <span className="text-xs text-green-600 font-medium">✓ Hired</span>
                      )}
                    </div>
                    {review.trustLevel < 3 && (
                      <TrustBadge level={review.trustLevel} viaName={review.trustLevel === 2 ? review.trustViaName : undefined} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                </div>
              </div>
              {review.title && <p className="text-sm font-medium text-gray-900 mb-1">{review.title}</p>}
              <p className="text-sm text-gray-600">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
