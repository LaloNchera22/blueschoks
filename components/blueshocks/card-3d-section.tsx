"use client"

import React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Wifi, CreditCard } from "lucide-react"

export function Card3DSection() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 50, damping: 20 })
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["25deg", "-25deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-25deg", "25deg"])

  function onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXVal = event.clientX - rect.left
    const mouseYVal = event.clientY - rect.top
    const xPct = mouseXVal / width - 0.5
    const yPct = mouseYVal / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <section className="bg-[#ff3b30] py-32 overflow-hidden text-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="space-y-8"
        >
           <h2 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
             Ready to use <br />
             right away.
           </h2>
           <p className="text-xl text-white/90 max-w-md font-medium leading-relaxed">
             Get your virtual card instantly. Order your physical card and start spending worldwide with zero fees and real-time notifications.
           </p>
           <button className="bg-white text-[#ff3b30] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
             Get your card
           </button>
        </motion.div>

        <div
          className="relative h-[500px] flex items-center justify-center [perspective:1000px]"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
           <motion.div
             style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="w-[340px] h-[220px] md:w-[420px] md:h-[260px] relative rounded-[2rem] shadow-2xl cursor-pointer"
           >
             {/* Card Glow */}
             <div className="absolute inset-0 bg-[#ff3b30] blur-xl opacity-50 -z-10" />

             {/* Card Body */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Glossy Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                />

                <div className="flex justify-between items-start relative z-10">
                   <div className="w-12 h-8 rounded bg-gradient-to-r from-yellow-400 to-yellow-200 shadow-sm flex items-center justify-center opacity-80">
                      <div className="w-8 h-5 border border-black/10 rounded-sm" />
                   </div>
                   <Wifi className="w-8 h-8 text-white/80 rotate-90" />
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="text-2xl md:text-3xl tracking-widest font-mono text-white drop-shadow-md">
                      •••• •••• •••• 4289
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                         <div className="text-[10px] uppercase text-white/60 font-bold mb-1 tracking-widest">Card Holder</div>
                         <div className="font-bold tracking-wide text-white drop-shadow-md">ALEX MORGAN</div>
                      </div>
                      <div className="font-black italic text-2xl text-white">VISA</div>
                   </div>
                </div>
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  )
}
