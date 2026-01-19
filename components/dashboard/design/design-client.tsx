"use client"

import { useEffect, useState } from "react"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"
import { saveThemeConfig } from "@/app/dashboard/actions/design-actions"
import { ThemeConfig } from "@/lib/types/theme-config"
import dynamic from "next/dynamic"
import { Loader2, ExternalLink } from "lucide-react"

// Dynamic Import for the Editor Component
// This prevents the heavy editor logic from blocking the initial render of the page
const FloatingDesignEditor = dynamic(() => import("@/components/FloatingDesignEditor"), {
  ssr: false,
  loading: () => null // Invisible loading since it's a floating element
})

// Dynamic Import for the Preview Component
// This splits the heavy shop preview code (framer-motion, confetti, etc) into a separate chunk
const CatalogoInteractivo = dynamic(() => import("@/components/shop/CatalogoInteractivo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      <p className="text-sm font-medium">Cargando vista previa...</p>
    </div>
  )
})

interface DesignClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialShopData: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProducts: any[]
  initialThemeConfig: ThemeConfig
  isPro: boolean
}

export default function DesignClient({
  initialShopData,
  initialProducts,
  initialThemeConfig,
  isPro
}: DesignClientProps) {
  // Store global del editor
  const { theme, setFullThemeConfig, setIsSaving } = useEditorStore()

  // Initialize store with server-fetched config
  useEffect(() => {
    if (initialThemeConfig) {
        setFullThemeConfig(initialThemeConfig)
    }
  }, [initialThemeConfig, setFullThemeConfig])

  const handleSave = async () => {
    if (!isPro) return
    setIsSaving(true)

    // Guardar usando la Server Action actualizada
    // Se envía el objeto completo 'theme' a la columna JSONB 'theme_config'
    const result = await saveThemeConfig(theme)

    if (!result.success) {
        console.error("Failed to save")
    }

    setTimeout(() => setIsSaving(false), 1000)
  }

  // Mapear el nuevo objeto `theme` para que CatalogoInteractivo lo entienda
  // Usamos 'theme' del store para que se actualice en tiempo real al editar
  // Aseguramos que initialShopData exista para evitar crash
  const safeShopData = initialShopData || {};

  const previewShopData = {
      ...safeShopData,
      theme_config: theme,
  }

  // Generar URL de la tienda para mostrarla
  // Usamos window.location.origin si estamos en el cliente, o un placeholder
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== 'undefined') {
        setOrigin(window.location.origin);
    }
  }, []);

  const shopSlug = safeShopData.slug || 'tienda-demo';
  const shopUrl = `${origin}/${shopSlug}`;

  return (
    // CONTENEDOR PRINCIPAL: Ocupa el 100% y oculta desbordes
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">

        {/* SHOP LINK HEADER: Visibilidad Urgente solicitada por el usuario */}
        <div className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Tu Tienda</span>
                <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-900 hover:text-blue-600 truncate max-w-[150px] flex items-center gap-1">
                   {shopSlug}
                   <ExternalLink size={10} />
                </a>
            </div>
        </div>

        {/* VISTA PREVIA: Centrada y contenida */}
        <div className="absolute inset-0 z-0 overflow-y-auto custom-scrollbar pb-32">
             {/* Escalar contenido si es necesario para que se vea "fit" */}
             <div className="min-h-full">
                <CartProvider>
                    <CatalogoInteractivo
                        products={initialProducts || []}
                        shop={previewShopData}
                        isEditor={true}
                    />
                </CartProvider>
             </div>
        </div>

        {/* EDITOR: Flotante encima de todo */}
        <FloatingDesignEditor
            onSave={handleSave}
            isPro={isPro}
        />
    </div>
  )
}
