export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRateRange(min: number | null, max: number | null, type: string): string {
  if (!min && !max) return 'Rate negotiable'
  const typeLabel = type === 'hourly' ? '/hr' : type === 'daily' ? '/day' : '/project'
  if (min && max) return `${formatNaira(min)} – ${formatNaira(max)}${typeLabel}`
  if (min) return `From ${formatNaira(min)}${typeLabel}`
  return `Up to ${formatNaira(max!)}${typeLabel}`
}

export function formatPhone(e164: string): string {
  if (e164.startsWith('+234')) {
    const local = '0' + e164.slice(4)
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
  }
  return e164
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(date).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })
}
