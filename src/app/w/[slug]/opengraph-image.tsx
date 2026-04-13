import { ImageResponse } from 'next/og'
import { getCategoryByName } from '@/lib/utils/constants'

export const runtime = 'edge'
export const alt = 'TrustWork worker profile'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const MOCK_WORKERS: Record<string, {
  name: string; headline: string; primarySkill: string
  rateMin: number; rateMax: number; rateType: string
  avgRating: number; reviewCount: number; city: string; area?: string
  verified: boolean; yearsExp: number; completedJobs: number
}> = {
  'emeka-okonkwo': {
    name: 'Emeka Okonkwo', headline: 'Professional Chef | 12 years experience | Lagos',
    primarySkill: 'Chef / Cook', rateMin: 15000, rateMax: 30000, rateType: 'daily',
    avgRating: 4.9, reviewCount: 34, city: 'Lagos', area: 'Lekki',
    verified: true, yearsExp: 12, completedJobs: 87,
  },
  'bola-adeyemi': {
    name: 'Bola Adeyemi', headline: 'Experienced Plumber | Lekki & VI',
    primarySkill: 'Plumber', rateMin: 10000, rateMax: 25000, rateType: 'daily',
    avgRating: 4.7, reviewCount: 21, city: 'Lagos', area: 'Victoria Island',
    verified: false, yearsExp: 8, completedJobs: 43,
  },
}

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function OGImage({ params }: { params: { slug: string } }) {
  const worker = MOCK_WORKERS[params.slug]

  if (!worker) {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 32, color: '#9ca3af' }}>Worker not found</span>
      </div>,
      { ...size }
    )
  }

  const category = getCategoryByName(worker.primarySkill)
  const accentColor = category?.color.accent ?? '#16a34a'
  const lightColor = category?.color.light ?? '#f0fdf4'
  const initials = worker.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
  const stars = '★'.repeat(Math.round(worker.avgRating)) + '☆'.repeat(5 - Math.round(worker.avgRating))

  return new ImageResponse(
    <div
      style={{
        width: 1200, height: 630,
        background: '#ffffff',
        display: 'flex',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent stripe */}
      <div style={{ width: 12, background: accentColor, flexShrink: 0 }} />

      {/* Left panel */}
      <div style={{
        width: 380,
        background: lightColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        gap: 20,
        flexShrink: 0,
      }}>
        {/* Avatar */}
        <div style={{
          width: 140, height: 140,
          borderRadius: 28,
          background: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 52,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: -2,
        }}>
          {initials}
        </div>

        {/* Category pill */}
        <div style={{
          background: accentColor,
          color: '#ffffff',
          fontSize: 20,
          fontWeight: 700,
          padding: '8px 20px',
          borderRadius: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {category?.icon} {worker.primarySkill}
        </div>

        {/* Location */}
        <div style={{ fontSize: 18, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          📍 {worker.area ? `${worker.area}, ` : ''}{worker.city}
        </div>

        {/* TrustWork brand */}
        <div style={{
          marginTop: 'auto',
          fontSize: 16,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          TrustWork
        </div>
      </div>

      {/* Right content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '56px 64px',
        gap: 24,
      }}>
        {/* Name + verified */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#111827', letterSpacing: -1, lineHeight: 1.1 }}>
            {worker.name}
          </span>
          {worker.verified && (
            <span style={{ fontSize: 32, color: '#22c55e' }}>✓</span>
          )}
        </div>

        {/* Headline */}
        <div style={{ fontSize: 24, color: '#6b7280', lineHeight: 1.4 }}>
          {worker.headline}
        </div>

        {/* Stars + rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32, color: '#f59e0b', letterSpacing: 2 }}>{stars}</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{worker.avgRating}</span>
          <span style={{ fontSize: 20, color: '#9ca3af' }}>({worker.reviewCount} reviews)</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#111827' }}>{worker.yearsExp}</span>
            <span style={{ fontSize: 16, color: '#9ca3af' }}>years experience</span>
          </div>
          <div style={{ width: 1, background: '#e5e7eb' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#111827' }}>{worker.completedJobs}</span>
            <span style={{ fontSize: 16, color: '#9ca3af' }}>jobs completed</span>
          </div>
          <div style={{ width: 1, background: '#e5e7eb' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: accentColor }}>
              {formatNaira(worker.rateMin)}
            </span>
            <span style={{ fontSize: 16, color: '#9ca3af' }}>from / {worker.rateType}</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 16,
          background: '#f9fafb',
          borderRadius: 16,
          padding: '16px 24px',
          fontSize: 18,
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '1px solid #e5e7eb',
        }}>
          <span style={{ fontSize: 22 }}>🤝</span>
          <span>Trusted by people your contacts know · <strong style={{ color: accentColor }}>Join TrustWork free</strong></span>
        </div>
      </div>
    </div>,
    { ...size }
  )
}
