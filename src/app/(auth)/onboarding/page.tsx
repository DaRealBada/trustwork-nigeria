'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { NIGERIAN_CITIES } from '@/lib/utils/constants'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  function handleRoleSelect() {
    setStep(2)
  }

  async function handleFinish(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/search')
    }, 800)
  }

  if (step === 1) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">How will you use TrustWork?</h2>
        <p className="text-sm text-gray-500 mb-6">You can always change this later</p>
        <div className="space-y-3">
          <button
            onClick={() => handleRoleSelect()}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-green-500 transition-colors group"
          >
            <div className="text-2xl mb-1">🏠</div>
            <div className="font-semibold text-gray-900 group-hover:text-green-700">I&apos;m looking to hire</div>
            <div className="text-sm text-gray-500">Find trusted workers for my home or business</div>
          </button>
          <button
            onClick={() => handleRoleSelect()}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-green-500 transition-colors group"
          >
            <div className="text-2xl mb-1">💼</div>
            <div className="font-semibold text-gray-900 group-hover:text-green-700">I offer services</div>
            <div className="text-sm text-gray-500">Get discovered by employers through trusted referrals</div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Almost there!</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us a bit about yourself</p>
      <form onSubmit={handleFinish} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Amaka Okafor"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select your city</option>
            {NIGERIAN_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Get Started
        </Button>
      </form>
    </div>
  )
}
