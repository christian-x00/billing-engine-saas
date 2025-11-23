'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Activity, CreditCard, TrendingUp, Users, ArrowUpRight, Copy, Check, 
  Terminal, Code, Zap, Shield, BarChart3, ArrowRight, Send, MessageSquare,
  CheckCircle2, Globe, Menu, X
} from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// --- BRAND LOGO ---
const BrandLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shadow-sm rounded-lg">
    <rect width="32" height="32" rx="8" fill="url(#logo_gradient)" />
    <path d="M10 10H18C20.2091 10 22 11.7909 22 14C22 16.2091 20.2091 18 18 18H10V10Z" fill="white" fillOpacity="0.95"/>
    <path d="M10 18H19C21.2091 18 23 19.7909 23 22C23 24.2091 21.2091 26 19 26H10V18Z" fill="white" fillOpacity="0.7"/>
    <defs>
      <linearGradient id="logo_gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#9333EA" />
      </linearGradient>
    </defs>
  </svg>
)

// --- LANDING PAGE ---
function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    setTimeout(() => setFormState('sent'), 1500)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <BrandLogo />
                <span className="font-bold text-xl tracking-tight text-gray-900">BillingEngine</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Features</a>
                <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Pricing</a>
                <div className="h-4 w-px bg-gray-200"></div>
                <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-indigo-600">Sign In</Link>
                <Link href="/login" className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5">Get Started</Link>
            </div>

            <button className="md:hidden text-gray-600" onClick={()=>setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X/> : <Menu/>}
            </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-100 p-6 space-y-4 absolute w-full shadow-xl">
                <a href="#features" className="block text-lg font-medium text-gray-600" onClick={()=>setIsMenuOpen(false)}>Features</a>
                <a href="#pricing" className="block text-lg font-medium text-gray-600" onClick={()=>setIsMenuOpen(false)}>Pricing</a>
                <Link href="/login" className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-bold">Sign In</Link>
            </div>
        )}
      </nav>

      {/* HERO */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                v2.0 Systems Operational
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 leading-[1.1]">
                The Financial OS for <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Metered Products.</span>
            </h1>
            
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
                Turn API calls into revenue. A complete, serverless infrastructure to ingest events, calculate usage, and invoice customers automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
                <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                    Start Integration <ArrowRight size={20}/>
                </Link>
                <a href="#pricing" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">View Pricing</a>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="relative max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-700">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                <div className="relative rounded-2xl bg-[#0F172A] p-2 shadow-2xl ring-1 ring-white/10">
                    <div className="rounded-xl bg-[#0F172A] overflow-hidden relative aspect-[16/10] flex border border-slate-800/50">
                        <div className="w-64 border-r border-slate-800/50 bg-slate-900/50 p-6 hidden md:flex flex-col gap-6">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg mb-2"></div>
                            <div className="space-y-3">
                                <div className="h-8 w-full bg-slate-800/50 rounded-lg"></div>
                                <div className="h-8 w-3/4 bg-transparent rounded-lg border border-slate-800"></div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col relative p-8 space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="h-32 bg-slate-800/20 border border-slate-700/30 rounded-2xl"></div>
                                <div className="h-32 bg-slate-800/20 border border-slate-700/30 rounded-2xl"></div>
                                <div className="h-32 bg-slate-800/20 border border-slate-700/30 rounded-2xl"></div>
                            </div>
                            <div className="flex-1 bg-slate-800/20 border border-slate-700/30 rounded-2xl relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
                                <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none"><path d="M0 100 Q 250 50 500 100 T 1000 100" stroke="#6366F1" strokeWidth="4" fill="none"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* SOCIAL PROOF */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by fast-growing startups</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Globe size={24}/> GlobalSync</h3>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Zap size={24}/> FastLayer</h3>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Shield size={24}/> SecureNet</h3>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Code size={24}/> DevFlow</h3>
            </div>
        </div>
      </section>

      {/* PRICING (UPDATED $100 / $300) */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                <p className="text-gray-500 text-lg">Start for free. Scale as you grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* FREE */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Developer</h3>
                    <div className="mb-6"><span className="text-4xl font-extrabold">$0</span><span className="text-gray-500">/mo</span></div>
                    <Link href="/login" className="block w-full py-3 px-4 bg-indigo-50 text-indigo-700 font-bold text-center rounded-xl hover:bg-indigo-100 transition-colors">Get Started</Link>
                    <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> 10k Events / mo</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> 1 Team Member</li>
                    </ul>
                </div>

                {/* STANDARD ($100) */}
                <div className="border-2 border-indigo-600 rounded-2xl p-8 shadow-xl relative bg-white transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Standard</h3>
                    <div className="mb-6"><span className="text-4xl font-extrabold">$100</span><span className="text-gray-500">/mo</span></div>
                    <Link href="/login" className="block w-full py-3 px-4 bg-indigo-600 text-white font-bold text-center rounded-xl hover:bg-indigo-500 transition-colors shadow-lg">Start 14-Day Trial</Link>
                    <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> 1M Events / mo</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> Unlimited Members</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> PDF Invoicing</li>
                    </ul>
                </div>

                {/* ENTERPRISE ($300) */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="mb-6"><span className="text-4xl font-extrabold">$300</span><span className="text-gray-500">/mo</span></div>
                    <Link href="/login" className="block w-full py-3 px-4 bg-white border-2 border-gray-100 text-gray-700 font-bold text-center rounded-xl hover:border-gray-300 transition-colors">Contact Sales</Link>
                    <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> Unlimited Events</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> SSO & SAML</li>
                        <li className="flex items-center gap-3"><Check className="text-green-500" size={18}/> Dedicated Server</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Talk to an expert</h2>
                <p className="text-gray-500">Need help integrating? Our team reads every message.</p>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                {formState === 'sent' ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                        <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                        <button onClick={() => setFormState('idle')} className="mt-6 text-indigo-600 font-medium hover:underline">Send another</button>
                    </div>
                ) : (
                    <form onSubmit={handleContact} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" required className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="First Name" />
                            <input type="text" required className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Last Name" />
                        </div>
                        <input type="email" required className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="work@company.com" />
                        <textarea required rows={4} className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="How can we help?"></textarea>
                        <button disabled={formState === 'sending'} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                            {formState === 'sending' ? 'Sending...' : <><Send size={18}/> Send Message</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <BrandLogo />
                        <span className="font-bold text-xl text-gray-900">BillingEngine</span>
                    </div>
                    <p className="text-sm text-gray-500">The metered billing infrastructure for the next generation of SaaS.</p>
                </div>
                {['Product', 'Company', 'Legal'].map((head, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-gray-900 mb-4">{head}</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-indigo-600">Link 1</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Link 2</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Link 3</a></li>
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} BillingEngine Inc. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  )
}

// --- DASHBOARD COMPONENT ---
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Executive Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400">Real-time performance metrics.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tenant ID</span>
                        <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400">{tenantId.substring(0, 13)}...</code>
                        <button onClick={() => {navigator.clipboard.writeText(tenantId); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="text-gray-400 hover:text-indigo-600 transition-colors">
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
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white">Usage Trends</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.1} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                                    <Tooltip contentStyle={{backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                                    <Area type="monotone" dataKey="events" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-indigo-300">
                                <Terminal size={20} />
                                <span className="font-mono text-sm font-bold">Quick Start</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">Start tracking events immediately.</p>
                            <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto whitespace-pre border border-white/10">
                                {Snippet}
                            </div>
                        </div>
                        <Link href="/keys" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-bold text-center transition-colors flex items-center justify-center gap-2">
                            <Code size={16} /> Get API Keys
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

function KpiCard({ title, value, icon: Icon, trend, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    }
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}><Icon size={24} /></div>
                {trend && <span className="text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
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