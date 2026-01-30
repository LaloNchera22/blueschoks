"use client"

import { Home, Package, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import SidebarShareButton from "@/components/SidebarShareButton" // Asegúrate que este componente exista

// Menú principal
const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Mis Productos", url: "/dashboard", icon: Package }, // Apuntan al mismo lugar por ahora
  { title: "Configuración", url: "/dashboard/settings", icon: Settings },
]

interface User {
  username?: string;
  shop_name?: string;
  email?: string;
  [key: string]: unknown;
}

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar collapsible="icon">
      {/* CABECERA */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-black text-xl text-primary tracking-tighter">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0">
            B
          </div>
          <span className="group-data-[collapsible=icon]:hidden">BLUESHOCK</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* GRUPO 1: Gestión */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="font-medium">
                      <item.icon className="text-muted-foreground" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO 2: Tienda Pública (El botón mágico) */}
        {user?.username && (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarSeparator className="my-2"/>
                <SidebarGroupLabel>Tu Tienda</SidebarGroupLabel>
                <SidebarGroupContent>
                    <div className="px-2">
                        {/* Reutilizamos tu componente viejo pero dentro del sidebar */}
                        <div className="bg-primary/5 rounded-xl border border-primary/10 p-1">
                            <SidebarShareButton username={user.username} />
                        </div>
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        )}
      </SidebarContent>

      {/* PIE DE PÁGINA: Usuario */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
         <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-9 w-9 rounded-lg border bg-muted">
                        <AvatarFallback className="rounded-lg font-bold text-primary">
                            {user?.shop_name?.substring(0, 2).toUpperCase() || 'YO'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold">{user?.shop_name || 'Mi Tienda'}</span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                </div>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}