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
      fetchInvoices()
    }
    init()
  }, [router])

  const fetchInvoices = async () => {
    const { data } = await supabase
        .from('invoices')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false })
    setInvoices(data || [])
    setLoading(false)
  }

  const downloadPdf = async (path: string) => {
    const { data } = await supabase
      .storage
      .from('invoices')
      .createSignedUrl(path, 60)

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    } else {
      alert('Could not download file')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                <p className="text-gray-500 dark:text-gray-400">View and download your monthly usage bills.</p>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400 dark:text-gray-500">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center gap-2">
                      <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-full"><FileText size={24} className="text-gray-300 dark:text-gray-500"/></div>
                      No invoices generated yet.
                  </td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{inv.customers?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{inv.customers?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ${(inv.total_amount_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        inv.status === 'paid' 
                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' 
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.file_path && (
                      <button 
                        onClick={() => downloadPdf(inv.file_path)}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm hover:underline"
                      >
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