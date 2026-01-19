"use client"

import { useEffect, useState, useMemo } from "react"
import { CartProvider } from "@/components/shop/cart-context"
import { useEditorStore } from "@/hooks/useEditorStore"
import { saveThemeConfig } from "@/app/dashboard/actions/design-actions"
import { ThemeConfig } from "@/lib/types/theme-config"
import { sanitizeThemeConfig } from "@/utils/theme-sanitizer" // IMPORT THE BRAIN
import dynamic from "next/dynamic"
import { Loader2, ExternalLink, Plus } from "lucide-react"

// Dynamic Import for the Editor Component
const FloatingDesignEditor = dynamic(() => import("@/components/FloatingDesignEditor"), {
  ssr: false,
  loading: () => null
})

// Dynamic Import for the Preview Component
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
  // 1. SANITIZATION AT THE GATE
  // We do not trust the prop blindly. We pass it through the sanitizer immediately.
  // This ensures that even if the server passed garbage, we work with a clean structure.
  const sanitizedConfig = useMemo(() => {
     return sanitizeThemeConfig(initialThemeConfig);
  }, [initialThemeConfig]);

  // Store global del editor
  const { theme, setFullThemeConfig, setIsSaving, updateThemeConfig } = useEditorStore()

  // Initialize store with CLEAN config
  useEffect(() => {
    setFullThemeConfig(sanitizedConfig)
  }, [sanitizedConfig, setFullThemeConfig])

  const handleSave = async () => {
    if (!isPro) return
    setIsSaving(true)

    // Save current state
    const result = await saveThemeConfig(theme)

    if (!result.success) {
        console.error("Failed to save")
    }

    setTimeout(() => setIsSaving(false), 1000)
  }

  // Helper to add first link if empty
  const handleAddFirstLink = () => {
      const newLink = {
        id: crypto.randomUUID(),
        platform: 'instagram',
        url: '',
        active: true,
        style: {
            backgroundColor: '#000000',
            iconColor: '#ffffff',
            borderRadius: 'full' as const
        }
      };
      // We know theme is valid because we sanitized it
      const currentLinks = Array.isArray(theme?.header?.socialLinks) ? theme.header.socialLinks : [];
      updateThemeConfig('header.socialLinks', [...currentLinks, newLink]);
  };

  // Safe Access for rendering
  const safeShopData = initialShopData || {};
  const previewShopData = {
      ...safeShopData,
      theme_config: theme,
  }

  // Check if social links are empty for the UI prompt
  const hasSocialLinks = Array.isArray(theme?.header?.socialLinks) && theme.header.socialLinks.length > 0;

  // URL Generation
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== 'undefined') {
        setOrigin(window.location.origin);
    }
  }, []);

  const shopSlug = safeShopData.slug || 'tienda-demo';
  const shopUrl = `${origin}/${shopSlug}`;

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">

        {/* SHOP LINK HEADER */}
        <div className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Tu Tienda</span>
                <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-900 hover:text-blue-600 truncate max-w-[150px] flex items-center gap-1">
                   {shopSlug}
                   <ExternalLink size={10} />
                </a>
            </div>
        </div>

        {/* VISTA PREVIA */}
        <div className="absolute inset-0 z-0 overflow-y-auto custom-scrollbar pb-32">
             <div className="min-h-full relative">
                <CartProvider>
                    {/* DEFENSIVE RENDERING: Check if products is array */}
                    <CatalogoInteractivo
                        products={Array.isArray(initialProducts) ? initialProducts : []}
                        shop={previewShopData}
                        isEditor={true}
                    />
                </CartProvider>
             </div>
        </div>

        {/* EMPTY STATE PROMPT FOR LINKS */}
        {!hasSocialLinks && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                <button
                    onClick={handleAddFirstLink}
                    className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                >
                    <Plus size={14} />
                    Añadir primer enlace
                </button>
            </div>
        )}

        {/* EDITOR */}
        <FloatingDesignEditor
            onSave={handleSave}
            isPro={isPro}
        />
    </div>
  )
}
