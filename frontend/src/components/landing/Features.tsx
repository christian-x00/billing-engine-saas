import { Zap, BarChart3, Shield, Globe, Code } from 'lucide-react'

export default function Features() {
  return (
    <>
      {/* Logos */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by fast-growing startups</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Globe className="text-indigo-600"/> GlobalSync</div>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Zap className="text-yellow-500"/> FastLayer</div>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Shield className="text-green-600"/> SecureNet</div>
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Code className="text-purple-600"/> DevFlow</div>
            </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Built for the API Economy</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">We handle the complex logic of counting, aggregating, and billing events so you don't have to.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Zap, title: "Real-time Ingestion", desc: "Send millions of events to our Express-powered edge API. We handle the scale.", color: "bg-yellow-100 text-yellow-600" },
                    { icon: BarChart3, title: "Auto Aggregation", desc: "Our engine automatically sums usage daily. No cron jobs for you to manage.", color: "bg-blue-100 text-blue-600" },
                    { icon: Shield, title: "Secure Tenants", desc: "Strict data isolation using Row Level Security means your customers data is safe.", color: "bg-green-100 text-green-600" },
                ].map((f, i) => (
                    <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform`}>
                            <f.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  )
}