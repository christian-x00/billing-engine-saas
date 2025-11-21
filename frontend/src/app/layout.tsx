import type { Metadata } from "next";
import "./globals.css";
import CrispChat from "@/components/CrispChat";

export const metadata: Metadata = {
  title: "BillingEngine | Serverless Usage-Based Billing Infrastructure",
  description: "The complete API for metered pricing. Ingest events, aggregate usage, and generate invoices without managing servers. Built for Next.js and Supabase.",
  keywords: ["usage based billing", "metered pricing", "saas billing", "stripe alternative", "serverless billing"],
  openGraph: {
    title: "BillingEngine - Usage Based Billing",
    description: "Scale your SaaS billing from 1 to 1B events.",
    type: "website",
    url: "https://billing-engine.vercel.app", // Replace with your actual URL later
    siteName: "BillingEngine",
  },
  twitter: {
    card: "summary_large_image",
    title: "BillingEngine",
    description: "Serverless Usage-Based Billing Infrastructure",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CrispChat />
        {children}
      </body>
    </html>
  );
}