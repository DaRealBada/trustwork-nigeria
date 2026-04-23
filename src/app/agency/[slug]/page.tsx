import { notFound } from 'next/navigation'
import { MapPin, CheckCircle, Users, Briefcase, Phone, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

type AgencyWorker = { name: string; role: string; slug?: string; recommendRatio: number; confirmedJobs: number; verified: boolean }
type Agency = {
  slug: string; name: string; tagline: string; description: string
  city: string; area: string; phone: string; established: number
  categories: string[]; workerCount: number; totalConfirmedJobs: number
  recommendRatio: number; networkContacts: number
  workers: AgencyWorker[]
  hiringNote: string
}

const AGENCIES: Record<string, Agency> = {
  'domus-domestic': {
    slug: 'domus-domestic', name: 'Domus Domestic Services',
    tagline: 'Trusted domestic staff across Lagos since 2011',
    description: 'Domus places screened, trained domestic staff — chefs, nannies, drivers, and housekeepers — in Lagos homes. Every worker is background-checked and carries a Domus reference card. We provide a 3-month replacement guarantee on all placements.',
    city: 'Lagos', area: 'Lekki Phase 1', phone: '08091234567', established: 2011,
    categories: ['Chef / Cook', 'Nanny / Caregiver', 'Driver', 'Housekeeper'],
    workerCount: 47, totalConfirmedJobs: 312, recommendRatio: 91, networkContacts: 2,
    hiringNote: 'Hiring through Domus gives you a vetted worker backed by the agency. You can also contact workers directly — but the agency replacement guarantee only applies to agency bookings.',
    workers: [
      { name: 'Emeka Okonkwo', role: 'Chef / Cook',         slug: 'emeka-okonkwo', recommendRatio: 94, confirmedJobs: 34, verified: true  },
      { name: 'Adaeze Nwosu',  role: 'Nanny / Caregiver',   recommendRatio: 100,  confirmedJobs: 8,  verified: false },
      { name: 'Seun Fadahunsi',role: 'Driver',               recommendRatio: 91,  confirmedJobs: 11, verified: false },
      { name: 'Grace Uchenna', role: 'Housekeeper',          recommendRatio: 87,  confirmedJobs: 19, verified: false },
      { name: 'Lanre Oladele', role: 'Chef / Cook',          recommendRatio: 83,  confirmedJobs: 7,  verified: false },
    ],
  },
  'artisanpro-lagos': {
    slug: 'artisanpro-lagos', name: 'ArtisanPro Lagos',
    tagline: 'Vetted skilled tradesmen — Island & Mainland',
    description: 'ArtisanPro connects Lagos homes and businesses with vetted plumbers, electricians, carpenters, and painters. All workers carry certified trade IDs and are insured for residential jobs. Response time guaranteed under 4 hours on the Island.',
    city: 'Lagos', area: 'Victoria Island', phone: '09012345678', established: 2016,
    categories: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Technician'],
    workerCount: 83, totalConfirmedJobs: 541, recommendRatio: 86, networkContacts: 1,
    hiringNote: 'ArtisanPro workers can be hired directly or through the agency. Direct hire is cheaper. Agency hire includes job insurance and a 30-day workmanship guarantee.',
    workers: [
      { name: 'Bola Adeyemi',    role: 'Plumber',        slug: 'bola-adeyemi', recommendRatio: 88, confirmedJobs: 21, verified: false },
      { name: 'Chukwudi Eze',    role: 'Electrician',    recommendRatio: 79, confirmedJobs: 42, verified: false },
      { name: 'Yemi Fashola',    role: 'AC Technician',  recommendRatio: 83, confirmedJobs: 29, verified: false },
      { name: 'Tayo Carpenter',  role: 'Carpenter',      recommendRatio: 81, confirmedJobs: 14, verified: false },
      { name: 'Biodun Olatunji', role: 'Painter',        recommendRatio: 76, confirmedJobs: 17, verified: false },
    ],
  },
  'safehands-security': {
    slug: 'safehands-security', name: 'SafeHands Security Services',
    tagline: 'Licensed estate & event security — Lagos',
    description: 'SafeHands provides licensed security guards for estates, events, and commercial premises across Lagos. All guards are screened with NIN verification, SSCE minimum qualification, and physical fitness assessment. Minimum 3-month placement.',
    city: 'Lagos', area: 'Surulere', phone: '08078901234', established: 2009,
    categories: ['Security Guard'],
    workerCount: 134, totalConfirmedJobs: 203, recommendRatio: 82, networkContacts: 0,
    hiringNote: 'Security staff must be hired through SafeHands — direct hire bypasses our licensing and insurance coverage. All guards are registered with the Private Guard Practitioners Association of Nigeria (PGPAN).',
    workers: [
      { name: 'Emeka Nwachukwu', role: 'Security Guard', recommendRatio: 67, confirmedJobs: 6,  verified: false },
      { name: 'Musa Ibrahim',    role: 'Security Guard', recommendRatio: 85, confirmedJobs: 11, verified: false },
      { name: 'Sunday Okeke',    role: 'Security Guard', recommendRatio: 78, confirmedJobs: 9,  verified: false },
    ],
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Chef / Cook': '#ea580c', 'Nanny / Caregiver': '#db2777', 'Driver': '#2563eb',
  'Housekeeper': '#7c3aed', 'Plumber': '#0891b2', 'Electrician': '#ca8a04',
  'Carpenter': '#92400e', 'Painter': '#059669', 'AC Technician': '#6366f1',
  'Security Guard': '#374151',
}

export default function AgencyPage({ params }: { params: { slug: string } }) {
  const agency = AGENCIES[params.slug]
  if (!agency) notFound()

  const accentColor = CATEGORY_COLORS[agency.categories[0]] ?? '#16a34a'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div style={{ backgroundColor: accentColor }} className="h-24 w-full" />

      <div className="max-w-xl mx-auto px-4">
        {/* Header card */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 px-5 pt-4 pb-5 mb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{agency.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                  <ShieldCheck size={10} /> Agency
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{agency.tagline}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <MapPin size={11} /> {agency.area}, {agency.city}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-0 pt-3 border-t border-gray-100 text-center">
            <div>
              <p className="text-lg font-black" style={{ color: accentColor }}>{agency.recommendRatio}%</p>
              <p className="text-xs text-gray-400 mt-0.5">recommend</p>
            </div>
            <div className="border-x border-gray-100">
              <p className="text-lg font-black text-gray-900">{agency.workerCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">workers</p>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900">{agency.totalConfirmedJobs}</p>
              <p className="text-xs text-gray-400 mt-0.5">confirmed jobs</p>
            </div>
          </div>

          {/* Network contacts */}
          {agency.networkContacts > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-bold text-green-700">
                👥 {agency.networkContacts} of your contacts have used workers from this agency
              </p>
            </div>
          )}
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <h2 className="text-sm font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{agency.description}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <Phone size={13} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-mono">{agency.phone}</span>
            <span className="text-xs text-gray-400 ml-2">Est. {agency.established}</span>
          </div>
        </div>

        {/* Hire note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
          <p className="text-xs font-bold text-amber-800 mb-1">How to hire</p>
          <p className="text-xs text-amber-700 leading-relaxed">{agency.hiringNote}</p>
        </div>

        {/* Workers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} style={{ color: accentColor }} />
            <h2 className="text-sm font-bold text-gray-900">Workers at this agency</h2>
            <span className="text-xs text-gray-400 ml-auto">{agency.workerCount} total</span>
          </div>
          <div className="space-y-3">
            {agency.workers.map((w, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ backgroundColor: accentColor }}>
                  {w.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  {w.slug ? (
                    <Link href={`/w/${w.slug}`} className="text-sm font-semibold text-gray-900 hover:text-green-700">{w.name}</Link>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{w.name}</p>
                  )}
                  <p className="text-xs text-gray-500">{w.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold" style={{ color: accentColor }}>{w.recommendRatio}%</p>
                  <p className="text-xs text-gray-400">{w.confirmedJobs} jobs</p>
                </div>
                {w.verified && <CheckCircle size={13} className="text-green-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={14} style={{ color: accentColor }} />
            <h2 className="text-sm font-bold text-gray-900">Services offered</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {agency.categories.map(cat => (
              <span key={cat} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                style={{ backgroundColor: CATEGORY_COLORS[cat] ?? accentColor }}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
          <p className="text-sm font-bold text-gray-900 mb-1">Want to hire from {agency.name.split(' ')[0]}?</p>
          <p className="text-xs text-gray-500 mb-4">Join TrustWork free — see which agencies your contacts have used and trust.</p>
          <a href="/search" className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: accentColor }}>
            Search all workers & agencies
          </a>
        </div>
      </div>
    </div>
  )
}
