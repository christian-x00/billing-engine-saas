'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Download, FileText } from 'lucide-react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data } = await supabase.from('invoices').select('*, customers(name, email)').order('created_at', { ascending: false })
      setInvoices(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const downloadPdf = async (path: string) => {
    const { data } = await supabase.storage.from('invoices').createSignedUrl(path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else alert('Could not download file')
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
                <p className="text-slate-500">View and download your monthly usage bills.</p>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                      <div className="p-3 bg-slate-100 rounded-full"><FileText size={24} className="text-slate-300"/></div>
                      No invoices generated yet.
                  </td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{inv.customers?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{inv.customers?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">${(inv.total_amount_cents / 100).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${inv.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.file_path && (
                      <button onClick={() => downloadPdf(inv.file_path)} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline">
                        <Download size={16}/> Download PDF
                      </button>
                    )}
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