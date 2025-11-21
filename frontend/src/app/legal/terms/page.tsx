import PublicLayout from '@/components/PublicLayout'

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-slate text-slate-600">
            <p>By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            <h3>1. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on BillingEngine's website for personal, non-commercial transitory viewing only.</p>
        </div>
      </div>
    </PublicLayout>
  )
}