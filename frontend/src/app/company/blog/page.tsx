import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const posts = [
    { title: "The Death of Flat-Rate Pricing", excerpt: "Why 80% of SaaS companies are moving to hybrid usage models in 2025.", date: "Oct 12, 2024", tag: "Strategy", read: "5 min" },
    { title: "Scaling Express.js to 10k RPS", excerpt: "A deep dive into how we optimized our ingestion endpoint for massive throughput.", date: "Sep 28, 2024", tag: "Engineering", read: "8 min" },
    { title: "Series A Funding Announcement", excerpt: "We are thrilled to announce $15M in funding led by Sequoia Capital.", date: "Aug 15, 2024", tag: "Company", read: "3 min" },
    { title: "Handling Idempotency in Distributed Systems", excerpt: "Ensuring every API call is counted exactly once, no matter what.", date: "Jul 02, 2024", tag: "Engineering", read: "6 min" },
    { title: "The Ultimate Guide to Metered Billing", excerpt: "Everything you need to know about implementing consumption-based pricing.", date: "Jun 18, 2024", tag: "Guides", read: "12 min" },
    { title: "Postgres RLS at Scale", excerpt: "How we secure multi-tenant data without application-level logic.", date: "May 22, 2024", tag: "Engineering", read: "7 min" },
  ]

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <h1 className="text-5xl font-bold mb-6 text-slate-900">The Ledger</h1>
                <p className="text-xl text-slate-500">Thoughts on engineering, pricing, and the future of SaaS.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                    <article key={i} className="group cursor-pointer flex flex-col h-full border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 group-hover:scale-105 transition-transform duration-500"></div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-4">
                                <span className="text-indigo-600">{post.tag}</span>
                                <span className="text-slate-400">{post.read}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                            <p className="text-slate-500 mb-6 flex-1">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-3 transition-all">
                                Read Article <ArrowRight size={16}/>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}