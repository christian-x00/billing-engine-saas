import PublicLayout from '@/components/PublicLayout'

export default function BlogPage() {
  const posts = [
    { title: "Why usage-based pricing is winning", date: "Oct 12, 2024", cat: "Strategy" },
    { title: "Scaling Express.js to 10k RPS", date: "Sep 28, 2024", cat: "Engineering" },
    { title: "Series A Funding Announcement", date: "Aug 15, 2024", cat: "Company" },
  ]

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-12 text-center">Latest Updates</h1>
        <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-xs font-bold text-indigo-600 uppercase mb-2">{post.cat}</div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-slate-500 text-sm">{post.date}</p>
                </div>
            ))}
        </div>
      </div>
    </PublicLayout>
  )
}