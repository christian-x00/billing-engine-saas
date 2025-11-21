import PublicLayout from '@/components/PublicLayout'

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-6">We are building the financial backbone of the internet.</h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
          BillingEngine was founded with a simple mission: to make usage-based billing accessible to every developer, not just large enterprises.
        </p>
        <div className="aspect-video bg-slate-100 rounded-2xl mb-12 flex items-center justify-center text-slate-400">
            [Team Photo Placeholder]
        </div>
        <div className="prose prose-slate lg:prose-lg">
            <p>
                Traditional billing systems were designed for subscriptions ($10/month). But the API economy is different. 
                It moves fast, scales automatically, and requires metering that is precise down to the millisecond.
            </p>
            <p>
                We built BillingEngine to solve this. By leveraging serverless edge computing, we can process millions of events without the overhead of traditional infrastructure.
            </p>
        </div>
      </div>
    </PublicLayout>
  )
}