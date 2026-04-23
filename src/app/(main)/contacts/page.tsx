'use client'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Shield, Phone, CheckCircle, ChevronDown, ChevronUp, Users } from 'lucide-react'

type Confirmation = { worker: string; verdict: 'positive' | 'neutral' | 'negative'; jobType: string; note?: string; date: string }
type Contact = { id: string; name: string; phone: string; city: string; onTrustWork: boolean; confirmations: Confirmation[] }

const VERDICT_EMOJI = { positive: '👍', neutral: '😐', negative: '👎' }

const ALL_CONTACTS: Contact[] = [
  { id: 'c1',  name: 'Chioma Eze',         phone: '08031245678', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Emeka Okonkwo', verdict: 'positive', jobType: 'Cooking / Chef',      note: 'Cooked for my naming ceremony — amazing.', date: '2024-11' }, { worker: 'Bola Adeyemi', verdict: 'positive', jobType: 'Plumbing', note: 'Fixed burst pipe at 9pm. Came within the hour.', date: '2024-10' }] },
  { id: 'c2',  name: 'Tunde Balogun',      phone: '08122334455', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Emeka Okonkwo', verdict: 'positive', jobType: 'Cooking / Chef',      note: 'Our family chef for months. Always on time.', date: '2024-09' }, { worker: 'Adaeze Nwosu', verdict: 'positive', jobType: 'Childcare / Nanny', note: 'Brilliant with the kids.', date: '2024-08' }] },
  { id: 'c3',  name: 'Amara Okonkwo',      phone: '09054321098', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Seun Fadahunsi', verdict: 'positive', jobType: 'Driving / Logistics', note: 'Punctual and honest.', date: '2024-12' }] },
  { id: 'c4',  name: 'Femi Adeyemi',       phone: '07012345678', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Chukwudi Eze',   verdict: 'positive', jobType: 'Electrical',          note: 'Rewired my kitchen. Clean job.', date: '2024-10' }] },
  { id: 'c5',  name: 'Kemi Fashola',       phone: '08099887766', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Adaeze Nwosu',   verdict: 'positive', jobType: 'Childcare / Nanny',  note: 'Best nanny we have had.', date: '2024-11' }, { worker: 'Yemi Fashola', verdict: 'neutral', jobType: 'Electrical', date: '2024-09' }] },
  { id: 'c6',  name: 'Biodun Olatunji',    phone: '08033556677', city: 'Lagos',  onTrustWork: false, confirmations: [] },
  { id: 'c7',  name: 'Ngozi Ibe',          phone: '08077665544', city: 'Abuja',  onTrustWork: true,  confirmations: [{ worker: 'Hauwa Suleiman',  verdict: 'positive', jobType: 'Tailoring / Fashion', note: 'Made my aso-ebi. Perfect fit.', date: '2024-10' }] },
  { id: 'c8',  name: 'Uche Nwosu',         phone: '08155443322', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Bola Adeyemi',   verdict: 'positive', jobType: 'Plumbing',           note: 'Good work on bathroom installation.', date: '2024-08' }] },
  { id: 'c9',  name: 'Sola Adeleke',       phone: '09087654321', city: 'Lagos',  onTrustWork: false, confirmations: [] },
  { id: 'c10', name: 'Yetunde Adebisi',    phone: '08011223344', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Funmi Adesanya',  verdict: 'positive', jobType: 'Driving / Logistics', note: 'Clean record. Available on weekends.', date: '2024-07' }] },
  { id: 'c11', name: 'Emeka Nzeogwu',      phone: '08044556677', city: 'Lagos',  onTrustWork: false, confirmations: [] },
  { id: 'c12', name: 'Bisi Akinwale',      phone: '08166778899', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Emeka Okonkwo', verdict: 'positive', jobType: 'Cooking / Chef', note: 'Hired for my husband\'s 50th. Everyone loved the food.', date: '2024-06' }] },
  { id: 'c13', name: 'Dayo Ogunsanya',     phone: '07087654321', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Biodun Olatunji', verdict: 'positive', jobType: 'Painting', note: 'Exterior of my house. Clean finish.', date: '2024-05' }] },
  { id: 'c14', name: 'Tokunbo Adeola',     phone: '08022334455', city: 'Lagos',  onTrustWork: false, confirmations: [] },
  { id: 'c15', name: 'Chidi Obi',          phone: '08133445566', city: 'Abuja',  onTrustWork: true,  confirmations: [{ worker: 'Ahmed Musa', verdict: 'positive', jobType: 'Carpentry / Joinery', note: 'Made my dining table. Excellent craftsmanship.', date: '2024-09' }] },
  { id: 'c16', name: 'Funke Coker',        phone: '09098765432', city: 'Lagos',  onTrustWork: false, confirmations: [] },
  { id: 'c17', name: 'Rotimi Adekunle',    phone: '08055667788', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Emeka Nwachukwu', verdict: 'positive', jobType: 'Security / Guard', note: 'Has been on our estate for 3 months. Very diligent.', date: '2024-10' }] },
  { id: 'c18', name: 'Adaora Chukwu',      phone: '08177889900', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Seun Fadahunsi', verdict: 'positive', jobType: 'Driving / Logistics', date: '2024-11' }] },
  { id: 'c19', name: 'Gbemi Olutayo',      phone: '07011223344', city: 'Lagos',  onTrustWork: false, confirmations: [] },
  { id: 'c20', name: 'Segun Abiodun',      phone: '08099001122', city: 'Lagos',  onTrustWork: true,  confirmations: [{ worker: 'Yemi Fashola', verdict: 'positive', jobType: 'Electrical', note: 'Fixed my AC. Quick and fair price.', date: '2024-08' }] },
]

function maskPhone(phone: string) {
  return phone.slice(0, 5) + '•••••' + phone.slice(-2)
}

function ContactRow({ contact }: { contact: Contact }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <Avatar src={null} name={contact.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
          <p className="text-xs text-gray-400 font-mono">{maskPhone(contact.phone)} · {contact.city}</p>
        </div>
        {contact.onTrustWork ? (
          <div className="flex items-center gap-2">
            {contact.confirmations.length > 0 && (
              <button onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                {contact.confirmations.length} job{contact.confirmations.length > 1 ? 's' : ''}
                {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle size={9} /> On TrustWork
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full border border-gray-100">Not yet</span>
        )}
      </div>
      {open && contact.confirmations.length > 0 && (
        <div className="border-t border-gray-50 px-3 pb-3 pt-2 space-y-2 bg-gray-50">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Jobs they confirmed</p>
          {contact.confirmations.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-base mt-0.5">{VERDICT_EMOJI[c.verdict]}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{c.worker} <span className="text-gray-400 font-normal">· {c.jobType}</span></p>
                {c.note && <p className="text-xs text-gray-500 mt-0.5 italic">&ldquo;{c.note}&rdquo;</p>}
                <p className="text-xs text-gray-400 mt-0.5">{c.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ContactsPage() {
  const [synced, setSynced] = useState(true) // default to synced so demo shows data
  const [loading, setLoading] = useState(false)
  const [pastedNumbers, setPastedNumbers] = useState('')

  const onTrustWork = ALL_CONTACTS.filter(c => c.onTrustWork)
  const notYet = ALL_CONTACTS.filter(c => !c.onTrustWork)
  const totalConfirmations = onTrustWork.reduce((s, c) => s + c.confirmations.length, 0)

  async function handleSync() {
    setLoading(true)
    setTimeout(() => { setLoading(false); setSynced(true) }, 1200)
  }

  if (!synced) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1">My Contacts</h1>
        <p className="text-sm text-gray-500 mb-5">Sync your contacts to unlock your trust network</p>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5 flex gap-3">
          <Shield className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-green-900">Your contacts&apos; privacy is protected</p>
            <p className="text-xs text-green-700 mt-0.5">Phone numbers are hashed in your browser. We never store raw numbers or names of non-users.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2"><Phone size={14} />Paste phone numbers</h2>
          <p className="text-xs text-gray-500 mb-3">One per line. Any Nigerian format (08012345678, +2348012345678)</p>
          <textarea value={pastedNumbers} onChange={e => setPastedNumbers(e.target.value)}
            placeholder={'08012345678\n08098765432\n+2348033445566'}
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>
        <button onClick={handleSync} disabled={loading}
          className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm disabled:opacity-60">
          {loading ? 'Syncing...' : 'Sync Contacts'}
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">My Contacts</h1>
      <p className="text-sm text-gray-500 mb-4">Your network has made {totalConfirmations} job confirmations</p>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-black text-green-600">{ALL_CONTACTS.length}</p>
          <p className="text-xs text-gray-500">contacts found</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-black text-blue-600">{onTrustWork.length}</p>
          <p className="text-xs text-gray-500">on TrustWork</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl font-black text-gray-800">{totalConfirmations}</p>
          <p className="text-xs text-gray-500">jobs confirmed</p>
        </div>
      </div>

      {/* On TrustWork */}
      <div className="flex items-center gap-2 mb-3">
        <Users size={14} className="text-green-600" />
        <h2 className="text-sm font-bold text-gray-900">On TrustWork <span className="text-gray-400 font-normal">({onTrustWork.length})</span></h2>
        <p className="text-xs text-gray-400 ml-auto">Tap to see who they confirmed</p>
      </div>
      <div className="space-y-2 mb-5">
        {onTrustWork.map(c => <ContactRow key={c.id} contact={c} />)}
      </div>

      {/* Not yet */}
      <div className="flex items-center gap-2 mb-3">
        <Phone size={14} className="text-gray-400" />
        <h2 className="text-sm font-bold text-gray-500">Not on TrustWork yet <span className="text-gray-400 font-normal">({notYet.length})</span></h2>
      </div>
      <div className="space-y-2 mb-6">
        {notYet.map(c => <ContactRow key={c.id} contact={c} />)}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-blue-800 font-semibold mb-1">Invite your contacts</p>
        <p className="text-xs text-blue-700">The more contacts join, the richer your trust network becomes. Their job confirmations automatically appear in your search results.</p>
      </div>
    </div>
  )
}
