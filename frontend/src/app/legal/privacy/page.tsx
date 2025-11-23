import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        <div className="mb-12 border-b border-slate-100 pb-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-slate-500">Last updated: October 24, 2024</p>
        </div>
        
        <div className="prose prose-slate prose-lg">
            <p>Your privacy is important to us. It is BillingEngine's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            
            <h3>1. Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
            
            <h3>2. Data Retention</h3>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
            
            <h3>3. Sharing of Data</h3>
            <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}