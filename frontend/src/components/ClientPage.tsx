'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { Activity, CreditCard, TrendingUp, Users, ArrowUpRight, Copy, Check, Terminal, Code } from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Imports for Landing Page
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import Contact from '@/components/landing/Contact'
import Footer from '@/components/landing/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}

// --- DASHBOARD COMPONENT (Dark Mode) ---
function DashboardComponent() {
    const [tenantId, setTenantId] = useState<string>('Loading...')
    const [copied, setCopied] = useState(false)
    const [kpi, setKpi] = useState({ events: 0, revenue: 0, customers: 0 })
    const [recentInvoices, setRecentInvoices] = useState<any[]>([])
    const [chartData, setChartData] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if(user) {
                const { data } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
                if(data) {
                    setTenantId(data.tenant_id)
                    await fetchStats(data.tenant_id)
                }
            }
        }
        init()
    }, [])

    const fetchStats = async (tId: string) => {
        const { data: usage } = await supabase.from('usage_aggregates').select('usage_count, date')
        const { data: inv } = await supabase.from('invoices').select('*').eq('tenant_id', tId).order('created_at', {ascending:false})
        const { count: custCount } = await supabase.from('customers').select('*', { count: 'exact', head: true }).eq('tenant_id', tId)

        const totalEvents = usage?.reduce((a, b) => a + b.usage_count, 0) || 0
        const revenue = (inv?.filter(i => i.status === 'open').reduce((a,b)=>a+b.total_amount_cents, 0)||0)/100
        
        setKpi({ events: totalEvents, revenue, customers: custCount || 0 })
        setRecentInvoices(inv?.slice(0,5) || [])

        const rawChart = usage || []
        if (rawChart.length === 0) {
            setChartData([{ date: 'Mon', events: 0 }, { date: 'Tue', events: 0 }, { date: 'Wed', events: 0 }, { date: 'Thu', events: 0 }, { date: 'Fri', events: 0 }])
        } else {
            setChartData(rawChart.map(r => ({ date: new Date(r.date).toLocaleDateString(undefined, {weekday:'short'}), events: r.usage_count })))
        }
    }

    const Snippet = `curl -X POST ${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/events \\
  -H "x-api-key: sk_live_..." \\
  -d '{"event": "api_call", "customer_id": "cust_123"}'`

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Executive Overview</h1>
                        <p className="text-slate-400">Real-time performance metrics.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenant ID</span>
                        <code className="text-sm font-mono text-indigo-400">{tenantId.substring(0, 13)}...</code>
                        <button onClick={() => {navigator.clipboard.writeText(tenantId); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="text-slate-400 hover:text-indigo-400 transition-colors">
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KpiCard title="Total Usage" value={kpi.events.toLocaleString()} icon={Activity} trend="+12%" color="blue" />
                    <KpiCard title="Monthly Revenue" value={`$${kpi.revenue.toFixed(2)}`} icon={CreditCard} trend="+8.2%" color="indigo" />
                    <KpiCard title="Active Customers" value={kpi.customers.toString()} icon={Users} trend="+2" color="orange" />
                    <KpiCard title="System Health" value="99.9%" icon={TrendingUp} trend="Stable" color="green" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-white">Usage Trends</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                                    <Area type="monotone" dataKey="events" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-indigo-400">
                                <Terminal size={20} />
                                <span className="font-mono text-sm font-bold">Quick Start</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">Start tracking events immediately.</p>
                            <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre border border-white/10 scrollbar-hide">
                                {Snippet}
                            </div>
                        </div>
                        <Link href="/keys" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-bold text-center transition-colors flex items-center justify-center gap-2">
                            <Code size={16} /> Get API Keys
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-white">Recent Transactions</h3>
                        <Link href="/invoices" className="flex items-center gap-1 text-sm text-indigo-400 font-medium hover:underline">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-slate-400 bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Invoice ID</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {recentInvoices.length === 0 ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">No data available</td></tr>
                                ) : recentInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{inv.id.slice(0,8)}</td>
                                        <td className="px-6 py-4 text-white">{new Date(inv.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-bold text-white">${(inv.total_amount_cents/100).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                inv.status === 'paid' 
                                                ? 'bg-green-900/30 text-green-400 border-green-900' 
                                                : 'bg-yellow-900/30 text-yellow-400 border-yellow-900'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}

function KpiCard({ title, value, icon: Icon, trend, color }: any) {
    const colors: any = {
        blue: 'bg-blue-900/20 text-blue-400',
        indigo: 'bg-indigo-900/20 text-indigo-400',
        orange: 'bg-orange-900/20 text-orange-400',
        green: 'bg-green-900/20 text-green-400',
    }
    return (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}><Icon size={24} /></div>
                {trend && <span className="text-xs font-medium bg-green-900/30 text-green-400 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <div>
                <p className="text-sm text-slate-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    )
}

export default function ClientPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setIsAuthenticated(!!user)
        }
        checkAuth()
    }, [])

    if (isAuthenticated === null) return null
    return isAuthenticated ? <DashboardComponent /> : <LandingPage />
}