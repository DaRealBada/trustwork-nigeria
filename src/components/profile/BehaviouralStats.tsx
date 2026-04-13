import { MessageSquare, RefreshCw, TrendingUp, Clock, Calendar } from 'lucide-react'

export type BehaviouralData = {
  responseRate: number       // 0–100
  avgResponseHours: number   // average hours to respond
  cancellationRate: number   // 0–100 (lower = better)
  repeatHireRate: number     // 0–100 % of employers who hired again
  memberSinceYear: number
  totalJobsCompleted: number
}

interface Props {
  data: BehaviouralData
  accent: string
  light: string
  compact?: boolean          // compact mode for public profile sidebar
}

function RateBar({ value, invert = false, accent }: { value: number; invert?: boolean; accent: string }) {
  const display = invert ? 100 - value : value
  const color = display >= 80 ? accent : display >= 50 ? '#d97706' : '#dc2626'
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${display}%`, backgroundColor: color }} />
    </div>
  )
}

const RESPONSE_LABEL = (h: number) =>
  h < 1 ? 'Usually within an hour' : h < 4 ? 'Usually within 4 hours' : h < 24 ? 'Usually same day' : 'Within a few days'

export function BehaviouralStats({ data, accent, light, compact = false }: Props) {
  const stats = [
    {
      icon: MessageSquare,
      label: 'Response rate',
      value: `${data.responseRate}%`,
      sub: RESPONSE_LABEL(data.avgResponseHours),
      bar: data.responseRate,
      invert: false,
      good: data.responseRate >= 85,
    },
    {
      icon: RefreshCw,
      label: 'Repeat hire rate',
      value: `${data.repeatHireRate}%`,
      sub: `of employers hired again`,
      bar: data.repeatHireRate,
      invert: false,
      good: data.repeatHireRate >= 50,
    },
    {
      icon: TrendingUp,
      label: 'Job completion rate',
      value: `${100 - data.cancellationRate}%`,
      sub: data.cancellationRate === 0 ? 'Zero cancellations' : `${data.cancellationRate}% cancellation rate`,
      bar: 100 - data.cancellationRate,
      invert: false,
      good: data.cancellationRate <= 10,
    },
    {
      icon: Clock,
      label: 'Avg. response time',
      value: data.avgResponseHours < 1 ? '<1 hr' : `${data.avgResponseHours} hrs`,
      sub: RESPONSE_LABEL(data.avgResponseHours),
      bar: Math.max(0, 100 - data.avgResponseHours * 10),
      invert: false,
      good: data.avgResponseHours <= 4,
    },
  ]

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {stats.slice(0, 4).map(({ icon: Icon, label, value, good }) => (
          <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: light }}>
            <Icon size={13} className="mx-auto mb-1" style={{ color: accent }} />
            <p className="text-base font-black" style={{ color: good ? accent : '#d97706' }}>{value}</p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Membership badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: light }}>
        <Calendar size={14} style={{ color: accent }} />
        <span className="text-xs text-gray-700">
          <strong>Member since {data.memberSinceYear}</strong> · {data.totalJobsCompleted} jobs completed on TrustWork
        </span>
      </div>

      {stats.map(({ icon: Icon, label, value, sub, bar, good }) => (
        <div key={label}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Icon size={13} style={{ color: accent }} />
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </div>
            <span className="text-xs font-black" style={{ color: good ? accent : '#d97706' }}>{value}</span>
          </div>
          <RateBar value={bar} accent={accent} />
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  )
}
