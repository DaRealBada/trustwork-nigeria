import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = { sm: 32, md: 40, lg: 56, xl: 80 }

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const px = sizes[size]
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size]

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizeClass, className)}>
        <Image src={src} alt={name} width={px} height={px} className="object-cover" />
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white bg-green-600',
      sizeClass, className
    )}>
      {initials(name)}
    </div>
  )
}
