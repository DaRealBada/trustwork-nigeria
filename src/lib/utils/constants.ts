export const SKILL_CATEGORIES = [
  { slug: 'chef',         name: 'Chef / Cook',       icon: '🍳', color: { bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-700', accent: '#ea580c', light: '#fff7ed' } },
  { slug: 'driver',       name: 'Driver',             icon: '🚗', color: { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700',   accent: '#1d4ed8', light: '#eff6ff' } },
  { slug: 'plumber',      name: 'Plumber',            icon: '🔧', color: { bg: 'bg-cyan-50',    border: 'border-cyan-200',   text: 'text-cyan-700',   accent: '#0e7490', light: '#ecfeff' } },
  { slug: 'electrician',  name: 'Electrician',        icon: '⚡', color: { bg: 'bg-yellow-50',  border: 'border-yellow-200', text: 'text-yellow-700', accent: '#ca8a04', light: '#fefce8' } },
  { slug: 'carpenter',    name: 'Carpenter',          icon: '🪚', color: { bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700',  accent: '#92400e', light: '#fffbeb' } },
  { slug: 'cleaner',      name: 'Cleaner',            icon: '🧹', color: { bg: 'bg-teal-50',    border: 'border-teal-200',   text: 'text-teal-700',   accent: '#0f766e', light: '#f0fdfa' } },
  { slug: 'security',     name: 'Security Guard',     icon: '🛡️', color: { bg: 'bg-slate-50',   border: 'border-slate-200',  text: 'text-slate-700',  accent: '#334155', light: '#f8fafc' } },
  { slug: 'nanny',        name: 'Nanny / Caregiver',  icon: '👶', color: { bg: 'bg-pink-50',    border: 'border-pink-200',   text: 'text-pink-700',   accent: '#be185d', light: '#fdf2f8' } },
  { slug: 'tailor',       name: 'Tailor / Seamstress',icon: '🧵', color: { bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700', accent: '#7e22ce', light: '#faf5ff' } },
  { slug: 'mechanic',     name: 'Mechanic',           icon: '🔩', color: { bg: 'bg-zinc-50',    border: 'border-zinc-200',   text: 'text-zinc-700',   accent: '#3f3f46', light: '#fafafa' } },
  { slug: 'gardener',     name: 'Gardener',           icon: '🌿', color: { bg: 'bg-green-50',   border: 'border-green-200',  text: 'text-green-700',  accent: '#15803d', light: '#f0fdf4' } },
  { slug: 'painter',      name: 'Painter',            icon: '🖌️', color: { bg: 'bg-rose-50',    border: 'border-rose-200',   text: 'text-rose-700',   accent: '#be123c', light: '#fff1f2' } },
  { slug: 'ac-technician',name: 'AC Technician',      icon: '❄️', color: { bg: 'bg-sky-50',     border: 'border-sky-200',    text: 'text-sky-700',    accent: '#0369a1', light: '#f0f9ff' } },
  { slug: 'mason',        name: 'Mason / Builder',    icon: '🏗️', color: { bg: 'bg-stone-50',   border: 'border-stone-200',  text: 'text-stone-700',  accent: '#57534e', light: '#fafaf9' } },
  { slug: 'welder',       name: 'Welder',             icon: '🔥', color: { bg: 'bg-red-50',     border: 'border-red-200',    text: 'text-red-700',    accent: '#b91c1c', light: '#fef2f2' } },
] as const

export type SkillSlug = typeof SKILL_CATEGORIES[number]['slug']

export function getCategoryBySlug(slug: string) {
  return SKILL_CATEGORIES.find(c => c.slug === slug) ?? SKILL_CATEGORIES[0]
}

export function getCategoryByName(name: string) {
  return SKILL_CATEGORIES.find(c =>
    c.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
  ) ?? null
}

export const NIGERIAN_CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Kaduna', 'Enugu', 'Warri', 'Uyo',
]

export const LAGOS_AREAS = [
  'Lekki', 'Victoria Island', 'Ikoyi', 'Ajah', 'Ikeja',
  'Yaba', 'Surulere', 'Gbagada', 'Magodo', 'Maryland',
  'Ogba', 'Agege', 'Badagry', 'Epe', 'Ikorodu',
]
