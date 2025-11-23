import { Metadata } from 'next'
import ClientPage from '@/components/ClientPage' // We move the logic to a client component to allow Metadata here

export const metadata: Metadata = {
  title: "BillingEngine | Enterprise Usage-Based Billing Infrastructure",
  description: "The complete API for metered pricing. Ingest events, aggregate usage, and generate invoices automatically. Plans start at $100/mo.",
  keywords: ["usage based billing", "metered pricing", "saas billing", "stripe alternative", "serverless billing"],
  openGraph: {
    title: "BillingEngine - Usage Based Billing",
    description: "Scale your SaaS billing from 1 to 1B events. Enterprise-grade infrastructure.",
    type: "website",
    url: "https://billing-engine-api.vercel.app",
    siteName: "BillingEngine",
    images: [
      {
        url: 'https://billing-engine-api.vercel.app/og-image.jpg', // (Optional: Add an image to public folder later)
        width: 1200,
        height: 630,
      }
    ]
  }
}

export default function Page() {
  return <ClientPage />
}