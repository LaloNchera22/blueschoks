"use client"

import { useEffect } from "react"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"
import { saveThemeConfig } from "@/app/dashboard/actions/design-actions"
import { ThemeConfig } from "@/lib/types/theme-config"
import dynamic from "next/dynamic"

// Dynamic Import for the Editor Component
// This prevents the heavy editor logic from blocking the initial render of the page
const FloatingDesignEditor = dynamic(() => import("@/components/FloatingDesignEditor"), {
  ssr: false,
  loading: () => null // Invisible loading since it's a floating element
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        products={initialProducts}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
