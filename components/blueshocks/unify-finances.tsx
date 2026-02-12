"use client"

import { motion } from "framer-motion"
import { Check, TrendingUp, ArrowRight } from "lucide-react"

export function UnifyFinances() {
  return (
    <section className="bg-[#fafafa] py-32 min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] leading-[1.1] mb-6">
              Unify your <br />
              finances.
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed max-w-md">
              Everything you need in one place. Send money, check rates, and manage your balance with ease and security.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group flex items-center gap-2 text-[#ff3b30] font-bold text-lg"
          >
            Learn more
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>

        <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000">
           {/* Card 1: Balance (Background) */}
           <motion.div
             initial={{ opacity: 0, y: 100, rotate: -10, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, rotate: -6, scale: 1 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
             className="absolute top-20 left-4 md:left-10 bg-white p-8 rounded-[2rem] shadow-xl w-72 z-10 border border-gray-100"
           >
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-bold text-gray-600">$</span>
                 </div>
                 <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">+2.5%</div>
              </div>
              <div className="text-sm text-gray-400 font-medium mb-1">Total Balance</div>
              <div className="text-4xl font-bold text-gray-900">$12,450</div>
           </motion.div>

           {/* Card 2: Payment Sent (Bottom Right) */}
           <motion.div
             initial={{ opacity: 0, y: 100, rotate: 10, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, rotate: 6, scale: 1 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
             className="absolute bottom-32 right-4 md:right-10 bg-white p-6 rounded-[2rem] shadow-2xl w-80 z-20 border border-gray-100"
           >
              <div className="flex items-center gap-5 mb-6">
                 <div className="w-14 h-14 rounded-full bg-[#ff3b30] flex items-center justify-center text-white shadow-lg shadow-red-200">
                    <Check size={28} strokeWidth={3} />
                 </div>
                 <div>
                    <div className="font-bold text-gray-900 text-lg">Payment Sent</div>
                    <div className="text-sm text-gray-400 font-medium">To Sarah Jenkins</div>
                 </div>
              </div>
              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                  <span className="text-gray-400 text-sm">Amount</span>
                  <span className="text-2xl font-bold text-gray-900">-$150.00</span>
              </div>
           </motion.div>

           {/* Card 3: Exchange Rate (Floating Center) */}
           <motion.div
             initial={{ opacity: 0, scale: 0.5, y: 50 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
           >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] w-64 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                   <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">USD</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">United States</div>
                   </div>
                   <div className="h-8 w-[1px] bg-gray-200"></div>
                   <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">EUR</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Europe</div>
                   </div>
                </div>
                <div className="text-center bg-gray-50 rounded-2xl py-4">
                   <div className="text-4xl font-black text-gray-900 tracking-tight">0.92</div>
                   <div className="text-xs text-green-600 font-bold flex items-center justify-center gap-1 mt-1">
                      <TrendingUp size={12} /> Live Rate
                   </div>
                </div>
              </motion.div>
           </motion.div>
        </div>
      </div>
    </section>
  )
}
