"use client"

import { useState, useEffect, useRef } from "react"
import { X, Check, Loader2, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditorStore } from "@/hooks/useEditorStore"
import dynamic from "next/dynamic"

// Dynamic Imports for heavier or interactive tools
const FontSelector = dynamic(() => import("@/components/dashboard/design/tools/font-selector"), {
    loading: () => <div className="h-9 w-32 bg-slate-100 rounded animate-pulse" />
})
const ColorSelector = dynamic(() => import("@/components/dashboard/design/tools/color-selector"), {
    loading: () => <div className="h-9 w-9 bg-slate-100 rounded animate-pulse" />
})
const SizeSelector = dynamic(() => import("@/components/dashboard/design/tools/size-selector"), {
    loading: () => <div className="h-9 w-24 bg-slate-100 rounded animate-pulse" />
})
const SocialLinksTool = dynamic(() => import("@/components/dashboard/design/social-links-tool"), {
    loading: () => <div className="h-10 flex items-center px-4 text-xs text-slate-400 animate-pulse">Cargando herramientas sociales...</div>
})

interface EditorProps {
  onSave?: () => void
  saving?: boolean
  isPro?: boolean
}

export default function FloatingDesignEditor({
  onSave: externalOnSave,
  saving: externalSaving,
  isPro = false
}: EditorProps) {

  const { theme, updateThemeConfig, selectedComponent, setSelectedComponent, isSaving, setIsSaving } = useEditorStore()
  
  const [showSuccess, setShowSuccess] = useState(false)
  const prevSavingRef = useRef(isSaving)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [activeFontField, setActiveFontField] = useState<string | null>(null)

  // Guardar real
  const handleSave = async () => {
     if (externalOnSave) {
        externalOnSave()
     }
  }

  // Detectar cambio de saving externo
  useEffect(() => {
     if(externalSaving !== undefined) setIsSaving(externalSaving)
  }, [externalSaving, setIsSaving])

  useEffect(() => {
    if (prevSavingRef.current === true && isSaving === false) {
        setShowSuccess(true)
        const timer = setTimeout(() => setShowSuccess(false), 3000)
        return () => clearTimeout(timer)
    }
    prevSavingRef.current = isSaving
  }, [isSaving])

  // Common Props for Selectors
  const commonSelectorProps = {
      updateThemeConfig,
      activeFontField,
      setActiveFontField,
      showFontMenu,
      setShowFontMenu
  }

  // Renderizar herramienta según contexto
  const renderTools = () => {
    switch (selectedComponent) {
        case 'header_title':
            return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <FontSelector currentFont={theme.header.title.fontFamily} path="header.title.fontFamily" {...commonSelectorProps} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <ColorSelector color={theme.header.title.color} path="header.title.color" label="Color" updateThemeConfig={updateThemeConfig} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <SizeSelector size={theme.header.title.fontSize} path="header.title.fontSize" updateThemeConfig={updateThemeConfig} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <button
                        onClick={() => updateThemeConfig('header.title.bold', !theme.header.title.bold)}
                        className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors font-bold ${theme.header.title.bold ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
                    >B</button>
                </div>
            )

        case 'header_subtitle':
        case 'header_bio': // Comparten lógica similar
             const isBio = selectedComponent === 'header_bio'
             const pathPrefix = isBio ? 'header.bio' : 'header.subtitle'
             const currentConfig = isBio ? theme.header.bio : theme.header.subtitle

             return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <FontSelector currentFont={currentConfig.fontFamily} path={`${pathPrefix}.fontFamily`} {...commonSelectorProps} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <ColorSelector color={currentConfig.color} path={`${pathPrefix}.color`} label="Color" updateThemeConfig={updateThemeConfig} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <SizeSelector size={currentConfig.fontSize} path={`${pathPrefix}.fontSize`} updateThemeConfig={updateThemeConfig} />
                </div>
             )

        case 'header_social':
             return <SocialLinksTool />

        case 'card_title':
            return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <FontSelector currentFont={theme.cards.productTitle.fontFamily} path="cards.productTitle.fontFamily" label="Fuente" {...commonSelectorProps} />
                    <ColorSelector color={theme.cards.productTitle.color} path="cards.productTitle.color" label="Color" updateThemeConfig={updateThemeConfig} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <button
                        onClick={() => updateThemeConfig('cards.productTitle.fontWeight', theme.cards.productTitle.fontWeight === 'bold' ? 'normal' : 'bold')}
                        className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors font-bold ${theme.cards.productTitle.fontWeight !== 'normal' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
                    >B</button>
                </div>
            )

        case 'card_price':
            return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <FontSelector currentFont={theme.cards.productPrice.fontFamily} path="cards.productPrice.fontFamily" label="Fuente" {...commonSelectorProps} />
                    <ColorSelector color={theme.cards.productPrice.color} path="cards.productPrice.color" label="Color" updateThemeConfig={updateThemeConfig} />
                </div>
            )

        case 'card_qty':
             return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <ColorSelector color={theme.cards.quantitySelector.bgColor} path="cards.quantitySelector.bgColor" label="Fondo" updateThemeConfig={updateThemeConfig} />
                    <ColorSelector color={theme.cards.quantitySelector.textColor} path="cards.quantitySelector.textColor" label="Texto" updateThemeConfig={updateThemeConfig} />
                    <ColorSelector color={theme.cards.quantitySelector.borderColor} path="cards.quantitySelector.borderColor" label="Borde" updateThemeConfig={updateThemeConfig} />
                </div>
             )

        case 'card_add_btn':
             return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <ColorSelector color={theme.cards.addButton.bgColor} path="cards.addButton.bgColor" label="Fondo" updateThemeConfig={updateThemeConfig} />
                    <ColorSelector color={theme.cards.addButton.iconColor} path="cards.addButton.iconColor" label="Icono" updateThemeConfig={updateThemeConfig} />
                    <div className="w-px h-6 bg-slate-200"></div>
                     <div className="flex gap-1">
                        {['circle', 'rounded', 'square'].map(shape => (
                            <button
                                key={shape}
                                onClick={() => updateThemeConfig('cards.addButton.shape', shape)}
                                className={`w-8 h-8 flex items-center justify-center border transition-all ${theme.cards.addButton.shape === shape ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
                                style={{ borderRadius: shape === 'circle' ? '9999px' : shape === 'square' ? '4px' : '10px'}}
                            >
                                <Box size={14} />
                            </button>
                        ))}
                     </div>
                </div>
             )

        case 'product_card':
             return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2 overflow-x-auto pr-4 no-scrollbar">
                    {/* Background Card */}
                    <div className="flex items-center gap-2">
                        <ColorSelector color={theme.cards.background} path="cards.background" label="Fondo" updateThemeConfig={updateThemeConfig} />
                    </div>

                    <div className="w-px h-6 bg-slate-200"></div>

                    {/* Borde Toggle */}
                    <button
                        onClick={() => updateThemeConfig('cards.border', !theme.cards.border)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all ${theme.cards.border ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'}`}
                    >
                        Borde
                    </button>

                    <div className="w-px h-6 bg-slate-200"></div>

                    <span className="text-xs text-slate-400 italic px-2">Selecciona un elemento interno para editar</span>
                </div>
             )

        case 'global_bg':
        default:
            return (
                <div className="flex items-center gap-4 h-full animate-in fade-in slide-in-from-bottom-2">
                     <div className="flex flex-col items-center gap-1 group cursor-pointer relative">
                         <div className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm flex items-center justify-center relative overflow-hidden hover:scale-105 transition-transform bg-white">
                            {theme.global.backgroundType === 'image' && <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${theme.global.backgroundValue})`}}></div>}
                            <div className="w-6 h-6 rounded-full shadow-inner border border-black/5 relative z-10" style={{ backgroundColor: theme.global.backgroundType === 'solid' ? theme.global.backgroundValue : 'transparent' }}></div>

                            {/* Simple color picker for solid mode fallback */}
                            <input
                                type="color"
                                value={theme.global.backgroundType === 'solid' ? theme.global.backgroundValue : '#ffffff'}
                                onChange={(e) => {
                                    updateThemeConfig('global.backgroundType', 'solid')
                                    updateThemeConfig('global.backgroundValue', e.target.value)
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                            />
                         </div>
                         <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">Fondo</span>
                     </div>
                </div>
            )
    }
  }

  // Nombre legible del componente seleccionado
  const getSelectedLabel = () => {
      switch(selectedComponent) {
          case 'header_title': return 'Título';
          case 'header_subtitle': return 'Subtítulo';
          case 'header_bio': return 'Biografía';
          case 'header_social': return 'Redes Sociales';
          case 'product_card': return 'Tarjeta';
          case 'card_title': return 'Título Prod.';
          case 'card_price': return 'Precio';
          case 'card_qty': return 'Selector Cant.';
          case 'card_add_btn': return 'Botón Agregar';
          case 'global_bg': return 'Global';
          default: return '';
      }
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4 pointer-events-none">

       {/* BARRA FLOTANTE (ISLA) */}
       <div className="bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-2xl p-2 pl-4 pr-2 flex items-center justify-between pointer-events-auto border border-white/50 backdrop-blur-sm animate-in slide-in-from-bottom-6 duration-500 max-w-4xl w-auto mx-auto ring-1 ring-black/5">

            {/* ZONA DE HERRAMIENTAS (DINÁMICA) */}
            <div className="flex items-center mr-6 h-10">
                {renderTools()}
            </div>

            {/* ZONA DE ACCIONES (GUARDAR / CERRAR) */}
            <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                 {selectedComponent !== 'global_bg' && (
                     <Button
                        onClick={() => {
                            setSelectedComponent('global_bg')
                            setShowFontMenu(false)
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
                     >
                        <X size={18} />
                     </Button>
                 )}

                 <Button
                    onClick={handleSave}
                    disabled={isSaving || !isPro}
                    className={`h-10 rounded-xl px-5 font-bold text-xs uppercase tracking-widest transition-all ${
                        showSuccess ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-slate-900 hover:bg-black text-white'
                    }`}
                 >
                    {isSaving ? <Loader2 size={16} className="animate-spin"/> : showSuccess ? <Check size={18}/> : "Guardar"}
                 </Button>
            </div>
       </div>

       {/* INDICADOR DE CONTEXTO */}
       {selectedComponent !== 'global_bg' && (
           <div className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg pointer-events-auto animate-in fade-in zoom-in duration-300">
               Editando: {getSelectedLabel()}
           </div>
       )}

    </div>
  )
}
