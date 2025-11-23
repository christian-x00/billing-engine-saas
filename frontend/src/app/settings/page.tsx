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
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          setFullName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || '')
          
          // Get Real Plan Status
          const { data: tenant } = await supabase.from('tenants').select('*').eq('id', profile.tenant_id).single()
          if (tenant) {
              setPlanName(tenant.subscription_plan || 'Free')
              setPlanStatus(tenant.subscription_status || 'inactive')
          }

          // Handle Payment Return
          if (searchParams.get('success') === 'true') {
             verifyPayment(profile.tenant_id, searchParams.get('plan') || 'Standard')
          }
        }
      }
    }
    init()
  }, [searchParams])

  const verifyPayment = async (tId: string, plan: string) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      await fetch(`${backendUrl}/api/payments/check-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId: tId, planName: plan })
      })
      toast.success('Subscription Activated!')
      router.replace('/settings')
      // Force reload to update UI
      setTimeout(() => window.location.reload(), 1000)
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
        if(email !== user.email) await supabase.auth.updateUser({email})
        await supabase.from('profiles').update({ full_name: fullName, avatar_url: avatarUrl }).eq('id', user.id)
        toast.success('Profile updated')
        window.dispatchEvent(new Event('profile-updated'))
    } catch(e:any) { toast.error(e.message) }
    setLoading(false)
  }

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
        if(!e.target.files?.length) return
        setUploading(true)
        const file = e.target.files[0]
        const path = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`
        await supabase.storage.from('avatars').upload(path, file, {upsert:true})
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        setAvatarUrl(data.publicUrl)
        toast.success('Image uploaded. Save to apply.')
    } catch(e:any) { toast.error('Upload failed') }
    setUploading(false)
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if(error) toast.error(error.message)
    else { toast.success('Password changed'); setPassword('') }
  }

   const handleUpgrade = async (plan: string) => {
    setLoading(true)
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://billing-engine-kidh.onrender.com'
        
        const { data: profile } = await supabase.from('profiles').select('tenant_id, email').eq('id', user.id).single()
        
        // --- THIS IS THE FIX ---
        if (!profile) {
            throw new Error('Profile not found')
        }
        // -----------------------

        const res = await fetch(`${backendUrl}/api/payments/subscribe`, {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ 
                tenantId: profile.tenant_id, // Now safe
                email: profile.email, 
                planName: plan,
                amount: plan === 'Standard' ? 100 : 300 // Explicit amount
            })
        })
        const data = await res.json()
        if(data.url) window.location.href = data.url
        else throw new Error('Payment init failed')
    } catch(e: any) { 
        toast.error(e.message) 
    }
    setLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <h1 className="text-3xl font-bold dark:text-white">Account Settings</h1>

            {/* PROFILE */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">              
      <h2 className="font-bold mb-6 dark:text-white flex gap-2"><User/> Public Profile</h2>
                <form onSubmit={updateProfile} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl overflow-hidden">
                            {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover"/> : fullName[0]}
                        </div>
                        <label className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:text-white">
                            <input type="file" hidden onChange={uploadAvatar} disabled={uploading}/>
                            {uploading ? 'Uploading...' : 'Change Photo'}
                        </label>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input value={fullName} onChange={e=>setFullName(e.target.value)} className="p-3 border rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white" placeholder="Full Name"/>
                        <input value={email} onChange={e=>setEmail(e.target.value)} className="p-3 border rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white" placeholder="Email"/>
                    </div>
                    <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Save Profile</button>
                </form>
            </div>

            {/* SUBSCRIPTION */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <h2 className="font-bold mb-6 dark:text-white flex gap-2"><CreditCard/> Subscription</h2>
                
                <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-900 p-4 rounded-xl mb-6 border dark:border-slate-700">
                    <div>
                        <p className="font-bold dark:text-white text-lg">{planName} Plan</p>
                        <p className="text-sm text-gray-500">{planStatus === 'active' ? 'Next billing in 29 days.' : 'Upgrade to unlock features.'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${planStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{planStatus}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* STANDARD */}
                    <div className={`p-5 border rounded-xl ${planName === 'Standard' ? 'border-green-500 bg-green-50/10' : 'dark:border-slate-600'}`}>
                        <div className="flex justify-between mb-2"><span className="font-bold text-indigo-600">Standard</span><span className="font-bold text-xl dark:text-white">$100/mo</span></div>
                        <ul className="text-sm text-gray-500 space-y-1 mb-4">
                            <li className="flex gap-2"><CheckCircle2 size={14}/> 1M Events</li>
                            <li className="flex gap-2"><CheckCircle2 size={14}/> Email Support</li>
                        </ul>
                        <button onClick={()=>handleUpgrade('Standard')} disabled={planName==='Standard'} className="w-full py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700">
                            {planName==='Standard' ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>

                    {/* ENTERPRISE */}
                    <div className={`p-5 border rounded-xl ${planName === 'Enterprise' ? 'border-green-500 bg-green-50/10' : 'dark:border-slate-600'}`}>
                        <div className="flex justify-between mb-2"><span className="font-bold text-indigo-600">Enterprise</span><span className="font-bold text-xl dark:text-white">$300/mo</span></div>
                        <ul className="text-sm text-gray-500 space-y-1 mb-4">
                            <li className="flex gap-2"><CheckCircle2 size={14}/> Unlimited Events</li>
                            <li className="flex gap-2"><CheckCircle2 size={14}/> Dedicated Server</li>
                        </ul>
                        <button onClick={()=>handleUpgrade('Enterprise')} disabled={planName==='Enterprise'} className="w-full py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700">
                            {planName==='Enterprise' ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
                <h2 className="font-bold mb-6 dark:text-white flex gap-2"><Lock/> Security</h2>
                <form onSubmit={updatePassword} className="flex gap-4">
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New Password" className="flex-1 p-3 border rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white"/>
                    <button disabled={!password} className="bg-indigo-600 text-white px-6 rounded-lg font-bold hover:bg-indigo-700">Update</button>
                </form>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default function Settings() {
  return <Suspense fallback={<div>Loading...</div>}><SettingsContent/></Suspense>
}