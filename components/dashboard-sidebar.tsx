"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Settings, Palette, Home, Copy, ExternalLink, Globe, Check, X, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/dashboard/user-nav"

export function AppSidebar({
  shopUrl = "",
  userEmail = "usuario@email.com",
  isOpen = true,
  isPro = false,
  subscriptionEnd = null,
  onClose
}: {
  shopUrl?: string,
  userEmail?: string,
  isOpen?: boolean,
  isPro?: boolean,
  subscriptionEnd?: string | null,
  onClose?: () => void
}) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const hasShopUrl = shopUrl && shopUrl.length > 0;
  const storeLink = hasShopUrl ? `/${shopUrl}` : '/dashboard/settings';

  const copyLink = () => {
    if (!hasShopUrl) return;
    navigator.clipboard.writeText(`${window.location.origin}/${shopUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Reduced padding for compact mode
  const getItemClass = (path: string) => 
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-medium text-sm mb-0.5 ${
      pathname === path 
      ? "bg-slate-900 text-white shadow-md" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`

  // Sidebar responsive logic:
  // Mobile: fixed, transform based, w-64 constant
  // Desktop: relative (flex item), width based (w-64 or w-0)
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[60] h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 w-64
    md:relative
    ${isOpen
      ? "translate-x-0 shadow-xl md:w-64 md:translate-x-0 md:shadow-none"
      : "-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden"}
  `

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[50] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>

        {/* 1. HEADER */}
        {/* Reduced padding p-6 -> p-4 */}
        <div className="p-4 pb-2 relative group shrink-0">
          {/* Close Button - visible only on mobile/tablet */}
          {isOpen && onClose && (
             <button
               onClick={onClose}
               className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1 transition-colors z-50 md:hidden"
               title="Cerrar menú"
             >
               <X size={16} />
             </button>
          )}

          {/* Reduced mb-6 -> mb-4 */}
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg shrink-0">B</div>
             {/* Text size reduced slightly if needed, but text-lg is fine, tracking tight helps */}
             <span className="font-black text-lg tracking-tight text-slate-900">BLUESHOCKS</span>
          </div>

          {/* ZONA DE ESTADO DEL PLAN */}
          <div className="mb-4">
            {isPro ? (
              <Link
                href="/dashboard/pricing"
                className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-amber-100/50 transition-colors group/plan block"
              >
                 <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg group-hover/plan:bg-amber-200 transition-colors">
                   <Crown size={14} strokeWidth={3} />
                 </div>
                 <div>
                   <h3 className="font-bold text-[10px] uppercase tracking-wider text-amber-800">Plan Pro</h3>
                   {subscriptionEnd ? (
                     <p className="text-[10px] text-amber-600/80 font-medium">
                       Vence: {new Date(subscriptionEnd).toLocaleDateString()}
                     </p>
                   ) : (
                     <p className="text-[10px] text-amber-600/80 font-medium">Cuenta activa</p>
                   )}
                 </div>
              </Link>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-2">Plan Gratuito</p>
                <Button
                  asChild
                  variant="default"
                  className="w-full py-1.5 h-auto bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Link href="/dashboard/pricing">
                    MEJORAR PLAN 💎
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 2. MENÚ DE NAVEGACIÓN */}
        {/* Scrollable area starts here */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 space-y-0.5">
               <div className="px-2 mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestión</span>
               </div>

               <Link href="/dashboard/products" className={getItemClass("/dashboard/products")} prefetch={false}>
                  <Package size={18} /> <span>Mis Productos</span>
               </Link>

               <Link href="/dashboard/design" className={getItemClass("/dashboard/design")} prefetch={false}>
                  <Palette size={18} /> <span>Diseño</span>
               </Link>

               <Link href="/dashboard/settings" className={getItemClass("/dashboard/settings")} prefetch={false}>
                  <Settings size={18} /> <span>Configuración</span>
               </Link>
            </div>

            {/* 3. TU TIENDA ONLINE */}
            <div className="px-4 mt-6">
               <div className="px-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tu Tienda Online</span>
               </div>

               <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md">
                       <Home size={14} />
                     </div>
                     <span className="font-bold text-xs text-slate-700 truncate flex-1">{hasShopUrl ? shopUrl : "Sin Tienda"}</span>
                     <a href={storeLink} target={hasShopUrl ? "_blank" : "_self"} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <ExternalLink size={14} />
                     </a>
                  </div>

                  {/* BOTÓN COPIAR DINÁMICO */}
                  <Button
                     onClick={copyLink}
                     variant="outline"
                     disabled={!hasShopUrl}
                     className={`w-full h-8 text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ${
                        copied
                        ? "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                     }`}
                  >
                     {copied ? (
                         <div className="flex items-center"><Check size={12} className="mr-2"/> Link Copiado</div>
                     ) : (
                         <div className="flex items-center"><Copy size={12} className="mr-2"/> {hasShopUrl ? "Copiar Link" : "Configurar Link"}</div>
                     )}
                  </Button>

                  <div className="mt-2 pt-2 border-t border-slate-200/50 text-center">
                     <Link href="/dashboard/settings" className="text-[10px] font-bold text-slate-400 hover:text-slate-800 flex items-center justify-center gap-1 transition-colors uppercase" prefetch={false}>
                        <Globe size={10} /> Editar dominio
                     </Link>
                  </div>
               </div>
            </div>
        </div>

        {/* FOOTER USUARIO */}
        {/* Footer sticks to bottom because of flex col in parent */}
        <div className="p-3 mt-auto border-t border-slate-100 shrink-0">
           <UserNav userEmail={userEmail} isCollapsed={false} />
        </div>

      </aside>
    </>
  )
}
export default AppSidebar;
