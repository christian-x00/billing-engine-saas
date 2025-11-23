import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Globe, Zap, Shield, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-24">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-slate-900">
                We build the <span className="text-indigo-600">financial backbone</span> of the API economy.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
                BillingEngine was founded on a simple premise: Developers should build products, not billing infrastructure. We handle the complexity of metering so you can focus on innovation.
            </p>
        </div>

        {/* Stats */}
        <div className="bg-slate-900 py-20 text-white mb-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                <div>
                    <div className="text-4xl font-bold text-indigo-400 mb-2">1.2B+</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Events Processed</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-indigo-400 mb-2">99.99%</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Uptime SLA</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-indigo-400 mb-2">$500M</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Revenue Tracked</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-indigo-400 mb-2">24/7</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Global Support</div>
                </div>
            </div>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto px-6 prose prose-lg prose-slate">
            <h3>Our Story</h3>
            <p>
                In 2023, our founding team realized that SaaS pricing was shifting. Subscription models ($10/month) were dying, and usage-based models ($0.05/request) were exploding.
            </p>
            <p>
                However, the infrastructure required to count, aggregate, and bill for millions of events was incredibly complex. It required massive engineering teams and expensive servers.
            </p>
            <p>
                We built BillingEngine to solve this. By leveraging <strong>Serverless Edge Computing</strong> and <strong>PostgreSQL Row Level Security</strong>, we created a platform that scales infinitely without the overhead.
            </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}