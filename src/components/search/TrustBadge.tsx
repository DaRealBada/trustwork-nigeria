import { Users, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TrustBadgeProps {
  level: 1 | 2 | 3
  viaName?: string | null
  className?: string
}

export function TrustBadge({ level, viaName, className }: TrustBadgeProps) {
  if (level === 1) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
        className
      )}>
        <UserCheck size={11} />
        In your contacts
      </span>
    )
  }
  if (level === 2 && viaName) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
        className
      )}>
        <Users size={11} />
        Known by {viaName}
      </span>
    )
  }
  return null
}
