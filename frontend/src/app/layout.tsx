import type { Metadata } from "next";
import "./globals.css";
import CrispChat from "@/components/CrispChat";
import { Toaster } from 'sonner' // <--- ADD THIS

export const metadata: Metadata = {
  metadataBase: new URL('https://billing-engine-api.vercel.app/'),
  title: {
    default: "BillingEngine | Serverless Usage-Based Billing Infrastructure",
    template: "%s | BillingEngine"
  },
  description: "The complete API for metered pricing. Ingest events, aggregate usage, and generate invoices automatically. Built for Next.js, Stripe, and Supabase.",
  keywords: ["usage based billing", "metered pricing", "saas billing", "stripe alternative", "serverless billing", "api monetization", "usage metering"],
  authors: [{ name: "BillingEngine Team" }],
  creator: "BillingEngine",
  publisher: "BillingEngine Inc",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://billing-engine-api.vercel.app",
    title: "BillingEngine - Usage Based Billing Infrastructure",
    description: "Turn API calls into revenue. Serverless metering, automatic invoicing, and real-time analytics.",
    siteName: "BillingEngine",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "BillingEngine - Serverless Billing",
    description: "The complete infrastructure for usage-based pricing.",
    creator: "@billingengine",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://billing-engine-api.vercel.app" />
      </head>
      <body className="antialiased">
        <Toaster position="top-right" richColors /> {/* <--- ADD THIS */}
        <CrispChat />
        {children}
      </body>
    </html>
  );
}