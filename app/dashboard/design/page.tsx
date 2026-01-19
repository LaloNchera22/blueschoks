"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import FloatingDesignEditor from "@/components/FloatingDesignEditor"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"
import { saveThemeConfig } from "@/app/dashboard/actions/design-actions"
import { DEFAULT_THEME_CONFIG, ThemeConfig } from "@/lib/types/theme-config"

export default function DesignPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [shopData, setShopData] = useState<Record<string, unknown> | null>(null)
  const [products, setProducts] = useState<unknown[]>([])

  // Store global del editor
  const { theme, setFullThemeConfig, setIsSaving } = useEditorStore()

  useEffect(() => {
    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) return

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        
        if(profile) {
            setIsPro(profile.is_pro || false)
            setShopData(profile)

            // Cargar configuración existente o migrar/usar default
            let configToUse: ThemeConfig = DEFAULT_THEME_CONFIG;

            if (profile.theme_config && Object.keys(profile.theme_config).length > 0) {
               configToUse = profile.theme_config as ThemeConfig;
            } else {
               // Fallback: Mapear columnas viejas (si existen) a la nueva estructura theme_config
               // Esto es una migración "on the fly" para que el usuario no vea defaults planos
               configToUse = {
                  ...DEFAULT_THEME_CONFIG,
                  global: {
                     ...DEFAULT_THEME_CONFIG.global,
                     backgroundValue: profile.design_bg_color || DEFAULT_THEME_CONFIG.global.backgroundValue,
                  },
                  header: {
                     ...DEFAULT_THEME_CONFIG.header,
                     title: {
                        ...DEFAULT_THEME_CONFIG.header.title,
                        color: profile.design_title_color || DEFAULT_THEME_CONFIG.header.title.color,
                        // Fallback font from legacy `design_font`
                        fontFamily: (profile.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim(),
                     },
                     subtitle: {
                        ...DEFAULT_THEME_CONFIG.header.subtitle,
                        // Assume same font or default
                        fontFamily: (profile.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim(),
                     }
                  },
                  // Cards defaults remain from constant unless we want to infer from legacy styles
               }
            }

            setFullThemeConfig(configToUse)
            const { data: prod } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)
            setProducts(prod || [])
        }
        setLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  if (loading) return <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest">Cargando...</div>

  // Mapear el nuevo objeto `theme` para que CatalogoInteractivo lo entienda
  const previewShopData = {
      ...shopData,
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
                        products={products as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        shop={previewShopData as any}
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
