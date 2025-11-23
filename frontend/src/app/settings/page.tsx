'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Lock, Camera, Bell, CreditCard, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // State for Plan Info
  const [planName, setPlanName] = useState('Free')
  const [planStatus, setPlanStatus] = useState('inactive')

  const [notifyInvoices, setNotifyInvoices] = useState(true)
  const [notifySecurity, setNotifySecurity] = useState(true)

  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) {
        setUser(user)
        setEmail(user.email || '')
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, tenant_id')
            .eq('id', user.id)
            .single()
            
        if (profile) {
          setFullName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || '')
          
          // FETCH REAL PLAN DETAILS
          const { data: tenant } = await supabase
            .from('tenants')
            .select('subscription_status, subscription_plan')
            .eq('id', profile.tenant_id)
            .single()
            
          if (tenant) {
              setPlanStatus(tenant.subscription_status || 'inactive')
              setPlanName(tenant.subscription_plan || 'Free')
          }

          if (searchParams.get('success') === 'true') verifyPayment(profile.tenant_id)
        }
      }
    }
    init()
  }, [searchParams])

  const verifyPayment = async (tId: string) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      try {
          await fetch(`${backendUrl}/api/payments/check-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tenantId: tId })
          })
          toast.success('Subscription Activated!')
          window.location.href = '/settings' // Reload to refresh plan
      } catch(e) {
          console.error(e)
      }
  }

  // ... (Keep updateProfile and uploadAvatar the same as before) ...
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: email })
        if (error) throw error
        toast.success('Confirmation email sent.')
      }
      const { error: dbError } = await supabase.from('profiles').update({ full_name: fullName, avatar_url: avatarUrl }).eq('id', user.id)
      if (dbError) throw dbError
      toast.success('Profile updated.')
      window.dispatchEvent(new Event('profile-updated'))
    } catch (error: any) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files?.length) throw new Error('Select an image.')
      const file = event.target.files[0]
      if (file.size > 2097152) throw new Error('Max 2MB.')
      
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success('Avatar uploaded! Save changes.')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: password })
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated successfully.')
      setPassword('')
    }
    setLoading(false)
  }

  // UPDATED UPGRADE HANDLER
  const handleUpgrade = async (plan: string, cost: number) => {
    setLoading(true)
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
        const { data: profile } = await supabase.from('profiles').select('tenant_id, email').eq('id', user.id).single()
        if (!profile) throw new Error('Profile not found')
        
        const res = await fetch(`${backendUrl}/api/payments/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenantId: profile.tenant_id,
                email: profile.email,
                amount: cost,
                planName: plan
            })
        })
        const data = await res.json()
        if(data.url) window.location.href = data.url
    } catch(err: any) {
        toast.error('Payment failed: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account, billing, and preferences.</p>
            </div>

            {/* PROFILE SECTION */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Public Profile</h2>
                </div>
                <form onSubmit={updateProfile} className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg">
                                <Camera size={16} className="text-white"/>
                                <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
                            </label>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{fullName || 'Your Name'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button disabled={loading} type="submit" className="bg-gray-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-bold">Save Changes</button>
                    </div>
                </form>
            </div>

            {/* SUBSCRIPTION PLAN */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Subscription Plan</h2>
                </div>
                <div className="p-6 space-y-6">
                    
                    {/* Current Status */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-900/50">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white capitalize">Current Plan: {planName}</p>
                            <p className="text-xs text-gray-500">{planStatus === 'active' ? 'Your billing is active.' : 'You are on the free tier.'}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${planStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                            {planStatus}
                        </span>
                    </div>
                    
                    {/* Pricing Grid ($100 vs $300) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Standard Plan */}
                        <button 
                            onClick={() => handleUpgrade('Standard', 100)}
                            disabled={loading}
                            className={`p-5 border rounded-xl text-left group relative overflow-hidden transition-all ${planName === 'Standard' && planStatus === 'active' ? 'border-green-500 bg-green-50/10' : 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'}`}
                        >
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                            <p className="font-bold text-indigo-600 mb-1">Standard Plan</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">$100</p>
                                <span className="text-xs text-gray-500">/mo</span>
                            </div>
                            <ul className="mt-3 space-y-1">
                                <li className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> 1M Events</li>
                                <li className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> Priority Support</li>
                            </ul>
                        </button>
                        
                        {/* Enterprise Plan */}
                        <button 
                            onClick={() => handleUpgrade('Enterprise', 300)}
                            disabled={loading}
                            className={`p-5 border rounded-xl text-left transition-all ${planName === 'Enterprise' && planStatus === 'active' ? 'border-green-500 bg-green-50/10' : 'border-gray-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
                        >
                            <p className="font-bold text-slate-600 dark:text-slate-400 mb-1">Enterprise Plan</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">$300</p>
                                <span className="text-xs text-gray-500">/mo</span>
                            </div>
                            <ul className="mt-3 space-y-1">
                                <li className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> Unlimited Events</li>
                                <li className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> Dedicated Server</li>
                            </ul>
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD & SECURITY */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <Lock size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Password & Security</h2>
                </div>
                <form onSubmit={updatePassword} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button disabled={loading || !password} type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50 text-sm font-bold">Update Password</button>
                    </div>
                </form>
            </div>
        </div>
    </DashboardLayout>
  )
}