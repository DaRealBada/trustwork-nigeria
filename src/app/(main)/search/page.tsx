'use client'
import { useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterPanel } from '@/components/search/FilterPanel'
import { WorkerCard, type WorkerCardData } from '@/components/search/WorkerCard'
import { Users, UserCheck, Globe } from 'lucide-react'

// Simulated trust graph — in production this comes from the user's contact import
// Level 1 = your contacts confirmed this worker personally
// Level 2 = someone your contact knows confirmed them
// Level 3 = no network connection — public reputation only
const MOCK_WORKERS: WorkerCardData[] = [
  {
    id: '1', name: 'Emeka Okonkwo',
    headline: 'Professional Chef · Nigerian & Continental · Lagos',
    city: 'Lagos', area: 'Lekki',
    recommendRatio: 94, confirmedJobs: 34,
    rateMin: 15000, rateMax: 30000, rateType: 'daily',
    skills: ['Chef / Cook'], trustLevel: 1, verified: true,
    yourConfirmation: { verdict: 'positive', jobType: 'Cooking / Chef' },
  },
  {
    id: '7', name: 'Seun Fadahunsi',
    headline: 'Reliable Driver · Mainland & Island · 7 years',
    city: 'Lagos', area: 'Yaba',
    recommendRatio: 91, confirmedJobs: 11,
    rateMin: 40000, rateMax: 60000, rateType: 'monthly',
    skills: ['Driver'], trustLevel: 1, verified: false,
    yourConfirmation: { verdict: 'positive', jobType: 'Driving / Logistics' },
  },
  {
    id: '2', name: 'Bola Adeyemi',
    headline: 'Experienced Plumber · Residential & Commercial · Lagos',
    city: 'Lagos', area: 'Victoria Island',
    recommendRatio: 88, confirmedJobs: 21,
    rateMin: 10000, rateMax: 25000, rateType: 'daily',
    skills: ['Plumber'], trustLevel: 2, trustViaName: 'Chioma',
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
    contactConfirmation: { name: 'Tunde', verdict: 'positive', jobType: 'Childcare / Nanny', contextTags: ['Family household'] },
  },
  {
    id: '9', name: 'Yemi Fashola',
    headline: 'AC & Refrigeration Technician · All brands',
    city: 'Lagos', area: 'Surulere',
    recommendRatio: 83, confirmedJobs: 29,
    rateMin: 5000, rateMax: 15000, rateType: 'daily',
    skills: ['AC Technician'], trustLevel: 2, trustViaName: 'Chioma',
    contactConfirmation: { name: 'Chioma', verdict: 'neutral', jobType: 'Electrical', contextTags: ['Budget-conscious'] },
  },
  {
    id: '4', name: 'Chukwudi Eze',
    headline: 'Certified Electrician · 8 years · All Lagos',
    city: 'Lagos',
    recommendRatio: 79, confirmedJobs: 42,
    rateMin: 8000, rateMax: 20000, rateType: 'daily',
    skills: ['Electrician'], trustLevel: 3,
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
    city: 'Abuja',
    recommendRatio: 72, confirmedJobs: 9,
    rateMin: 7000, rateMax: 15000, rateType: 'daily',
    skills: ['Carpenter'], trustLevel: 3,
  },
  {
    id: '10', name: 'Biodun Olatunji',
    headline: 'Professional Painter · Interior & Exterior · Lagos',
    city: 'Lagos', area: 'Ogba',
    recommendRatio: 76, confirmedJobs: 17,
    rateMin: 6000, rateMax: 12000, rateType: 'daily',
    skills: ['Painter'], trustLevel: 3,
  },
  {
    id: '11', name: 'Hauwa Suleiman',
    headline: 'Expert Tailor & Seamstress · All styles · Abuja',
    city: 'Abuja',
    recommendRatio: 87, confirmedJobs: 23,
    rateMin: 5000, rateMax: 20000, rateType: 'project',
    skills: ['Tailor / Seamstress'], trustLevel: 3,
  },
  {
    id: '12', name: 'Emeka Nwachukwu',
    headline: 'Security Guard · 5 years · Estates & Events',
    city: 'Lagos', area: 'Lekki',
    recommendRatio: 67, confirmedJobs: 6,
    rateMin: 30000, rateMax: 45000, rateType: 'monthly',
    skills: ['Security Guard'], trustLevel: 3,
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ skill: '', city: '', area: '', minRating: '' })

  const filtered = MOCK_WORKERS.filter(w => {
    const q = query.toLowerCase()
    if (q && !w.name.toLowerCase().includes(q) && !w.headline.toLowerCase().includes(q) && !w.skills.some(s => s.toLowerCase().includes(q))) return false
    if (filters.city && w.city !== filters.city) return false
    if (filters.area && w.area !== filters.area) return false
    if (filters.skill) {
      const catName = filters.skill.replace(/-/g, ' ')
      if (!w.skills.some(s => s.toLowerCase().includes(catName))) return false
    }
    return true
  })

  const yourNetwork = filtered.filter(w => w.trustLevel === 1)
  const extended    = filtered.filter(w => w.trustLevel === 2)
  const general     = filtered.filter(w => w.trustLevel === 3)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Find Workers</h1>
        <p className="text-sm text-gray-500">Results ordered by how close they are to your network</p>
      </div>

      <div className="space-y-3 mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-medium">No workers found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-7">

          {yourNetwork.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={14} className="text-green-600" />
                <h2 className="text-xs font-bold text-green-700 uppercase tracking-wide">Your Network</h2>
                <span className="text-xs text-gray-400 ml-auto">Workers you have personally confirmed</span>
              </div>
              <div className="space-y-3">
                {yourNetwork.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}

          {extended.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-blue-600" />
                <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">Extended Network</h2>
                <span className="text-xs text-gray-400 ml-auto">Confirmed by people you trust</span>
              </div>
              <div className="space-y-3">
                {extended.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}

          {general.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-gray-400" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">General Reputation</h2>
                <span className="text-xs text-gray-400 ml-auto">No network connection</span>
              </div>
              <div className="space-y-3">
                {general.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}
