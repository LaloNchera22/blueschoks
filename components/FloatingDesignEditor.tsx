"use client"

import { useState, useEffect, useRef } from "react"
import { X, Check, Loader2, Type, Move, Palette, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditorStore } from "@/hooks/useEditorStore"
import { ThemeConfig } from "@/lib/types/theme-config"

// LISTA AMPLIADA ESTILO CANVA (20+ Fuentes Populares)
const fonts = [
  // SANS SERIF (Modernas)
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif' },
  
  // SERIF (Elegantes)
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'Bodoni Moda', value: 'Bodoni Moda, serif' },
  
  // CREATIVAS / DISPLAY
  { name: 'Bebas Neue', value: 'Bebas Neue, sans-serif' },
  { name: 'Abril Fatface', value: 'Abril Fatface, cursive' },
  { name: 'Righteous', value: 'Righteous, cursive' },
  
  // MANUSCRITAS (Script)
  { name: 'Dancing Script', value: 'Dancing Script, cursive' },
  { name: 'Pacifico', value: 'Pacifico, cursive' },
  { name: 'Satisfy', value: 'Satisfy, cursive' },
  
  // CLÁSICAS WEB
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
]

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


  // COMPONENTES UI REUTILIZABLES

  const FontSelector = ({ currentFont, path, label }: { currentFont: string, path: string, label?: string }) => (
    <div className="relative">
        <button
          onClick={() => {
              setActiveFontField(path)
              setShowFontMenu(true)
          }}
          className="h-9 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center gap-2 border border-slate-200 min-w-[120px] justify-between transition-colors"
        >
           <div className="flex flex-col items-start overflow-hidden">
               {label && <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">{label}</span>}
               <span className="text-xs font-medium truncate max-w-[90px]">{fonts.find(f => f.value === currentFont)?.name || 'Fuente'}</span>
           </div>
           <Type size={12} className="opacity-50" />
        </button>

        {showFontMenu && activeFontField === path && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFontMenu(false)}></div>
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto p-1 grid gap-0.5 z-50">
                    {fonts.map((f) => (
                       <button
                          key={f.name}
                          onClick={() => {
                              updateThemeConfig(path, f.value)
                              setShowFontMenu(false)
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 transition-colors flex justify-between items-center ${currentFont === f.value ? 'bg-slate-900 text-white hover:bg-slate-800' : ''}`}
                       >
                          <span style={{ fontFamily: f.value }}>{f.name}</span>
                          {currentFont === f.value && <Check size={12} />}
                       </button>
                    ))}
                </div>
            </>
        )}
     </div>
  )

  const ColorSelector = ({ color, path, label }: { color: string, path: string, label?: string }) => (
    <div className="flex flex-col items-center gap-1 group relative">
        <div className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden">
            <div className="w-5 h-5 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: color }}></div>
            <input
                type="color"
                value={color}
                onChange={(e) => updateThemeConfig(path, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
        </div>
        {label && <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">{label}</span>}
    </div>
  )

  const SizeSelector = ({ size, path }: { size: string, path: string }) => {
     // Simplificación de tamaños
     const sizes = ['sm', 'base', 'lg', 'xl', '2xl', '3xl']
     const currentIndex = sizes.indexOf(size) >= 0 ? sizes.indexOf(size) : 1

     return (
        <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
             <button
                onClick={() => updateThemeConfig(path, sizes[Math.max(0, currentIndex - 1)])}
                className="w-6 h-8 flex items-center justify-center hover:bg-white rounded text-xs font-bold"
             >-</button>
             <span className="text-[10px] w-8 text-center uppercase">{size}</span>
             <button
                onClick={() => updateThemeConfig(path, sizes[Math.min(sizes.length - 1, currentIndex + 1)])}
                className="w-6 h-8 flex items-center justify-center hover:bg-white rounded text-xs font-bold"
             >+</button>
        </div>
     )
  }

  // Renderizar herramienta según contexto
  const renderTools = () => {
    switch (selectedComponent) {
        case 'header_title':
            return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2">
                    <FontSelector currentFont={theme.header.title.fontFamily} path="header.title.fontFamily" />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <ColorSelector color={theme.header.title.color} path="header.title.color" label="Color" />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <SizeSelector size={theme.header.title.fontSize} path="header.title.fontSize" />
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
                    <FontSelector currentFont={currentConfig.fontFamily} path={`${pathPrefix}.fontFamily`} />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <ColorSelector color={currentConfig.color} path={`${pathPrefix}.color`} label="Color" />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <SizeSelector size={currentConfig.fontSize} path={`${pathPrefix}.fontSize`} />
                </div>
             )

        case 'product_card':
             return (
                <div className="flex items-center gap-3 h-full animate-in fade-in slide-in-from-bottom-2 overflow-x-auto pr-4 no-scrollbar">
                    {/* Background Card */}
                    <div className="flex items-center gap-2">
                        <ColorSelector color={theme.cards.background} path="cards.background" label="Fondo" />
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

                    {/* Texto Producto */}
                    <FontSelector currentFont={theme.cards.productName.fontFamily} path="cards.productName.fontFamily" label="Fuente" />
                    <ColorSelector color={theme.cards.productName.color} path="cards.productName.color" label="Texto" />
                    <ColorSelector color={theme.cards.productPrice.color} path="cards.productPrice.color" label="Precio" />

                    <div className="w-px h-6 bg-slate-200"></div>

                    {/* Botón */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Botón</span>
                        <div className="flex gap-1">
                            <div className="w-6 h-6 rounded border cursor-pointer relative" style={{ backgroundColor: theme.cards.button.bg }}>
                                <input type="color" value={theme.cards.button.bg} onChange={(e) => updateThemeConfig('cards.button.bg', e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"/>
                            </div>
                            <div className="w-6 h-6 rounded border cursor-pointer relative flex items-center justify-center bg-gray-100">
                                <span className="text-[8px] font-bold" style={{ color: theme.cards.button.text }}>T</span>
                                <input type="color" value={theme.cards.button.text} onChange={(e) => updateThemeConfig('cards.button.text', e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"/>
                            </div>
                        </div>
                    </div>
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
          case 'product_card': return 'Tarjetas';
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
