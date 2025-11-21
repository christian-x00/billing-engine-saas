import Link from 'next/link'
import { ArrowRight, Zap, Activity, Globe, Terminal, CheckCircle2 } from 'lucide-react'

export default function Hero() {
  return (
    <header className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
        
        {/* --- 1. BACKGROUND EFFECTS --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
            <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse delay-1000"></div>
            <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-blue-100/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          
          {/* --- 2. TEXT CONTENT --- */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-white text-xs font-bold uppercase tracking-wider mb-8 shadow-xl hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v2.0 Systems Operational
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            The Financial OS for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Metered Products.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Turn API calls into revenue. A complete, serverless infrastructure to ingest events, calculate usage, and invoice customers automatically.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
            <Link href="/login" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-indigo-600 shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
              Start Integration <ArrowRight size={20}/>
            </Link>
            <a href="#pricing" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all">
              View Pricing
            </a>
          </div>

          {/* --- 3. THE LIVE PREVIEW (HTML/CSS REPLICA) --- */}
          <div className="relative max-w-6xl mx-auto perspective-1000">
            
            {/* Glow Behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur-2xl opacity-20"></div>

            {/* Main Dashboard Window */}
            <div className="relative rounded-2xl bg-[#0B1121] border border-slate-800 shadow-2xl overflow-hidden text-left">
                
                {/* Window Header */}
                <div className="h-12 bg-[#0f172a] border-b border-slate-800 flex items-center px-4 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"/>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"/>
                    </div>
                    <div className="px-3 py-1 bg-slate-800/50 rounded text-[10px] font-mono text-slate-400 flex items-center gap-2 border border-slate-700/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                        dashboard.billingengine.com
                    </div>
                    <div className="w-16"/>
                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-12 h-[500px]">
                    
                    {/* Sidebar */}
                    <div className="col-span-1 hidden md:flex flex-col items-center py-6 border-r border-slate-800 bg-[#0B1121]">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mb-8 shadow-lg shadow-indigo-500/20">B</div>
                        <div className="space-y-6 flex flex-col items-center w-full">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border-l-2 border-indigo-500"><Activity size={20}/></div>
                            <div className="w-10 h-10 rounded-lg hover:bg-slate-800 text-slate-500 flex items-center justify-center transition"><Globe size={20}/></div>
                            <div className="w-10 h-10 rounded-lg hover:bg-slate-800 text-slate-500 flex items-center justify-center transition"><Terminal size={20}/></div>
                        </div>
                    </div>

                    {/* Main Area */}
                    <div className="col-span-12 md:col-span-11 bg-[#0F172A] p-6 md:p-8 relative overflow-hidden">
                        
                        {/* Top Stats */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Monthly Revenue', val: '$12,450.00', trend: '+12%', color: 'text-white' },
                                { label: 'Active Tenants', val: '843', trend: '+5', color: 'text-slate-200' },
                                { label: 'API Requests', val: '14.2M', trend: '99.9% Success', color: 'text-slate-200' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl backdrop-blur-sm">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h3>
                                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* The Graph Area */}
                        <div className="h-64 w-full bg-slate-800/20 border border-slate-700/50 rounded-xl p-6 relative mb-8 overflow-hidden group">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-semibold text-slate-300">Real-time Event Volume</h4>
                                <span className="text-xs text-indigo-400 flex items-center gap-1"><Zap size={12}/> Live Stream</span>
                            </div>
                            {/* CSS Wave Chart */}
                            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-80">
                                <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,150 C150,100 300,180 450,120 S700,60 850,100 S1000,80 1000,80 V200 H0 Z" fill="url(#chartGradient)" />
                                    <path d="M0,150 C150,100 300,180 450,120 S700,60 850,100 S1000,80" fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </div>
                            {/* Hover Indicator Line (Fake) */}
                            <div className="absolute top-16 bottom-0 left-1/2 w-px bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
                            </div>
                        </div>

                        {/* Bottom Section: Code & Logs */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Simulated Terminal */}
                            <div className="bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden relative">
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">BASH</div>
                                <div className="text-emerald-400 mb-1">➜  ~ curl -X POST https://api.billingengine.com/events</div>
                                <div className="text-slate-500 mb-2">Sending batch (14 events)...</div>
                                <div className="text-slate-300">{"{"} "status": "recorded", "id": "evt_8f92..." {"}"}</div>
                                <div className="text-slate-300">{"{"} "status": "recorded", "id": "evt_8f93..." {"}"}</div>
                                <div className="animate-pulse text-indigo-400 mt-1">_</div>
                            </div>

                            {/* Simulated Log List */}
                            <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Activity</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Invoice #1024 Generated</span>
                                        <span className="text-slate-600">2m ago</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Tenant_04 Updated Plan</span>
                                        <span className="text-slate-600">15m ago</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"/> Threshold Alert (80%)</span>
                                        <span className="text-slate-600">1h ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Overlay Card (The "Sale") */}
                        <div className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-2xl shadow-indigo-500/20 border border-slate-100 animate-[bounce_4s_infinite]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle2 size={20}/></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Payment Received</p>
                                    <p className="text-lg font-bold text-slate-900">$499.00</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
          </div>
        </div>
    </header>
  )
}