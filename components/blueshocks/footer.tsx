"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Twitter, Linkedin, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white pt-32 pb-12 overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
           <h2 className="text-[12vw] leading-none font-black tracking-tighter text-[#1a1a1a]">
             1 million users,
             <br />
             <span className="text-[#ff3b30]">plus you.</span>
           </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-12 border-t border-gray-100 pt-12">
          <div className="space-y-6">
             <div className="text-2xl font-bold text-gray-900">BlueShocks</div>
             <p className="text-gray-500 max-w-xs">
               The financial app for the modern world. Manage, save, and spend with confidence.
             </p>
             <div className="flex gap-4">
                {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#ff3b30] hover:text-white transition-colors">
                     <Icon size={18} />
                  </Link>
                ))}
             </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Company</h3>
            <ul className="space-y-4">
               {["About", "Careers", "Press", "Blog"].map(item => (
                 <li key={item}><Link href="#" className="text-gray-500 hover:text-[#ff3b30] transition-colors font-medium">{item}</Link></li>
               ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Product</h3>
            <ul className="space-y-4">
               {["Features", "Pricing", "Security", "Help Center"].map(item => (
                 <li key={item}><Link href="#" className="text-gray-500 hover:text-[#ff3b30] transition-colors font-medium">{item}</Link></li>
               ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Legal</h3>
            <ul className="space-y-4">
               {["Privacy Policy", "Terms of Service", "Cookie Policy", "Licenses"].map(item => (
                 <li key={item}><Link href="#" className="text-gray-500 hover:text-[#ff3b30] transition-colors font-medium">{item}</Link></li>
               ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
           <div>&copy; {new Date().getFullYear()} BlueShocks. All rights reserved.</div>
           <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-900">Privacy</Link>
              <Link href="#" className="hover:text-gray-900">Terms</Link>
           </div>
        </div>
      </div>
    </footer>
  )
}
