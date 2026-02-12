"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className={`text-2xl font-bold transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
          BlueShocks
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Pricing", "Company", "Support"].map((item) => (
            <Link
              key={item}
              href="#"
              className={`font-medium transition-colors hover:opacity-80 ${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/90 hover:text-white"}`}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <button className={`px-6 py-2.5 rounded-full font-bold transition-all ${
            scrolled
              ? "bg-[#ff3b30] text-white hover:bg-[#d63026]"
              : "bg-white text-[#ff3b30] hover:bg-gray-100"
          }`}>
            Download App
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={scrolled ? "text-gray-900" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-gray-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 md:hidden flex flex-col space-y-4"
          >
            {["Features", "Pricing", "Company", "Support"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-800 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <button className="w-full bg-[#ff3b30] text-white py-3 rounded-xl font-bold mt-4">
              Download App
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
