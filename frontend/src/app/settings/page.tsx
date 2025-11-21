'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Lock, Bell, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) {
        setUser(user)
        setEmail(user.email || '')
        // Fetch profile data
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        if (profile) setFullName(profile.full_name || '')
      }
    }
    init()
  }, [])

  // 1. Update Profile Logic
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: '', text: '' })

    try {
      // Update Supabase Auth Email (if changed)
      if (email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: email })
        if (error) throw error
        setMsg({ type: 'success', text: 'Confirmation email sent to new address.' })
      }

      // Update Database Profile Name
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
      
      if (dbError) throw dbError

      setMsg({ type: 'success', text: 'Profile updated successfully.' })
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message })
    }
    setLoading(false)
  }

  // 2. Update Password Logic
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: password })
    if (error) setMsg({ type: 'error', text: error.message })
    else {
        setMsg({ type: 'success', text: 'Password updated successfully.' })
        setPassword('')
    }
    setLoading(false)
  }

  return (
    <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and security.</p>
            </div>

            {/* Notification Banner */}
            {msg.text && (
                <div className={`p-4 rounded-lg ${msg.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {msg.text}
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Public Profile</h2>
                </div>
                <form onSubmit={updateProfile} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button disabled={loading} className="bg-gray-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
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
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button disabled={loading || !password} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            {/* Notifications (Mock) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden opacity-75">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Notifications (Coming Soon)</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email me when invoice is ready</span>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-not-allowed"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                </div>
            </div>

             {/* Danger Zone */}
             <div className="border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden">
                <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4">
                    <h3 className="text-red-800 dark:text-red-400 font-bold flex items-center gap-2"><Trash2 size={18}/> Danger Zone</h3>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account and all data.</p>
                    </div>
                    <button onClick={() => alert("Please contact support to delete your account.")} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-bold border border-red-200 dark:border-red-900">
                        Delete Account
                    </button>
                </div>
            </div>

        </div>
    </DashboardLayout>
  )
}