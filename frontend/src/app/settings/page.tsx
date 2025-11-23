'use client'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Lock, Camera, CreditCard, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'

function SettingsContent() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [planName, setPlanName] = useState('Free')
  const [planStatus, setPlanStatus] = useState('inactive')

  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) {
        setUser(user)
        setEmail(user.email || '')
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, tenant_id').eq('id', user.id).single()
        if (profile) {
          setFullName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || '')
          const { data: tenant } = await supabase.from('tenants').select('subscription_status, subscription_plan').eq('id', profile.tenant_id).single()
          if (tenant) {
              setPlanName(tenant.subscription_plan || 'Free')
              setPlanStatus(tenant.subscription_status || 'inactive')
          }
          if (searchParams.get('success') === 'true') verifyPayment(profile.tenant_id, searchParams.get('plan') || 'Standard')
        }
      }
    }
    init()
  }, [searchParams])

  const verifyPayment = async (tId: string, plan: string) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      await fetch(`${backendUrl}/api/payments/check-status`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantId: tId, planName: plan })
      })
      toast.success('Subscription Activated!')
      router.replace('/settings')
      setTimeout(() => window.location.reload(), 1000)
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (email !== user.email) await supabase.auth.updateUser({ email: email })
      await supabase.from('profiles').update({ full_name: fullName, avatar_url: avatarUrl }).eq('id', user.id)
      toast.success('Profile updated.')
      window.dispatchEvent(new Event('profile-updated'))
    } catch (e:any) { toast.error(e.message) }
    setLoading(false)
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files?.length) return
      const file = e.target.files[0]
      const path = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`
      await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
      toast.success('Image uploaded. Save to apply.')
    } catch (e:any) { toast.error('Upload failed') }
    setUploading(false)
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) toast.error(error.message)
    else { toast.success('Password updated'); setPassword('') }
  }

  const handleUpgrade = async (plan: string, amount: number) => {
    setLoading(true)
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
        const { data: profile } = await supabase.from('profiles').select('tenant_id, email').eq('id', user.id).single()
        if(!profile) throw new Error('Profile missing')
        const res = await fetch(`${backendUrl}/api/payments/subscribe`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenantId: profile.tenant_id, email: profile.email, amount: amount, planName: plan })
        })
        const data = await res.json()
        if(data.url) window.location.href = data.url
    } catch(e:any) { toast.error('Payment failed') }
    setLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>

            {/* PROFILE */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="font-bold mb-6 flex gap-2 text-slate-900"><User/> Public Profile</h2>
                <form onSubmit={updateProfile} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl overflow-hidden">
                            {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover"/> : fullName[0]}
                        </div>
                        <label className="bg-white border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100 text-slate-700 font-medium transition-colors">
                            <input type="file" hidden onChange={uploadAvatar} disabled={uploading}/>
                            {uploading ? 'Uploading...' : 'Change Photo'}
                        </label>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input value={fullName} onChange={e=>setFullName(e.target.value)} className="p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Full Name"/>
                        <input value={email} onChange={e=>setEmail(e.target.value)} className="p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email"/>
                    </div>
                    <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Save Profile</button>
                </form>
            </div>

            {/* SUBSCRIPTION */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="font-bold mb-6 flex gap-2 text-slate-900"><CreditCard/> Subscription</h2>
                
                <div className="flex justify-between items-center bg-white p-4 rounded-xl mb-6 border border-slate-200">
                    <div>
                        <p className="font-bold text-lg text-slate-900">{planName} Plan</p>
                        <p className="text-sm text-slate-500">{planStatus === 'active' ? 'Billing Active.' : 'Upgrade to unlock features.'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${planStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{planStatus}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* STANDARD */}
                    <div className={`p-5 border rounded-xl bg-white ${planName === 'Standard' ? 'border-green-500 bg-green-50/10' : 'border-slate-200'}`}>
                        <div className="flex justify-between mb-2"><span className="font-bold text-indigo-600">Standard</span><span className="font-bold text-xl">$100/mo</span></div>
                        <ul className="text-sm text-slate-500 space-y-1 mb-4">
                            <li className="flex gap-2"><CheckCircle2 size={14}/> 1M Events</li>
                            <li className="flex gap-2"><CheckCircle2 size={14}/> Email Support</li>
                        </ul>
                        <button onClick={()=>handleUpgrade('Standard', 100)} disabled={planName==='Standard'} className="w-full py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors">
                            {planName==='Standard' ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>

                    {/* ENTERPRISE */}
                    <div className={`p-5 border rounded-xl bg-white ${planName === 'Enterprise' ? 'border-green-500 bg-green-50/10' : 'border-slate-200'}`}>
                        <div className="flex justify-between mb-2"><span className="font-bold text-slate-600">Enterprise</span><span className="font-bold text-xl">$300/mo</span></div>
                        <ul className="text-sm text-slate-500 space-y-1 mb-4">
                            <li className="flex gap-2"><CheckCircle2 size={14}/> Unlimited Events</li>
                            <li className="flex gap-2"><CheckCircle2 size={14}/> Dedicated Server</li>
                        </ul>
                        <button onClick={()=>handleUpgrade('Enterprise', 300)} disabled={planName==='Enterprise'} className="w-full py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors">
                            {planName==='Enterprise' ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="font-bold mb-6 flex gap-2 text-slate-900"><Lock/> Security</h2>
                <form onSubmit={updatePassword} className="flex gap-4">
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New Password" className="flex-1 p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    <button disabled={!password} className="bg-indigo-600 text-white px-6 rounded-lg font-bold hover:bg-indigo-700 transition-colors">Update</button>
                </form>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default function Settings() {
  return <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading settings...</div>}><SettingsContent/></Suspense>
}