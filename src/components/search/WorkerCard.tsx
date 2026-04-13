import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { StarRating } from '@/components/ui/StarRating'
import { TrustBadge } from './TrustBadge'
import { formatRateRange } from '@/lib/utils/formatters'
import { getCategoryByName } from '@/lib/utils/constants'
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
  const primarySkill = worker.skills[0] ?? ''
  const category = getCategoryByName(primarySkill)
  const accentColor = category?.color.accent ?? '#16a34a'
  const lightColor = category?.color.light ?? '#f0fdf4'

  return (
    <Link href={`/worker/${worker.id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all overflow-hidden"
        style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}>
        <div className="flex items-start gap-3">
          <Avatar src={worker.avatarUrl} name={worker.name} size="lg" accentColor={accentColor} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
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
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: lightColor, color: accentColor }}
              >
                {category?.icon} {skill}
              </span>
            ))}
            {worker.skills.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                +{worker.skills.length - 2}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: accentColor }}>
            {formatRateRange(worker.rateMin ?? null, worker.rateMax ?? null, worker.rateType)}
          </span>
        </div>
      </div>
    </Link>
  )
}
