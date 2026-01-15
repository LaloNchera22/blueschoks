"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import CatalogoInteractivo from "@/components/shop/CatalogoInteractivo"
import ContextualToolbar from "@/components/editor/ContextualToolbar"
import { CartProvider } from "@/components/shop/cart-context"
// import { useMediaQuery } from "@/hooks/use-media-query" // Removed assumed hook
import { Loader2, Check, Save } from "lucide-react"

export default function DesignPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [shopData, setShopData] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  // Selection State
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const [design, setDesign] = useState({
    bg_color: "#ffffff",
    title_text: "Colección",
    subtitle_text: "Nuevos lanzamientos disponibles",
    title_color: "#000000",
    font: "sans-serif", 
    card_style: "minimal"
  })

  // Mock media query if hook doesn't exist, we'll check validity later or implement simple check
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) return

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        
        if(profile) {
            setIsPro(profile.is_pro || false)
            setShopData(profile)
            setDesign(prev => ({
                ...prev,
                bg_color: profile.design_bg_color || prev.bg_color,
                title_text: profile.design_title_text || prev.title_text,
                subtitle_text: profile.design_subtitle_text || prev.subtitle_text,
                title_color: profile.design_title_color || prev.title_color,
                font: profile.design_font || prev.font,
                card_style: profile.design_card_style || prev.card_style
            }))
            const { data: prod } = await supabase.from('products').select('*').eq('user_id', profile.id).limit(6)
            setProducts(prod || [])
        }
        setLoading(false)
    }
    loadData()
  }, [])

  const handleSave = async () => {
    if (!isPro) return
    setSaving(true)
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
    setTimeout(() => setSaving(false), 1000)
  }

  if (loading) return <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest">Cargando...</div>

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
    // INFINITE CANVAS (100% Viewport)
    <div className="relative w-full h-[calc(100vh-64px)] md:h-screen bg-slate-100 overflow-hidden flex flex-col">
        
        {/* SAVE BUTTON (Sticky Top Right) */}
        <div className="absolute top-4 right-4 z-50">
            <button
                onClick={handleSave}
                disabled={saving || !isPro}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg transition-all
                    ${saving ? 'bg-white text-slate-900' : 'bg-slate-900 text-white hover:bg-black hover:scale-105'}
                `}
            >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{saving ? 'Guardando...' : 'Guardar'}</span>
            </button>
        </div>

        {/* CLICK OUTSIDE TO DESELECT */}
        <div
            className="flex-1 w-full relative overflow-y-auto custom-scrollbar"
            onClick={(e) => {
                // Si el clic fue directo en el fondo (no en un elemento interactivo), deseleccionar
                if (e.target === e.currentTarget) setSelectedElement(null)
            }}
        >
             <div className="min-h-full py-8 px-4 flex justify-center">
                <div
                    className="w-full max-w-[1400px] shadow-2xl rounded-xl overflow-hidden ring-1 ring-slate-900/5 transition-all duration-500 bg-white"
                    onClick={(e) => {
                         // Stop propagation if clicking on the frame but not an element
                         // actually we want clicking the frame background to act as deselect or "general select"
                         // We'll let `CatalogoInteractivo` handle specific clicks via the callback
                         // setSelectedElement(null) // Reset first, then child click overrides
                         // e.stopPropagation()
                    }}
                >
                    <CartProvider>
                        <CatalogoInteractivo
                            products={products}
                            shop={previewShopData}
                            onSelectElement={setSelectedElement}
                            selectedElement={selectedElement}
                            isEditorMode={true}
                        />
                    </CartProvider>
                </div>
             </div>
        </div>

        {/* CONTEXTUAL TOOLBAR (The Canva Bar) */}
        <ContextualToolbar
            selectedElement={selectedElement}
            design={design}
            setDesign={setDesign}
            onClose={() => setSelectedElement(null)}
            isMobile={isMobile}
        />
    </div>
  )
}
