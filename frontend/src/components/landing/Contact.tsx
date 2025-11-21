'use client'
import { MessageSquare, Check, Send, AlertCircle } from 'lucide-react'
import { useForm, ValidationError } from '@formspree/react'

export default function Contact() {
  // REPLACE 'YOUR_FORM_ID' WITH THE CODE FROM FORMSPREE (e.g., xabczzz)
  const [state, handleSubmit] = useForm("xanvlgql")

  if (state.succeeded) {
    return (
        <section id="contact" className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto px-6">
                <div className="bg-green-50 p-12 rounded-3xl border border-green-100 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500">Thanks for reaching out. Our team will reply to your email shortly.</p>
                </div>
            </div>
        </section>
    )
  }

  return (
    <section id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={24} />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Get in touch</h2>
                <p className="text-slate-500">Have questions about custom integrations? We're here to help.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                            <input 
                                id="name"
                                type="text" 
                                name="name" 
                                required 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white" 
                                placeholder="Jane" 
                            />
                            <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input 
                                id="email"
                                type="email" 
                                name="email" 
                                required 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white" 
                                placeholder="jane@company.com" 
                            />
                            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea 
                            id="message"
                            name="message" 
                            required 
                            rows={4} 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white" 
                            placeholder="Tell us about your project..."
                        />
                        <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                    
                    {state.errors && state.errors.length > 0 && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                            <AlertCircle size={16} />
                            <span>Something went wrong. Please try again.</span>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={state.submitting}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {state.submitting ? 'Sending...' : <><Send size={18}/> Send Message</>}
                    </button>
                </form>
            </div>
        </div>
    </section>
  )
}