import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Simple, transparent pricing</h2>
                <p className="text-lg text-slate-500">Start for free. Scale as you grow. 14-day trial on all paid plans.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                
                {/* FREE */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Developer</h3>
                    <div className="mb-6"><span className="text-4xl font-extrabold">$0</span><span className="text-slate-500">/mo</span></div>
                    <p className="text-sm text-slate-500 mb-6">Perfect for side projects.</p>
                    <Link href="/login" className="block w-full py-3 bg-slate-50 text-slate-900 font-bold text-center rounded-xl hover:bg-slate-100 transition-colors">Get Started</Link>
                    <ul className="mt-8 space-y-4 text-sm text-slate-600">
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> 10k Events / mo</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> 1 Team Member</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> Community Support</li>
                    </ul>
                </div>

                {/* STANDARD ($100) */}
                <div className="bg-slate-900 rounded-2xl p-8 border border-indigo-500 shadow-2xl relative transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                    <h3 className="text-lg font-bold text-white mb-2">Standard</h3>
                    <div className="mb-6 text-white"><span className="text-4xl font-extrabold">$100</span><span className="text-slate-400">/mo</span></div>
                    <p className="text-sm text-slate-400 mb-6">For growing companies.</p>
                    {/* DEEP LINK TO STANDARD */}
                    <Link href="/login?plan=Standard" className="block w-full py-3 bg-indigo-600 text-white font-bold text-center rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25">Start 14-Day Trial</Link>
                    <ul className="mt-8 space-y-4 text-sm text-slate-300">
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-400"/> 1M Events / mo</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-400"/> Unlimited Members</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-400"/> PDF Invoicing</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-400"/> Priority Support</li>
                    </ul>
                </div>

                {/* ENTERPRISE ($300) */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise</h3>
                    <div className="mb-6"><span className="text-4xl font-extrabold">$300</span><span className="text-slate-500">/mo</span></div>
                    <p className="text-sm text-slate-500 mb-6">For high-volume scale.</p>
                    {/* DEEP LINK TO ENTERPRISE */}
                    <Link href="/login?plan=Enterprise" className="block w-full py-3 bg-white border-2 border-slate-100 text-slate-900 font-bold text-center rounded-xl hover:border-slate-300 transition-colors">Start 14-Day Trial</Link>
                    <ul className="mt-8 space-y-4 text-sm text-slate-600">
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> Unlimited Events</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> SSO & SAML</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> Dedicated Infrastructure</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> SLA Guarantee</li>
                    </ul>
                </div>

            </div>
        </div>
    </section>
  )
}