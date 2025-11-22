'use client'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Lock, Upload, Camera, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
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
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()
        if (profile) {
          setFullName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || '')
        }
      }
    }
    init()
  }, [])

  // 1. Update Profile (Name + Avatar)
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

      // Update Database Profile
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id)
      
      if (dbError) throw dbError

      setMsg({ type: 'success', text: 'Profile updated successfully.' })
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message })
    }
    setLoading(false)
  }

  // 2. Upload Avatar
  
const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
    setUploading(true)

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = event.target.files[0]
    
    // Validate file size (2MB)
    if (file.size > 2097152) {
      throw new Error('File size must be less than 2MB')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `avatar-${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    console.log('Uploading to path:', filePath) // Debug log

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError) // Debug log
      throw uploadError
    }

    console.log('Upload successful:', uploadData) // Debug log

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    setAvatarUrl(data.publicUrl)
    toast.success('Avatar uploaded! Click "Save Changes" to confirm.')
    
  } catch (error: any) {
    console.error('Full error:', error) // Debug log
    toast.error(error.message || 'Upload failed')
  } finally {
    setUploading(false)
  }
}

  // 3. Update Password
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
                <div className={`p-4 rounded-xl flex items-center gap-3 ${msg.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900'}`}>
                    {msg.type === 'success' && <CheckCircle2 size={20}/>}
                    {msg.text}
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
                    <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Public Profile</h2>
                </div>
                <form onSubmit={updateProfile} className="p-6 space-y-6">
                    
                    {/* Avatar Upload */}
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
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button disabled={loading} className="bg-gray-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-bold transition-all shadow-lg">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Section */}
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
                        <button disabled={loading || !password} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50 text-sm font-bold transition-colors shadow-lg">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </DashboardLayout>
  )
}