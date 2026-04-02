'use client'
import { SKILL_CATEGORIES, NIGERIAN_CITIES, LAGOS_AREAS } from '@/lib/utils/constants'

interface Filters {
  skill: string
  city: string
  area: string
  minRating: string
}

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function set(key: keyof Filters, val: string) {
    onChange({ ...filters, [key]: val })
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <select
        value={filters.skill}
        onChange={e => set('skill', e.target.value)}
        className="flex-shrink-0 text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All skills</option>
        {SKILL_CATEGORIES.map(c => (
          <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
        ))}
      </select>

      <select
        value={filters.city}
        onChange={e => set('city', e.target.value)}
        className="flex-shrink-0 text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Any city</option>
        {NIGERIAN_CITIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {filters.city === 'Lagos' && (
        <select
          value={filters.area}
          onChange={e => set('area', e.target.value)}
          className="flex-shrink-0 text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Any area</option>
          {LAGOS_AREAS.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      )}

      <select
        value={filters.minRating}
        onChange={e => set('minRating', e.target.value)}
        className="flex-shrink-0 text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Any rating</option>
        <option value="4">4+ stars</option>
        <option value="4.5">4.5+ stars</option>
      </select>
    </div>
  )
}
