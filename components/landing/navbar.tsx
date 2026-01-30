"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
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
    <nav className="flex items-center justify-between px-3 sm:px-6 py-4 max-w-full mx-auto w-full shrink-0 z-50">
      <div className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-tighter">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#0F172A] text-white rounded-md flex items-center justify-center text-base sm:text-lg">B</div>
        BLUESHOCKS
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {!isMounted ? (
            <div className="flex items-center gap-3">
                <div className="h-4 w-20 bg-slate-100 animate-pulse rounded hidden sm:block" />
                <div className="h-8 w-24 sm:h-9 sm:w-32 bg-slate-100 animate-pulse rounded-lg" />
            </div>
        ) : user ? (
             <div className="flex items-center gap-3">
                <Link href="/dashboard">
                    <Button className="font-bold rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 h-8 px-4 text-[10px] sm:text-sm sm:h-9">
                        Dashboard
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-slate-100 font-bold text-xs text-slate-700">
                            {user.email?.substring(0,2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        ) : (
            <>
                <Link href="/login" className="text-[10px] sm:text-sm font-bold text-slate-600 hover:text-[#0F172A] transition-colors whitespace-nowrap">
                  Iniciar Sesión
                </Link>
                <Link href="/register">
                  <Button className="font-bold rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 h-8 px-2 text-[10px] sm:text-sm sm:h-9 sm:px-5">
                    Empezar Gratis
                  </Button>
                </Link>
            </>
        )}
      </div>
    </nav>
  )
}
