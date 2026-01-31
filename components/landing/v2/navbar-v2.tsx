"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { Store } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavbarV2() {
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const supabase = createClient()

    // Check active session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
    })

    return () => {
        subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
            <Store className="w-5 h-5" />
          </div>
          <h2 className="text-white text-lg font-bold tracking-tight font-display">HybridPro</h2>
        </div>
        <div className="flex items-center gap-4">
            {user ? (
                 <Link href="/dashboard" className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link href="/login" className="text-slate-400 text-sm font-medium hover:text-white transition-colors">
                        Iniciar Sesión
                    </Link>
                    <Link href="/register" className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">
                        Obtener App
                    </Link>
                </>
            )}
        </div>
      </div>
    </nav>
  )
}
