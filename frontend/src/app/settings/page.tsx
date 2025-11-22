'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  User, Lock, Camera, Bell, CreditCard, CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [planStatus, setPlanStatus] = useState('free')

  // Toggles
  const [notifyInvoices, setNotifyInvoices] = useState(true)
  const [notifySecurity, setNotifySecurity] = useState(true)

  const supabase = createClient()

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
          
          const { data: tenant } = await supabase
            .from('tenants')
            .select('subscription_status')
            .eq('id', profile.tenant_id)
            .single()
            
          if (tenant) setPlanStatus(tenant.subscription_status || 'free')
        }
      }
    }
    init()
  }, [])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: email })
        if (error) throw error
        toast.success('Confirmation email sent to new address.')
      }
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id)
      
      if (dbError) throw dbError
      toast.success('Profile updated successfully.')
      window.dispatchEvent(new Event('profile-updated'))
    } catch (error: any) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = event.target.files[0]
      if (file.size > 2097152) {
        throw new Error('File size must be less than 2MB')
      }
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success('Avatar uploaded! Click "Save Changes" to confirm.')
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
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

  const handleUpgrade = async (planName: string, amount: number) => {
    setLoading(true)
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
        
        const { data: profile } = await supabase.from('profiles').select('tenant_id, email').eq('id', user.id).single()
        
        // FIX: Add null check
        if (!profile) {
            throw new Error('Profile not found')
        }
        
        const res = await fetch(`${backendUrl}/api/payments/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenantId: profile.tenant_id,
                email: profile.email, // No longer possibly null
                amount: amount,
                planName: planName
            })
        })
        
        if (!res.ok) throw new Error('Payment initialization failed')

        const data = await res.json()
        if(data.url) {
            window.location.href = data.url
        }
    } catch(err: any) {
        toast.error(err.message || 'Payment failed')
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

            {/* 1. PUBLIC PROFILE */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Public Profile</h2>
                </div>
                <form onSubmit={updateProfile} className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    fullName?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg">
                                <Camera size={16} className="text-white"/>
                                <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
                            </label>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{fullName || 'Your Name'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
                            {uploading && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Uploading...</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button disabled={loading} type="submit" className="bg-gray-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-bold transition-all shadow-lg">Save Changes</button>
                    </div>
                </form>
            </div>

            {/* 2. SUBSCRIPTION PLAN */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Subscription Plan</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-900/50">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white capitalize">Current Plan: {planStatus}</p>
                            <p className="text-xs text-gray-500">{planStatus === 'active' ? 'You are on a paid plan.' : 'Limited to 10k events.'}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${planStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                            {planStatus}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleUpgrade('Startup', 499)}
                            disabled={loading || planStatus === 'active'}
                            className={`p-5 border rounded-xl transition-all text-left group relative overflow-hidden ${planStatus === 'active' ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'}`}
                        >
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                            <p className="font-bold text-indigo-600 mb-1">Startup Plan</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">R499</p>
                                <span className="text-xs text-gray-500">/mo</span>
                            </div>
                            <ul className="mt-3 space-y-1">
                                <li className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> 1M Events</li>
                                <li className="text-xs text-gray-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> Priority Support</li>
                            </ul>
                        </button>
                        <button 
                            onClick={() => handleUpgrade('Enterprise', 1999)}
                            disabled={loading}
                            className="p-5 border border-gray-200 dark:border-slate-600 rounded-xl hover:border-slate-400 dark:hover:border-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all text-left"
                        >
                            <p className="font-bold text-slate-600 dark:text-slate-400 mb-1">Enterprise Plan</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">R1999</p>
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

            {/* 3. NOTIFICATIONS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Invoice Alerts</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails when a new invoice is generated.</p>
                        </div>
                        <button onClick={() => setNotifyInvoices(!notifyInvoices)} className={`w-12 h-6 rounded-full transition-colors relative ${notifyInvoices ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifyInvoices ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Security Alerts</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of new logins and password changes.</p>
                        </div>
                        <button onClick={() => setNotifySecurity(!notifySecurity)} className={`w-12 h-6 rounded-full transition-colors relative ${notifySecurity ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifySecurity ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. PASSWORD */}
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
                        <button disabled={loading || !password} type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50 text-sm font-bold transition-colors shadow-lg">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </DashboardLayout>
  )
}