import PublicLayout from '@/components/PublicLayout'
import { ArrowRight } from 'lucide-react'

export default function CareersPage() {
  const roles = [
    { title: "Senior Backend Engineer", loc: "Remote", type: "Full-time" },
    { title: "Developer Advocate", loc: "London / Remote", type: "Full-time" },
    { title: "Product Designer", loc: "New York", type: "Full-time" },
  ]

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Join the team</h1>
            <p className="text-xl text-slate-600">Help us build the future of monetization.</p>
        </div>
        <div className="space-y-4">
            {roles.map((role, i) => (
                <div key={i} className="flex items-center justify-between p-6 border border-slate-200 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group bg-white">
                    <div>
                        <h3 className="font-bold text-lg">{role.title}</h3>
                        <p className="text-slate-500 text-sm">{role.loc} • {role.type}</p>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-indigo-600 transition-colors"/>
                </div>
            ))}
        </div>
      </div>
    </PublicLayout>
  )
}