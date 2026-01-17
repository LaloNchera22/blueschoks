"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import FloatingDesignEditor from "@/components/FloatingDesignEditor"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"
import { saveDesignConfig } from "@/app/dashboard/actions/design-actions"
import { DEFAULT_DESIGN_CONFIG, DesignConfig } from "@/lib/types/design-system"

export default function DesignPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [shopData, setShopData] = useState<Record<string, unknown> | null>(null)
  const [products, setProducts] = useState<unknown[]>([])

  // Store global del editor
  const { design, setFullConfig, setIsSaving } = useEditorStore()

  useEffect(() => {
    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) return

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        
        if(profile) {
            setIsPro(profile.is_pro || false)
            setShopData(profile)

            // Cargar configuración existente o migrar/usar default
            // Si design_config existe, lo usamos. Si no, mapeamos columnas viejas (Migración al vuelo)
            let configToUse = DEFAULT_DESIGN_CONFIG;

            if (profile.design_config) {
               configToUse = profile.design_config as DesignConfig;
            } else {
               // Fallback: Mapear columnas viejas a la nueva estructura si existen
               configToUse = {
                  ...DEFAULT_DESIGN_CONFIG,
                  global: {
                     ...DEFAULT_DESIGN_CONFIG.global,
                     backgroundColor: profile.design_bg_color || DEFAULT_DESIGN_CONFIG.global.backgroundColor,
                     font: profile.design_font || DEFAULT_DESIGN_CONFIG.global.font,
                  },
                  header: {
                     ...DEFAULT_DESIGN_CONFIG.header,
                     title: {
                        ...DEFAULT_DESIGN_CONFIG.header.title,
                        text: profile.design_title_text || DEFAULT_DESIGN_CONFIG.header.title.text,
                        color: profile.design_title_color || DEFAULT_DESIGN_CONFIG.header.title.color,
                     },
                     subtitle: {
                        ...DEFAULT_DESIGN_CONFIG.header.subtitle,
                        text: profile.design_subtitle_text || DEFAULT_DESIGN_CONFIG.header.subtitle.text,
                     }
                  },
                  cards: {
                    ...DEFAULT_DESIGN_CONFIG.cards,
                    globalDefaults: {
                        ...DEFAULT_DESIGN_CONFIG.cards.globalDefaults,
                        style: (profile.design_card_style as any) || DEFAULT_DESIGN_CONFIG.cards.globalDefaults.style
                    }
                  }
               }
            }

            setFullConfig(configToUse)
            const { data: prod } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)
            setProducts(prod || [])
        }
        setLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFullConfig])

  const handleSave = async () => {
    if (!isPro) return
    setIsSaving(true)
    
    // Guardar usando la Server Action
    const result = await saveDesignConfig(design)

    if (!result.success) {
        // Manejar error visualmente si es necesario
        console.error("Failed to save")
    }

    setTimeout(() => setIsSaving(false), 1000)
  }

  if (loading) return <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest">Cargando...</div>

  // Mapear el nuevo objeto `design` a las props viejas que espera CatalogoInteractivo temporalmente
  // O idealmente actualizar CatalogoInteractivo para aceptar `design_config`.
  // Por ahora hacemos un adaptador para compatibilidad visual inmediata.
  const previewShopData = {
      ...shopData,
      design_config: design, // Pasamos el config completo
      // Mantenemos compatibilidad hacia atrás
      design_bg_color: design.global.backgroundColor,
      design_title_text: design.header.title.text,
      design_subtitle_text: design.header.subtitle.text,
      design_title_color: design.header.title.color,
      design_font: design.global.font,
      design_card_style: design.cards.globalDefaults.style
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