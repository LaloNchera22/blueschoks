"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Store } from "lucide-react"

export function Navbar() {
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
                <Store className="w-5 h-5" />
            </div>
            <h2 className="text-white text-lg font-bold tracking-tight">HybridPro</h2>
        </div>
        <div className="flex items-center gap-4">
            {!isMounted ? (
                <div className="flex items-center gap-3">
                    <div className="h-4 w-20 bg-white/10 animate-pulse rounded hidden sm:block" />
                    <div className="h-8 w-24 bg-white/10 animate-pulse rounded-full" />
                </div>
            ) : user ? (
                 <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button className="font-bold rounded-full bg-white/10 hover:bg-white/20 text-white h-9 px-4 text-sm transition-all border-none">
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Avatar className="h-9 w-9 border border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-primary/20 font-bold text-xs text-primary-foreground">
                                {user.email?.substring(0,2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            ) : (
                <>
                    <Link href="/login" className="text-slate-400 text-sm font-medium hover:text-white transition-colors hidden sm:block">
                      Iniciar Sesión
                    </Link>
                    <Link href="/register">
                      <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">
                        Obtener App
                      </button>
                    </Link>
                </>
            )}
        </div>
      </div>
    </nav>
  )
}
