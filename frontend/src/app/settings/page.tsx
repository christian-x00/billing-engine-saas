'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  User, Lock, Camera, CheckCircle2, Bell, CreditCard, Users, Webhook, Plus, Trash2 
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
  
  // --- NEW STATES ---
  const [notifyInvoices, setNotifyInvoices] = useState(true)
  const [notifyMarketing, setNotifyMarketing] = useState(false)
  const [notifySecurity, setNotifySecurity] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState('https://api.yoursite.com/webhooks')
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, email: 'admin@company.com', role: 'Owner' },
    { id: 2, email: 'dev@company.com', role: 'Developer' }
  ])

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) {
        setUser(user)
        setEmail(user.email || '')
        
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()
        if (profile) {
          setFullName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || '')
        }
      }
    }
    init()
  }, [])

  // --- ACTIONS ---

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
      if (!event.target.files || event.target.files.length === 0) throw new Error('Select an image.')
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
        toast.success('Password updated.')
        setPassword('')
    }
    setLoading(false)
  }

  // Simulated Actions
  const saveNotifications = () => toast.success('Notification preferences saved.')
  const saveWebhook = () => toast.success('Webhook URL updated.')
  const addTeamMember = () => toast.info('Invite feature coming soon.')
  const removeMember = (id: number) => {
      setTeamMembers(teamMembers.filter(m => m.id !== id))
      toast.success('Member removed.')
  }

  return (
    <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your workspace, team, and preferences.</p>
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

            {/* 2. NOTIFICATIONS */}
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
                    <div className="flex justify-end pt-2">
                        <button onClick={saveNotifications} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">Save Preferences</button>
                    </div>
                </div>
            </div>

            {/* 3. BILLING & PAYMENT */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-xl mb-4 bg-gray-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                            <div>
                                <p className="font-mono text-sm text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                                <p className="text-xs text-gray-500">Expires 12/25</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Default</span>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 hover:underline">
                        <Plus size={16}/> Add New Card
                    </button>
                </div>
            </div>

            {/* 4. TEAM MEMBERS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                        <h2 className="font-semibold text-gray-900 dark:text-white">Team Members</h2>
                    </div>
                    <button onClick={addTeamMember} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:opacity-80"><Plus size={18}/></button>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {member.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{member.email}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                                {member.role !== 'Owner' && (
                                    <button onClick={() => removeMember(member.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded"><Trash2 size={16}/></button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. WEBHOOKS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <Webhook size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Webhooks</h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">We will send a POST request to this URL when an invoice is generated.</p>
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            value={webhookUrl} 
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                        />
                        <button onClick={saveWebhook} className="bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Save</button>
                    </div>
                </div>
            </div>

            {/* 6. PASSWORD */}
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