'use client'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Trash2, Copy, Check } from 'lucide-react'

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([])
  const [newKey, setNewKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tenantId, setTenantId] = useState('')
  const [user, setUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)
      fetchData(user.id)
    }
    init()
  }, [router])

  const fetchData = async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', userId).single()
    
    if (profile) {
      setTenantId(profile.tenant_id)
      const { data: apiKeys } = await supabase
        .from('api_keys')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('created_at', { ascending: false })
      setKeys(apiKeys || [])
    }
  }

  const generateKey = async () => {
    if (!tenantId) return
    setLoading(true)
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      
      const res = await fetch(`${backendUrl}/api/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId })
      })
      
      if (!res.ok) throw new Error('Failed to generate key')

      const data = await res.json()
      
      if (data.apiKey) {
        setNewKey(data.apiKey)
        fetchData(user.id)
        toast.success('API Key Generated Successfully!') // <--- ADD THIS
      }
    } catch (err) {
      toast.error('Failed to connect to backend. Please try again.') // <--- ADD THIS
      console.error(err)
    }
    setLoading(false)
  }

const revokeKey = async (id: string) => {
    if(!confirm("Are you sure? This will break any apps using this key immediately.")) return;
    
    const { error } = await supabase.from('api_keys').delete().eq('id', id)
    if (error) {
      toast.error('Error revoking key') // <--- ADD THIS
    } else {
      toast.success('API Key revoked') // <--- ADD THIS
      fetchData(user.id)
    }
  }
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage secret keys for your backend integration.</p>
            </div>
            <button 
                onClick={generateKey} 
                disabled={loading || !tenantId}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors text-sm font-medium shadow-lg shadow-indigo-200 dark:shadow-none"
            >
                {loading ? 'Generating...' : <><Plus size={18}/> Generate Secret Key</>}
            </button>
        </div>

        {/* New Key Modal */}
        {newKey && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-green-800 dark:text-green-400 font-bold mb-1">New Key Generated</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-4">Copy this key now. You will not be able to see it again.</p>
            <div className="flex items-center gap-2">
            <code className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-lg border border-green-300 dark:border-green-800 font-mono text-lg text-gray-800 dark:text-gray-200 break-all">
                {newKey}
            </code>
            <button 
                onClick={() => {navigator.clipboard.writeText(newKey); setCopied(true); setTimeout(()=>setCopied(false), 2000)}}
                className="bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700 text-green-900 dark:text-white px-4 py-3 rounded-lg font-bold transition-colors"
            >
                {copied ? <Check size={20}/> : <Copy size={20}/>}
            </button>
            </div>
            <button onClick={() => setNewKey(null)} className="mt-4 text-sm text-green-700 dark:text-green-400 underline hover:no-underline">I have saved it</button>
        </div>
        )}

        {/* Keys Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 font-medium">Key Prefix</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {keys.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">No API keys found. Create one to get started.</td></tr>
              ) : keys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {key.prefix}...
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => revokeKey(key.id)} 
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Revoke Key"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}