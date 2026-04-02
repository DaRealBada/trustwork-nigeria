import Link from 'next/link'
import { BottomNav } from '@/components/ui/BottomNav'
import { Avatar } from '@/components/ui/Avatar'
import { Search, LayoutDashboard, Users, User, MapPin } from 'lucide-react'

// Hardcoded demo user — swap for real auth session later
const DEMO_USER = {
  name: 'Amaka Okafor',
  city: 'Lagos',
  area: 'Lekki',
  contactCount: 3,
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col p-4 z-40">
        <div className="mb-6 px-2">
          <h1 className="text-xl font-bold text-green-700">TrustWork</h1>
          <p className="text-xs text-gray-400">Trusted labour, Nigeria</p>
        </div>

        {/* Logged-in user card */}
        <div className="mb-6 p-3 bg-green-50 rounded-xl flex items-center gap-3">
          <Avatar name={DEMO_USER.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{DEMO_USER.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-gray-400" />
              <p className="text-xs text-gray-500">{DEMO_USER.area}, {DEMO_USER.city}</p>
            </div>
            <p className="text-xs text-green-600 mt-0.5">{DEMO_USER.contactCount} contacts synced</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { href: '/search', label: 'Search Workers', icon: Search },
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/contacts', label: 'My Contacts', icon: Users },
            { href: '/my-profile', label: 'My Profile', icon: User },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors text-sm font-medium">
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 px-2">Signed in as demo user</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
        <h1 className="text-lg font-bold text-green-700">TrustWork</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} />
            {DEMO_USER.area}
          </div>
          <Avatar name={DEMO_USER.name} size="sm" />
        </div>
      </div>

      {/* Main content */}
      <main className="md:ml-64 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
