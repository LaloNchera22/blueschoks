"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut, Settings, HelpCircle, User, ChevronUp } from "lucide-react"

interface UserNavProps {
  userEmail: string
  avatarUrl?: string
  isCollapsed?: boolean
}

export function UserNav({ userEmail, avatarUrl, isCollapsed }: UserNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Get initials from email
  const initials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
            suppressHydrationWarning={true}
            variant="ghost"
            className={`relative h-12 w-full justify-start rounded-xl px-2 hover:bg-slate-100 ${isCollapsed ? "px-0 justify-center" : ""}`}
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-8 w-8 bg-slate-200 border border-slate-300">
                <AvatarImage src={avatarUrl} alt={userEmail} />
                <AvatarFallback className="bg-slate-200 text-slate-600 text-xs font-bold">
                    {initials}
                </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate w-full">Mi Cuenta</span>
                    <span className="text-[10px] text-slate-500 truncate font-medium w-full">{userEmail}</span>
                </div>
            )}

            {!isCollapsed && <ChevronUp className="h-4 w-4 text-slate-400" />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-xl border-slate-200 shadow-lg mb-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Cuenta</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open('mailto:soporte@blueshocks.com', '_blank')} className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ayuda / Soporte</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
