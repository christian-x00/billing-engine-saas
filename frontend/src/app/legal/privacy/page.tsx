import PublicLayout from '@/components/PublicLayout'

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-slate text-slate-600">
            <p>Last updated: October 2024</p>
            <p>Your privacy is important to us. It is BillingEngine's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            <h3>1. Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            <h3>2. How We Use Information</h3>
            <p>We use the information we collect to operate and maintain our services, send you marketing communications, and improve our website.</p>
        </div>
      </div>
    </PublicLayout>
  )
}