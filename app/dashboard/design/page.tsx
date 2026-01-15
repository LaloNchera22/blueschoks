"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import FloatingDesignEditor from "@/components/FloatingDesignEditor"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"

export default function DesignPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [shopData, setShopData] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  // Store global del editor
  const { design, setDesign, isSaving, setIsSaving } = useEditorStore()

  useEffect(() => {
    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) return

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        
        if(profile) {
            setIsPro(profile.is_pro || false)
            setShopData(profile)
            // Sincronizar store con DB
            setDesign({
                bg_color: profile.design_bg_color,
                title_text: profile.design_title_text,
                subtitle_text: profile.design_subtitle_text,
                title_color: profile.design_title_color,
                font: profile.design_font,
                card_style: profile.design_card_style
            })
            const { data: prod } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)
            setProducts(prod || [])
        }
        setLoading(false)
    }
    loadData()
  }, [setDesign])

  const handleSave = async () => {
    if (!isPro) return
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        await supabase.from('profiles').update({
            design_bg_color: design.bg_color,
            design_title_text: design.title_text,
            design_subtitle_text: design.subtitle_text,
            design_title_color: design.title_color,
            design_font: design.font,
            design_card_style: design.card_style
        }).eq('id', user.id)
    }
    setTimeout(() => setIsSaving(false), 1000)
  }

  if (loading) return <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest">Cargando...</div>

  // Combinamos los datos del perfil con el diseño actual del store para la preview
  const previewShopData = {
      ...shopData,
      design_bg_color: design.bg_color,
      design_title_text: design.title_text,
      design_subtitle_text: design.subtitle_text,
      design_title_color: design.title_color,
      design_font: design.font,
      design_card_style: design.card_style
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
                        products={products}
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