"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Settings, Palette, Home, Copy, ExternalLink, Globe, LogOut, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// Agregamos la prop 'userEmail' para mostrarlo abajo
export default function AppSidebar({ shopUrl = "lidiso", userEmail = "usuario@email.com" }: { shopUrl?: string, userEmail?: string }) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${shopUrl}`)
    setCopied(true)
    // Después de 2 segundos, vuelve al estado normal
    setTimeout(() => setCopied(false), 2000)
  }

  const isDesignMode = pathname === '/dashboard/design'

  const getItemClass = (path: string) => 
    `flex items-center ${isDesignMode ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl transition-all font-medium text-sm mb-1 ${
      pathname === path 
      ? "bg-slate-900 text-white shadow-md" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`

  return (
    <aside className={`${isDesignMode ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 h-full flex flex-col shrink-0 overflow-y-auto custom-scrollbar transition-all duration-300`}>
      
      {/* 1. HEADER */}
      <div className={`p-6 pb-2 ${isDesignMode ? 'flex flex-col items-center px-2' : ''}`}>
        <div className={`flex items-center ${isDesignMode ? 'justify-center mb-4' : 'gap-3 mb-6'}`}>
           <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg">B</div>
           {!isDesignMode && <span className="font-black text-lg tracking-tight text-slate-900">BLUESHOCKS</span>}
        </div>

        {!isDesignMode && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3 mb-6">
             <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
             </div>
             <div>
               <h3 className="font-bold text-[10px] uppercase tracking-wider text-amber-800">Plan Pro</h3>
               <p className="text-[10px] text-amber-600/80 font-medium">Cuenta activa</p>
             </div>
          </div>
        )}
      </div>

      {/* 2. MENÚ DE NAVEGACIÓN */}
      <div className={`${isDesignMode ? 'px-2' : 'px-4'} space-y-1`}>
         {!isDesignMode && (
           <div className="px-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestión</span>
           </div>
         )}

         <Link href="/dashboard/products" className={getItemClass("/dashboard/products")} title="Mis Productos">
            <Package size={18} /> {!isDesignMode && <span>Mis Productos</span>}
         </Link>

         <Link href="/dashboard/design" className={getItemClass("/dashboard/design")} title="Diseño">
            <Palette size={18} /> {!isDesignMode && <span>Diseño</span>}
         </Link>

         <Link href="/dashboard/settings" className={getItemClass("/dashboard/settings")} title="Configuración">
            <Settings size={18} /> {!isDesignMode && <span>Configuración</span>}
         </Link>
      </div>

      {/* 3. TU TIENDA ONLINE */}
      {!isDesignMode && (
        <div className="px-4 mt-8">
           <div className="px-2 mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tu Tienda Online</span>
           </div>

           <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                 <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md">
                   <Home size={14} />
                 </div>
                 <span className="font-bold text-xs text-slate-700 truncate flex-1">{shopUrl}</span>
                 <a href={`/${shopUrl}`} target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink size={14} />
                 </a>
              </div>

              {/* BOTÓN COPIAR DINÁMICO */}
              <Button
                  onClick={copyLink}
                  variant="outline"
                  className={`w-full h-8 text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ${
                      copied
                      ? "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
              >
                 {copied ? (
                     <div className="flex items-center"><Check size={12} className="mr-2"/> Link Copiado</div>
                 ) : (
                     <div className="flex items-center"><Copy size={12} className="mr-2"/> Copiar Link</div>
                 )}
              </Button>

              <div className="mt-2 pt-2 border-t border-slate-200/50 text-center">
                 <Link href="/dashboard/settings" className="text-[10px] font-bold text-slate-400 hover:text-slate-800 flex items-center justify-center gap-1 transition-colors uppercase">
                    <Globe size={10} /> Editar dominio
                 </Link>
              </div>
           </div>
        </div>
      )}

      {/* FOOTER USUARIO (SIN FOTO, CON EMAIL) */}
      <div className={`p-4 mt-auto border-t border-slate-100 ${isDesignMode ? 'flex justify-center' : ''}`}>
         {isDesignMode ? (
            <Link href="/api/auth/signout" className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Cerrar Sesión">
                <LogOut size={18} />
            </Link>
         ) : (
           <div className="flex flex-col px-2">
               <span className="text-xs font-bold text-slate-900 truncate mb-0.5">Mi Cuenta</span>
               <span className="text-[10px] text-slate-500 truncate font-medium mb-3">{userEmail}</span>

               <Link href="/api/auth/signout" className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors">
                   <LogOut size={12} /> Cerrar Sesión
               </Link>
           </div>
         )}
      </div>

    </aside>
  )
}