'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { SKILL_CATEGORIES, NIGERIAN_CITIES, LAGOS_AREAS } from '@/lib/utils/constants'
import { Camera } from 'lucide-react'

export default function MyProfilePage() {
  const [name, setName] = useState('Emeka Okonkwo')
  const [headline, setHeadline] = useState('Professional Chef | 12 years experience | Lagos')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('Lagos')
  const [area, setArea] = useState('Lekki')
  const [skills, setSkills] = useState<string[]>(['chef'])
  const [rateMin, setRateMin] = useState('15000')
  const [rateMax, setRateMax] = useState('30000')
  const [rateType, setRateType] = useState('daily')
  const [loading, setLoading] = useState(false)

  function toggleSkill(slug: string) {
    setSkills(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 800)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Worker Profile</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={null} name={name} size="xl" />
            <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Profile photo</p>
            <p className="text-xs text-gray-500">Profiles with photos get 3x more views</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
          <input value={headline} onChange={e => setHeadline(e.target.value)}
            placeholder="e.g. Experienced Plumber | Lagos Island"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About you</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)}
            placeholder="Tell employers about your experience, specialties, and what makes you stand out..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              {NIGERIAN_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {city === 'Lagos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select value={area} onChange={e => setArea(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {LAGOS_AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleSkill(cat.slug)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  skills.includes(cat.slug)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rate (₦)</label>
          <div className="flex items-center gap-2">
            <input value={rateMin} onChange={e => setRateMin(e.target.value)} placeholder="Min"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <span className="text-gray-400">—</span>
            <input value={rateMax} onChange={e => setRateMax(e.target.value)} placeholder="Max"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <select value={rateType} onChange={e => setRateType(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="daily">/ day</option>
              <option value="hourly">/ hour</option>
              <option value="project">/ project</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>Save Profile</Button>
      </form>
    </div>
  )
}
