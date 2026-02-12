"use client"

import { motion } from "framer-motion"
import { Apple, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#ff3b30] via-[#ff5b5b] to-[#ff9a9e]">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)]"
        />
        <motion.div
           animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff3b30] mix-blend-multiply filter blur-3xl opacity-50 rounded-full"
        />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white space-y-8 text-center lg:text-left"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1]">
            One app for <br />
            all needs
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/90 max-w-lg mx-auto lg:mx-0">
            Manage your money, pay bills, and shop online with BlueShocks Wallet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-all hover:scale-105 shadow-xl">
              <Apple className="w-8 h-8" />
              <div className="text-left">
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">Download on the</div>
                <div className="text-xl font-bold leading-none">App Store</div>
              </div>
            </button>
            <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-all hover:scale-105 shadow-xl">
              <Play className="w-8 h-8 fill-current" />
              <div className="text-left">
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">Get it on</div>
                <div className="text-xl font-bold leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </motion.div>

        <div className="relative flex justify-center items-center h-full min-h-[400px] lg:min-h-[600px]">
           {/* Abstract Floating Element */}
           <motion.div
             animate={{ y: [0, -20, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="relative w-72 h-72 md:w-96 md:h-96"
           >
             {/* Glassmorphism Circle */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl" />

             {/* Inner Ring */}
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute inset-8 rounded-full border border-white/10 border-dashed"
             />

             {/* Inner Gradient Blob */}
             <div className="absolute inset-16 rounded-full bg-gradient-to-bl from-white/30 to-transparent backdrop-blur-md" />

             {/* Floating Particles */}
             <motion.div
               className="absolute inset-0"
               animate={{ rotate: -360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             >
                <div className="w-6 h-6 bg-white/80 rounded-full absolute top-10 left-1/2 blur-sm shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                <div className="w-3 h-3 bg-white/50 rounded-full absolute bottom-20 right-20 blur-[2px]" />
                <div className="w-4 h-4 bg-[#ff3b30] rounded-full absolute top-1/2 right-10 blur-sm mix-blend-overlay" />
             </motion.div>
           </motion.div>
        </div>
      </div>
    </section>
  )
}
