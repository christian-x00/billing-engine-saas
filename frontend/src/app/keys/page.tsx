'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, Trash2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([])
  const [newKey, setNewKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tenantId, setTenantId] = useState('')
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
        if (data) {
            setTenantId(data.tenant_id)
            fetchKeys(data.tenant_id)
        }
      }
    }
    init()
  }, [])

  const fetchKeys = async (tId: string) => {
      const { data } = await supabase.from('api_keys').select('*').eq('tenant_id', tId).order('created_at', { ascending: false })
      setKeys(data || [])
  }

  const generateKey = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
      const res = await fetch(`${backendUrl}/api/keys`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantId }) })
      const data = await res.json()
      if (data.apiKey) {
        setNewKey(data.apiKey)
        fetchKeys(tenantId)
        toast.success('Key generated')
      }
    } catch (err) { toast.error('Failed to generate key') }
    setLoading(false)
  }

  const revokeKey = async (id: string) => {
    if(!confirm("Revoke this key?")) return;
    await supabase.from('api_keys').delete().eq('id', id)
    fetchKeys(tenantId)
    toast.success('Key revoked')
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
                <p className="text-slate-500">Manage secret keys for your backend integration.</p>
            </div>
            <button onClick={generateKey} disabled={loading || !tenantId} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium shadow-sm">
                {loading ? 'Generating...' : <><Plus size={18}/> Generate Secret Key</>}
            </button>
        </div>

        {newKey && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-green-800 font-bold mb-1">New Key Generated</h3>
            <p className="text-sm text-green-700 mb-4">Copy this key now. It will not be shown again.</p>
            <div className="flex items-center gap-2">
            <code className="flex-1 bg-white p-3 rounded-lg border border-green-300 font-mono text-lg text-slate-800 break-all">{newKey}</code>
            <button onClick={() => {navigator.clipboard.writeText(newKey); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="bg-green-200 hover:bg-green-300 text-green-900 px-4 py-3 rounded-lg font-bold transition-colors">
                {copied ? <Check size={20}/> : <Copy size={20}/>}
            </button>
            </div>
            <button onClick={() => setNewKey(null)} className="mt-4 text-sm text-green-700 underline hover:no-underline">I have saved it</button>
        </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Key Prefix</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keys.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400">No API keys found.</td></tr>
              ) : keys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{key.prefix}...</span></td>
                  <td className="px-6 py-4 text-slate-500">{new Date(key.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => revokeKey(key.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Revoke"><Trash2 size={18} /></button>
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