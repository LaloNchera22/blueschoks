"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { ArrowRight } from "lucide-react"

export function FooterActionBar() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
    })

    return () => {
        subscription.unsubscribe()
    }
  }, [])

  if (!mounted) return null // Avoid hydration mismatch or flash

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 p-4 bg-background-dark/90 backdrop-blur-lg border-t border-white/5">
      <div className="max-w-lg mx-auto w-full flex gap-3">
        {user ? (
            <Link href="/dashboard" className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
                Ir al Dashboard
                <ArrowRight className="w-5 h-5" />
            </Link>
        ) : (
            <>
                <Link href="/login" className="flex-1 flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-bold h-12 rounded-xl transition-colors border border-white/10">
                    Iniciar Sesión
                </Link>
                <Link href="/register" className="flex-[2] bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(13,89,242,0.3)] transition-all flex items-center justify-center gap-2">
                    Empezar Prueba Gratis
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </>
        )}
      </div>
    </div>
  )
}
