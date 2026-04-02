import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { TrustBadge } from './TrustBadge'
import { formatRateRange } from '@/lib/utils/formatters'
import { MapPin, CheckCircle } from 'lucide-react'

export interface WorkerCardData {
  id: string
  name: string
  avatarUrl?: string | null
  headline: string
  city: string
  area?: string
  avgRating: number
  reviewCount: number
  rateMin?: number | null
  rateMax?: number | null
  rateType: string
  skills: string[]
  trustLevel: 1 | 2 | 3
  trustViaName?: string | null
  verified?: boolean
}

interface WorkerCardProps {
  worker: WorkerCardData
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Link href={`/worker/${worker.id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-green-200 hover:shadow-sm transition-all">
        <div className="flex items-start gap-3">
          <Avatar src={worker.avatarUrl} name={worker.name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-sm">{worker.name}</span>
                  {worker.verified && (
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{worker.headline}</p>
              </div>
              {worker.trustLevel < 3 && (
                <TrustBadge level={worker.trustLevel} viaName={worker.trustViaName} className="flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              <StarRating rating={worker.avgRating} size="sm" />
              <span className="text-xs text-gray-500">
                {worker.avgRating.toFixed(1)} ({worker.reviewCount})
              </span>
            </div>

            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">
                {worker.area ? `${worker.area}, ` : ''}{worker.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex flex-wrap gap-1">
            {worker.skills.slice(0, 2).map(skill => (
              <Badge key={skill} variant="default">{skill}</Badge>
            ))}
            {worker.skills.length > 2 && (
              <Badge variant="gray">+{worker.skills.length - 2}</Badge>
            )}
          </div>
          <span className="text-xs font-medium text-gray-700 flex-shrink-0">
            {formatRateRange(worker.rateMin ?? null, worker.rateMax ?? null, worker.rateType)}
          </span>
        </div>
      </div>
    </Link>
  )
}
