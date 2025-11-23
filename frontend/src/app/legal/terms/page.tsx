import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        <div className="mb-12 border-b border-slate-100 pb-8">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-slate-500">Effective Date: October 24, 2024</p>
        </div>
        
        <div className="prose prose-slate prose-lg">
            <h3>1. Terms</h3>
            <p>By accessing the website at BillingEngine, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            
            <h3>2. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on BillingEngine's website for personal, non-commercial transitory viewing only.</p>
            
            <h3>3. Disclaimer</h3>
            <p>The materials on BillingEngine's website are provided on an 'as is' basis. BillingEngine makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}