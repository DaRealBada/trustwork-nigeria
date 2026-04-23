'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterPanel } from '@/components/search/FilterPanel'
import { WorkerCard, type WorkerCardData } from '@/components/search/WorkerCard'
import { Users, UserCheck, Globe, Building2, ShieldCheck } from 'lucide-react'

// ── User context (in production set during onboarding) ──
const USER_CONTEXT = { tags: ['Family household', 'Lekki'], name: 'Toluwani' }

// ── Agency cards ──
type AgencyCard = {
  slug: string; name: string; tagline: string; categories: string[]
  workerCount: number; recommendRatio: number; networkContacts: number
  trustLevel: 1 | 2 | 3; accentColor: string
  contactConfirmation?: { name: string; verdict: 'positive'; note?: string }
}
const MOCK_AGENCIES: AgencyCard[] = [
  {
    slug: 'domus-domestic', name: 'Domus Domestic Services',
    tagline: 'Chefs, nannies, drivers & housekeepers — Lekki · VI · Ikoyi',
    categories: ['Chef / Cook', 'Nanny / Caregiver', 'Driver', 'Housekeeper'],
    workerCount: 47, recommendRatio: 91, networkContacts: 2,
    trustLevel: 2, accentColor: '#db2777',
    contactConfirmation: { name: 'Tunde', verdict: 'positive', note: 'Used them for our nanny — excellent screening process.' },
  },
  {
    slug: 'artisanpro-lagos', name: 'ArtisanPro Lagos',
    tagline: 'Plumbers, electricians, carpenters — Island & Mainland',
    categories: ['Plumber', 'Electrician', 'Carpenter', 'Painter'],
    workerCount: 83, recommendRatio: 86, networkContacts: 1,
    trustLevel: 2, accentColor: '#0891b2',
    contactConfirmation: { name: 'Chioma', verdict: 'positive', note: 'Booked a plumber through them — came same day.' },
  },
  {
    slug: 'safehands-security', name: 'SafeHands Security Services',
    tagline: 'Licensed estate & event security guards — Lagos',
    categories: ['Security Guard'],
    workerCount: 134, recommendRatio: 82, networkContacts: 0,
    trustLevel: 3, accentColor: '#374151',
  },
]

// ── Workers ──
const MOCK_WORKERS: WorkerCardData[] = [
  {
    id: '1', name: 'Emeka Okonkwo',
    headline: 'Professional Chef · Nigerian & Continental · Lagos',
    city: 'Lagos', area: 'Lekki',
    recommendRatio: 94, confirmedJobs: 34,
    rateMin: 15000, rateMax: 30000, rateType: 'daily',
    skills: ['Chef / Cook'], trustLevel: 1, verified: true,
    agency: 'Domus Domestic Services', agencySlug: 'domus-domestic',
    yourConfirmation: { verdict: 'positive', jobType: 'Cooking / Chef' },
  },
  {
    id: '7', name: 'Seun Fadahunsi',
    headline: 'Reliable Driver · Mainland & Island · 7 years',
    city: 'Lagos', area: 'Yaba',
    recommendRatio: 91, confirmedJobs: 11,
    rateMin: 40000, rateMax: 60000, rateType: 'monthly',
    skills: ['Driver'], trustLevel: 1, verified: false,
    agency: 'Domus Domestic Services', agencySlug: 'domus-domestic',
    yourConfirmation: { verdict: 'positive', jobType: 'Driving / Logistics' },
  },
  {
    id: '2', name: 'Bola Adeyemi',
    headline: 'Experienced Plumber · Residential & Commercial · Lagos',
    city: 'Lagos', area: 'Victoria Island',
    recommendRatio: 88, confirmedJobs: 21,
    rateMin: 10000, rateMax: 25000, rateType: 'daily',
    skills: ['Plumber'], trustLevel: 2, trustViaName: 'Chioma',
    agency: 'ArtisanPro Lagos', agencySlug: 'artisanpro-lagos',
    contactConfirmation: { name: 'Chioma', verdict: 'positive', jobType: 'Plumbing', contextTags: ['Emergency callout'] },
  },
  {
    id: '3', name: 'Funmi Adesanya',
    headline: 'Personal Driver · Clean record · Available weekends',
    city: 'Lagos', area: 'Ikeja',
    recommendRatio: 85, confirmedJobs: 18,
    rateMin: 50000, rateMax: 80000, rateType: 'monthly',
    skills: ['Driver'], trustLevel: 2, trustViaName: 'Tunde',
    contactConfirmation: { name: 'Tunde', verdict: 'positive', jobType: 'Driving / Logistics', contextTags: ['Family household'] },
  },
  {
    id: '8', name: 'Adaeze Nwosu',
    headline: 'Experienced Nanny & Caregiver · 9 years · Lekki',
    city: 'Lagos', area: 'Lekki',
    recommendRatio: 100, confirmedJobs: 8,
    rateMin: 35000, rateMax: 50000, rateType: 'monthly',
    skills: ['Nanny / Caregiver'], trustLevel: 2, trustViaName: 'Tunde',
    agency: 'Domus Domestic Services', agencySlug: 'domus-domestic',
    contactConfirmation: { name: 'Tunde', verdict: 'positive', jobType: 'Childcare / Nanny', contextTags: ['Family household'] },
  },
  {
    id: '9', name: 'Yemi Fashola',
    headline: 'AC & Refrigeration Technician · All brands',
    city: 'Lagos', area: 'Surulere',
    recommendRatio: 83, confirmedJobs: 29,
    rateMin: 5000, rateMax: 15000, rateType: 'daily',
    skills: ['AC Technician'], trustLevel: 2, trustViaName: 'Chioma',
    agency: 'ArtisanPro Lagos', agencySlug: 'artisanpro-lagos',
    contactConfirmation: { name: 'Chioma', verdict: 'neutral', jobType: 'Electrical', contextTags: ['Budget-conscious'] },
  },
  {
    id: '4', name: 'Chukwudi Eze',
    headline: 'Certified Electrician · 8 years · All Lagos',
    city: 'Lagos', recommendRatio: 79, confirmedJobs: 42,
    rateMin: 8000, rateMax: 20000, rateType: 'daily',
    skills: ['Electrician'], trustLevel: 3,
    agency: 'ArtisanPro Lagos', agencySlug: 'artisanpro-lagos',
  },
  {
    id: '5', name: 'Ngozi Obi',
    headline: 'Home Cook & Caterer · Nigerian & Continental',
    city: 'Lagos', area: 'Gbagada',
    recommendRatio: 80, confirmedJobs: 15,
    rateMin: 12000, rateMax: 20000, rateType: 'daily',
    skills: ['Chef / Cook'], trustLevel: 3,
  },
  {
    id: '6', name: 'Ahmed Musa',
    headline: 'Carpenter & Furniture Maker · Abuja',
    city: 'Abuja', recommendRatio: 72, confirmedJobs: 9,
    rateMin: 7000, rateMax: 15000, rateType: 'daily',
    skills: ['Carpenter'], trustLevel: 3,
  },
  {
    id: '10', name: 'Biodun Olatunji',
    headline: 'Professional Painter · Interior & Exterior · Lagos',
    city: 'Lagos', area: 'Ogba', recommendRatio: 76, confirmedJobs: 17,
    rateMin: 6000, rateMax: 12000, rateType: 'daily',
    skills: ['Painter'], trustLevel: 3,
    agency: 'ArtisanPro Lagos', agencySlug: 'artisanpro-lagos',
  },
  {
    id: '11', name: 'Hauwa Suleiman',
    headline: 'Expert Tailor & Seamstress · All styles · Abuja',
    city: 'Abuja', recommendRatio: 87, confirmedJobs: 23,
    rateMin: 5000, rateMax: 20000, rateType: 'project',
    skills: ['Tailor / Seamstress'], trustLevel: 3,
  },
  {
    id: '12', name: 'Emeka Nwachukwu',
    headline: 'Security Guard · 5 years · Estates & Events',
    city: 'Lagos', area: 'Lekki', recommendRatio: 67, confirmedJobs: 6,
    rateMin: 30000, rateMax: 45000, rateType: 'monthly',
    skills: ['Security Guard'], trustLevel: 3,
    agency: 'SafeHands Security Services', agencySlug: 'safehands-security',
  },
  {
    id: '13', name: 'Kemi Taiwo',
    headline: 'Experienced Housekeeper · Full-time & Part-time · Lagos',
    city: 'Lagos', area: 'Lekki', recommendRatio: 89, confirmedJobs: 22,
    rateMin: 25000, rateMax: 40000, rateType: 'monthly',
    skills: ['Housekeeper'], trustLevel: 3,
    agency: 'Domus Domestic Services', agencySlug: 'domus-domestic',
  },
  {
    id: '14', name: 'Dauda Musa',
    headline: 'Gate Man / Security · Residential · Lagos Mainland',
    city: 'Lagos', area: 'Surulere', recommendRatio: 74, confirmedJobs: 5,
    rateMin: 20000, rateMax: 30000, rateType: 'monthly',
    skills: ['Security Guard'], trustLevel: 3,
    agency: 'SafeHands Security Services', agencySlug: 'safehands-security',
  },
]

function AgencyCard({ agency }: { agency: AgencyCard }) {
  return (
    <Link href={`/agency/${agency.slug}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all"
        style={{ borderLeftColor: agency.accentColor, borderLeftWidth: 3 }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Building2 size={13} style={{ color: agency.accentColor }} />
              <span className="font-semibold text-gray-900 text-sm">{agency.name}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{agency.tagline}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0"
            style={{ backgroundColor: agency.accentColor }}>Agency</span>
        </div>

        {agency.trustLevel === 2 && agency.contactConfirmation && (
          <div className="mt-2 bg-blue-50 rounded-lg px-2.5 py-1.5">
            <p className="text-xs text-blue-800 font-semibold">
              👍 {agency.contactConfirmation.name} used this agency
            </p>
            {agency.contactConfirmation.note && (
              <p className="text-xs text-blue-600 mt-0.5 italic">&ldquo;{agency.contactConfirmation.note}&rdquo;</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex flex-wrap gap-1">
            {agency.categories.slice(0, 3).map(cat => (
              <span key={cat} className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">{cat}</span>
            ))}
            {agency.categories.length > 3 && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{agency.categories.length - 3}</span>}
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xs font-bold" style={{ color: agency.accentColor }}>{agency.recommendRatio}% recommend</span>
            <span className="text-xs text-gray-400 block">{agency.workerCount} workers</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ skill: '', city: '', area: '', minRating: '' })

  const q = query.toLowerCase()
  const catName = filters.skill.replace(/-/g, ' ').toLowerCase()

  const filteredWorkers = MOCK_WORKERS.filter(w => {
    if (q && !w.name.toLowerCase().includes(q) && !w.headline.toLowerCase().includes(q) && !w.skills.some(s => s.toLowerCase().includes(q))) return false
    if (filters.city && w.city !== filters.city) return false
    if (filters.area && w.area !== filters.area) return false
    if (catName && !w.skills.some(s => s.toLowerCase().includes(catName))) return false
    return true
  })

  const filteredAgencies = MOCK_AGENCIES.filter(a => {
    if (q && !a.name.toLowerCase().includes(q) && !a.categories.some(c => c.toLowerCase().includes(q))) return false
    if (catName && !a.categories.some(c => c.toLowerCase().includes(catName))) return false
    return true
  })

  const yourNetwork = filteredWorkers.filter(w => w.trustLevel === 1)
  const extended    = filteredWorkers.filter(w => w.trustLevel === 2)
  const general     = filteredWorkers.filter(w => w.trustLevel === 3)
  const networkAgencies = filteredAgencies.filter(a => a.trustLevel <= 2)
  const generalAgencies = filteredAgencies.filter(a => a.trustLevel === 3)

  const hasResults = filteredWorkers.length > 0 || filteredAgencies.length > 0

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Find Workers & Agencies</h1>
        <p className="text-sm text-gray-500">Results ordered by your network — closest trust first</p>
      </div>

      {/* Personal context banner */}
      <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-4 flex items-center justify-between">
        <p className="text-xs text-green-800">
          <span className="font-bold">Showing for: </span>
          {USER_CONTEXT.tags.map((t, i) => (
            <span key={t}>{t}{i < USER_CONTEXT.tags.length - 1 ? ' · ' : ''}</span>
          ))}
        </p>
        <button className="text-xs text-green-600 font-semibold underline">Edit</button>
      </div>

      <div className="space-y-3 mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {!hasResults ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-medium">No results found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-7">

          {/* Your Network — workers + agencies your contacts confirmed */}
          {(yourNetwork.length > 0 || networkAgencies.length > 0) && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={14} className="text-green-600" />
                <h2 className="text-xs font-bold text-green-700 uppercase tracking-wide">Your Network</h2>
                <span className="text-xs text-gray-400 ml-auto">Workers & agencies your contacts trust</span>
              </div>
              <div className="space-y-3">
                {yourNetwork.map(w => <WorkerCard key={w.id} worker={w} />)}
                {networkAgencies.map(a => <AgencyCard key={a.slug} agency={a} />)}
              </div>
            </section>
          )}

          {/* Extended network */}
          {extended.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-blue-600" />
                <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">Extended Network</h2>
                <span className="text-xs text-gray-400 ml-auto">Confirmed by people your contacts trust</span>
              </div>
              <div className="space-y-3">
                {extended.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}

          {/* General reputation — public, no network link */}
          {(general.length > 0 || generalAgencies.length > 0) && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Globe size={14} className="text-gray-400" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">General Reputation</h2>
                <span className="text-xs text-gray-400 ml-auto">No network connection</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">None of your contacts have used these workers yet.</span> Invite contacts to unlock more network trust.
                </p>
              </div>
              <div className="space-y-3">
                {general.map(w => <WorkerCard key={w.id} worker={w} />)}
                {generalAgencies.map(a => <AgencyCard key={a.slug} agency={a} />)}
              </div>
            </section>
          )}

          {/* Privacy note */}
          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <ShieldCheck size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">Your contacts&apos; confirmations are visible to you because they are in your network. They control who else can see their reviews.</p>
          </div>

        </div>
      )}
    </div>
  )
}
