"use client"

import { motion } from "framer-motion"

const CURRENCIES = [
  { flag: "🇺🇸", code: "USD" },
  { flag: "🇪🇺", code: "EUR" },
  { flag: "🇬🇧", code: "GBP" },
  { flag: "🇯🇵", code: "JPY" },
  { flag: "🇨🇦", code: "CAD" },
  { flag: "🇦🇺", code: "AUD" },
  { flag: "🇨🇭", code: "CHF" },
  { flag: "🇨🇳", code: "CNY" },
  { flag: "🇸🇪", code: "SEK" },
  { flag: "🇳🇿", code: "NZD" },
  { flag: "🇲🇽", code: "MXN" },
  { flag: "🇸🇬", code: "SGD" },
  { flag: "🇭🇰", code: "HKD" },
  { flag: "🇳🇴", code: "NOK" },
  { flag: "🇰🇷", code: "KRW" },
  { flag: "🇹🇷", code: "TRY" },
  { flag: "🇮🇳", code: "INR" },
  { flag: "🇧🇷", code: "BRL" },
  { flag: "🇿🇦", code: "ZAR" },
]

export function CurrencyMarquee() {
  return (
    <section className="bg-white py-20 border-y border-gray-100 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex">
        <motion.div
          className="flex gap-16 min-w-max px-8"
          animate={{ x: "-50%" }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {[...CURRENCIES, ...CURRENCIES].map((currency, i) => (
             <div key={i} className="flex flex-col items-center justify-center gap-3 group cursor-pointer">
               <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-4xl shadow-sm border border-gray-100 transition-transform group-hover:scale-110 group-hover:shadow-md">
                 {currency.flag}
               </div>
               <span className="font-bold text-gray-400 group-hover:text-[#ff3b30] transition-colors">{currency.code}</span>
             </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
