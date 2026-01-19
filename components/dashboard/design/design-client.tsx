"use client"

import { useEffect } from "react"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"
import { saveThemeConfig } from "@/app/dashboard/actions/design-actions"
import { ThemeConfig } from "@/lib/types/theme-config"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

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
  initialShopData: Record<string, any> | null
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
  const previewShopData = {
      ...initialShopData,
      theme_config: theme,
  }

  return (
    // CONTENEDOR PRINCIPAL: Ocupa el 100% y oculta desbordes
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">

        {/* VISTA PREVIA: Centrada y contenida */}
        <div className="absolute inset-0 z-0 overflow-y-auto custom-scrollbar pb-32">
             {/* Escalar contenido si es necesario para que se vea "fit" */}
             <div className="min-h-full">
                <CartProvider>
                    <CatalogoInteractivo

                        products={initialProducts}

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
