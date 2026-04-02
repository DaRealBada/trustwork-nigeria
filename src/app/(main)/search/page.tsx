'use client'
import { useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterPanel } from '@/components/search/FilterPanel'
import { WorkerCard, type WorkerCardData } from '@/components/search/WorkerCard'

const MOCK_WORKERS: WorkerCardData[] = [
  // --- In your contacts (trust level 1) ---
  {
    id: '1',
    name: 'Emeka Okonkwo',
    headline: 'Professional Chef | 12 years experience | Lagos',
    city: 'Lagos', area: 'Lekki',
    avgRating: 4.9, reviewCount: 34,
    rateMin: 15000, rateMax: 30000, rateType: 'daily',
    skills: ['Chef / Cook'],
    trustLevel: 1,
    verified: true,
  },
  {
    id: '7',
    name: 'Seun Fadahunsi',
    headline: 'Reliable Driver | 7 years | Mainland & Island',
    city: 'Lagos', area: 'Yaba',
    avgRating: 4.8, reviewCount: 11,
    rateMin: 40000, rateMax: 60000, rateType: 'monthly',
    skills: ['Driver'],
    trustLevel: 1,
    verified: false,
  },

  // --- Known by your contacts (trust level 2) ---
  {
    id: '2',
    name: 'Bola Adeyemi',
    headline: 'Experienced Plumber | Lekki & VI',
    city: 'Lagos', area: 'Victoria Island',
    avgRating: 4.7, reviewCount: 21,
    rateMin: 10000, rateMax: 25000, rateType: 'daily',
    skills: ['Plumber'],
    trustLevel: 2, trustViaName: 'Chioma',
  },
  {
    id: '3',
    name: 'Funmi Adesanya',
    headline: 'Personal Driver | Clean record | Available weekends',
    city: 'Lagos', area: 'Ikeja',
    avgRating: 4.8, reviewCount: 18,
    rateMin: 50000, rateMax: 80000, rateType: 'monthly',
    skills: ['Driver'],
    trustLevel: 2, trustViaName: 'Tunde',
  },
  {
    id: '8',
    name: 'Adaeze Nwosu',
    headline: 'Experienced Nanny & Caregiver | 9 years | Lekki',
    city: 'Lagos', area: 'Lekki',
    avgRating: 5.0, reviewCount: 8,
    rateMin: 35000, rateMax: 50000, rateType: 'monthly',
    skills: ['Nanny / Caregiver'],
    trustLevel: 2, trustViaName: 'Tunde',
  },
  {
    id: '9',
    name: 'Yemi Fashola',
    headline: 'AC & Refrigeration Technician | All brands',
    city: 'Lagos', area: 'Surulere',
    avgRating: 4.6, reviewCount: 29,
    rateMin: 5000, rateMax: 15000, rateType: 'daily',
    skills: ['AC Technician'],
    trustLevel: 2, trustViaName: 'Chioma',
  },

  // --- General public (trust level 3) ---
  {
    id: '4',
    name: 'Chukwudi Eze',
    headline: 'Certified Electrician | 8 years | All Lagos',
    city: 'Lagos',
    avgRating: 4.5, reviewCount: 42,
    rateMin: 8000, rateMax: 20000, rateType: 'daily',
    skills: ['Electrician'],
    trustLevel: 3,
  },
  {
    id: '5',
    name: 'Ngozi Obi',
    headline: 'Home Cook & Caterer | Nigerian & Continental',
    city: 'Lagos', area: 'Gbagada',
    avgRating: 4.6, reviewCount: 15,
    rateMin: 12000, rateMax: 20000, rateType: 'daily',
    skills: ['Chef / Cook'],
    trustLevel: 3,
  },
  {
    id: '6',
    name: 'Ahmed Musa',
    headline: 'Carpenter & Furniture Maker | Abuja based',
    city: 'Abuja',
    avgRating: 4.4, reviewCount: 9,
    rateMin: 7000, rateMax: 15000, rateType: 'daily',
    skills: ['Carpenter'],
    trustLevel: 3,
  },
  {
    id: '10',
    name: 'Biodun Olatunji',
    headline: 'Professional Painter | Interior & Exterior | Lagos',
    city: 'Lagos', area: 'Ogba',
    avgRating: 4.3, reviewCount: 17,
    rateMin: 6000, rateMax: 12000, rateType: 'daily',
    skills: ['Painter'],
    trustLevel: 3,
  },
  {
    id: '11',
    name: 'Hauwa Suleiman',
    headline: 'Expert Tailor & Seamstress | Abuja | All styles',
    city: 'Abuja',
    avgRating: 4.7, reviewCount: 23,
    rateMin: 5000, rateMax: 20000, rateType: 'project',
    skills: ['Tailor / Seamstress'],
    trustLevel: 3,
  },
  {
    id: '12',
    name: 'Emeka Nwachukwu',
    headline: 'Security Guard | 5 years | Estates & Events',
    city: 'Lagos', area: 'Lekki',
    avgRating: 4.2, reviewCount: 6,
    rateMin: 30000, rateMax: 45000, rateType: 'monthly',
    skills: ['Security Guard'],
    trustLevel: 3,
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
    if (filters.minRating && w.avgRating < parseFloat(filters.minRating)) return false
    if (filters.skill) {
      const catName = filters.skill.replace(/-/g, ' ')
      if (!w.skills.some(s => s.toLowerCase().includes(catName))) return false
    }
    return true
  })

  const contactWorkers = filtered.filter(w => w.trustLevel === 1)
  const friendWorkers = filtered.filter(w => w.trustLevel === 2)
  const publicWorkers = filtered.filter(w => w.trustLevel === 3)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Find Workers</h1>
        <p className="text-sm text-gray-500">Showing results trusted by people you know</p>
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
        <div className="space-y-6">
          {contactWorkers.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                In your contacts
              </h2>
              <div className="space-y-3">
                {contactWorkers.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}

          {friendWorkers.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Known by your contacts
              </h2>
              <div className="space-y-3">
                {friendWorkers.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}

          {publicWorkers.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                Other workers
              </h2>
              <div className="space-y-3">
                {publicWorkers.map(w => <WorkerCard key={w.id} worker={w} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
