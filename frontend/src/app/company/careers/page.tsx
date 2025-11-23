import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { ArrowRight, Heart, Zap, Globe } from 'lucide-react'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-24">
            <h1 className="text-5xl font-extrabold tracking-tight mb-8">Join the mission.</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
                We are a remote-first team building the financial infrastructure for the next generation of software companies.
            </p>
        </div>

        {/* Values */}
        <div className="bg-slate-50 py-20 mb-24">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-red-500"><Heart size={32}/></div>
                    <h3 className="text-xl font-bold mb-2">Obsess over Customers</h3>
                    <p className="text-slate-500">We don't just build software; we solve painful financial problems for real people.</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-yellow-500"><Zap size={32}/></div>
                    <h3 className="text-xl font-bold mb-2">Ship Fast, High Quality</h3>
                    <p className="text-slate-500">We deploy to production multiple times a day. Speed is a feature.</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-blue-500"><Globe size={32}/></div>
                    <h3 className="text-xl font-bold mb-2">Work from Anywhere</h3>
                    <p className="text-slate-500">We care about your output, not your timezone. 100% remote since day one.</p>
                </div>
            </div>
        </div>

        {/* Jobs */}
        <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12">Open Positions</h2>
            <div className="space-y-4">
                {[
                    { title: "Senior Backend Engineer", dept: "Engineering", loc: "Remote" },
                    { title: "Developer Advocate", dept: "Marketing", loc: "London / Remote" },
                    { title: "Product Designer", dept: "Product", loc: "New York" },
                    { title: "Customer Success Manager", dept: "Sales", loc: "San Francisco" },
                ].map((job, i) => (
                    <div key={i} className="flex items-center justify-between p-6 border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group bg-white">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                            <p className="text-slate-500 text-sm mt-1">{job.dept} • {job.loc}</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Apply Now <ArrowRight size={16}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}