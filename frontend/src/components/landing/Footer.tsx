import Link from 'next/link'
import { Globe } from 'lucide-react'

// Reusing the logo locally for the footer to avoid circular imports
const BrandLogo = () => (
  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
)

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                
                {/* Brand Column */}
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4 text-white">
                        <BrandLogo />
                        <span className="font-bold text-xl">BillingEngine</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500">
                        The modern standard for metered billing infrastructure.
                    </p>
                </div>

                {/* Product Links (Scrolls to sections) */}
                <div>
                    <h4 className="font-bold text-white mb-4">Product</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                        <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                        <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
                    </ul>
                </div>

                {/* Company Links (Points to your new pages) */}
                <div>
                    <h4 className="font-bold text-white mb-4">Company</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/company/about" className="hover:text-indigo-400 transition-colors">About</Link></li>
                        <li><Link href="/company/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                    </ul>
                </div>

                {/* Legal Links (Points to your new pages) */}
                <div>
                    <h4 className="font-bold text-white mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/legal/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link></li>
                        <li><Link href="/legal/terms" className="hover:text-indigo-400 transition-colors">Terms</Link></li>
                        <li><Link href="/legal/security" className="hover:text-indigo-400 transition-colors">Security</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                <p>&copy; {new Date().getFullYear()} BillingEngine Inc. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <span>English (US)</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}