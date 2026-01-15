"use client"

import { useState, useEffect, useRef } from "react"
import { X, Check, Loader2, AlignLeft, AlignCenter, AlignRight, Type, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditorStore } from "@/hooks/useEditorStore"

// LISTA AMPLIADA ESTILO CANVA (20+ Fuentes Populares)
const canvaFonts = [
  // SANS SERIF (Modernas)
  { name: 'Inter', value: 'Inter, sans-serif', category: 'Moderna' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Geométrica' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Legible' },
  { name: 'Lato', value: 'Lato, sans-serif', category: 'Redonda' },
  { name: 'Roboto', value: 'Roboto, sans-serif', category: 'Estándar' },
  { name: 'Oswald', value: 'Oswald, sans-serif', category: 'Alta/Fuerte' },
  
  // SERIF (Elegantes)
  { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Lujo' },
  { name: 'Merriweather', value: 'Merriweather, serif', category: 'Editorial' },
  { name: 'Lora', value: 'Lora, serif', category: 'Clásica' },
  { name: 'Bodoni Moda', value: 'Bodoni Moda, serif', category: 'Fashion' },
  
  // CREATIVAS / DISPLAY
  { name: 'Bebas Neue', value: 'Bebas Neue, sans-serif', category: 'Impacto' },
  { name: 'Abril Fatface', value: 'Abril Fatface, cursive', category: 'Bold' },
  { name: 'Righteous', value: 'Righteous, cursive', category: 'Futurista' },
  
  // MANUSCRITAS (Script)
  { name: 'Dancing Script', value: 'Dancing Script, cursive', category: 'Romántica' },
  { name: 'Pacifico', value: 'Pacifico, cursive', category: 'Relax' },
  { name: 'Satisfy', value: 'Satisfy, cursive', category: 'Firma' },
  
  // CLÁSICAS WEB
  { name: 'Arial', value: 'Arial, sans-serif', category: 'Básica' },
  { name: 'Courier New', value: 'Courier New, monospace', category: 'Máquina' },
  { name: 'Times New Roman', value: 'Times New Roman, serif', category: 'Formal' },
]

interface EditorProps {
  // Las props antiguas se mantienen por compatibilidad, pero usaremos el store principalmente
  design?: Record<string, unknown>
  setDesign?: (design: Record<string, unknown>) => void
  onSave?: () => void
  saving?: boolean
  isPro?: boolean
}

export default function FloatingDesignEditor({
  design: initialDesign,
  setDesign: setInitialDesign,
  onSave: externalOnSave,
  saving: externalSaving,
  isPro = false
}: EditorProps) {

  const { design, setDesign, selectedElement, setSelectedElement, isSaving, setIsSaving } = useEditorStore()
  
  // Sincronizar estado inicial si es necesario (solo una vez)
  useEffect(() => {
    if (initialDesign) {
      setDesign(initialDesign)
    }
  }, [initialDesign, setDesign])

  // Sincronizar hacia arriba cuando cambia el store (para mantener compatibilidad con page.tsx)
  useEffect(() => {
    if (setInitialDesign) {
      setInitialDesign(design)
    }
  }, [design, setInitialDesign])

  const [showSuccess, setShowSuccess] = useState(false)
  const prevSavingRef = useRef(isSaving)
  const [showFontMenu, setShowFontMenu] = useState(false)

  // Guardar real
  const handleSave = async () => {
     if (externalOnSave) {
        externalOnSave()
     } else {
        // Fallback save logic if needed
     }
  }

  // Detectar cambio de saving externo
  useEffect(() => {
     if(externalSaving !== undefined) setIsSaving(externalSaving)
  }, [externalSaving, setIsSaving])

  useEffect(() => {
    if (prevSavingRef.current === true && isSaving === false) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowSuccess(true)
        const timer = setTimeout(() => setShowSuccess(false), 3000)
        return () => clearTimeout(timer)
    }
    prevSavingRef.current = isSaving
  }, [isSaving])

  // Renderizar herramienta según contexto
  const renderTools = () => {
    // A. MODO TEXTO (Título o Subtítulo)
    if (selectedElement.startsWith('text')) {
       return (
          <div className="flex items-center gap-2 h-full">

             {/* 1. Selector de Fuente */}
             <div className="relative">
                <button
                  onClick={() => setShowFontMenu(!showFontMenu)}
                  className="h-10 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 border border-slate-200 min-w-[140px] justify-between transition-colors"
                >
                   <span className="text-sm font-medium truncate max-w-[100px]">{canvaFonts.find(f => f.value === design.font)?.name || 'Fuente'}</span>
                   <Type size={14} className="opacity-50" />
                </button>

                {showFontMenu && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto p-2 grid gap-1 z-50">
                        {canvaFonts.map((f) => (
                           <button
                              key={f.name}
                              onClick={() => {
                                  setDesign({ font: f.value })
                                  setShowFontMenu(false)
                              }}
                              className={`text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors flex justify-between items-center ${design.font === f.value ? 'bg-slate-900 text-white hover:bg-slate-800' : ''}`}
                           >
                              <span style={{ fontFamily: f.value }}>{f.name}</span>
                              {design.font === f.value && <Check size={12} />}
                           </button>
                        ))}
                    </div>
                )}
             </div>

             <div className="w-px h-6 bg-slate-200 mx-1"></div>

             {/* 2. Input Texto Directo */}
             <input
                value={selectedElement === 'text:title' ? design.title_text : design.subtitle_text}
                onChange={(e) => selectedElement === 'text:title' ? setDesign({ title_text: e.target.value }) : setDesign({ subtitle_text: e.target.value })}
                className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Escribe aquí..."
             />

             <div className="w-px h-6 bg-slate-200 mx-1"></div>

             {/* 3. Color Texto */}
             <div className="relative group">
                <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden">
                    <div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: design.title_color }}></div>
                    <input
                        type="color"
                        value={design.title_color}
                        onChange={(e) => setDesign({ title_color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Color
                </span>
             </div>

             {/* 4. Alineación (Simulada por ahora, ya que el diseño es centrado por defecto) */}
             <div className="flex bg-slate-50 rounded-xl border border-slate-200 p-1">
                 <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-900"><AlignLeft size={16}/></button>
                 <button className="p-1.5 bg-white shadow-sm rounded-lg text-slate-900"><AlignCenter size={16}/></button>
                 <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-900"><AlignRight size={16}/></button>
             </div>
          </div>
       )
    }

    // B. MODO GLOBAL (Default)
    return (
        <div className="flex items-center gap-4 h-full">

             {/* 1. Fondo Mágico (Color BG) */}
             <div className="flex flex-col items-center gap-1 group cursor-pointer relative">
                 <div className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm flex items-center justify-center relative overflow-hidden hover:scale-105 transition-transform bg-white">
                    <div className="w-full h-full absolute inset-0 opacity-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="w-6 h-6 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: design.bg_color }}></div>
                    <input
                        type="color"
                        value={design.bg_color}
                        onChange={(e) => setDesign({ bg_color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                 </div>
                 <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">Fondo</span>
             </div>

             <div className="w-px h-8 bg-slate-100"></div>

             {/* 2. Estilo Tarjetas */}
             <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-100">
                {[
                    { id: 'minimal', label: 'Minimal' },
                    { id: 'border', label: 'Borde' },
                    { id: 'shadow', label: 'Sombra' },
                ].map((style) => (
                    <button
                        key={style.id}
                        onClick={() => setDesign({ card_style: style.id })}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${
                            design.card_style === style.id
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {style.label}
                    </button>
                ))}
             </div>

             <div className="w-px h-8 bg-slate-100"></div>

             {/* 3. Posición / Layout (Placeholder) */}
             <button className="flex flex-col items-center gap-1 group">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400 group-hover:text-slate-900">
                     <Move size={18} />
                 </div>
                 <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">Layout</span>
             </button>
        </div>
    )
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4 pointer-events-none">

       {/* BARRA FLOTANTE (ISLA) */}
       <div className="bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-2xl p-2 pl-4 pr-2 flex items-center justify-between pointer-events-auto border border-white/50 backdrop-blur-sm animate-in slide-in-from-bottom-6 duration-500 max-w-3xl w-auto mx-auto ring-1 ring-black/5">

            {/* ZONA DE HERRAMIENTAS (DINÁMICA) */}
            <div className="flex items-center mr-6">
                {renderTools()}
            </div>

            {/* ZONA DE ACCIONES (GUARDAR / CERRAR) */}
            <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                 {selectedElement !== 'global' && (
                     <Button
                        onClick={() => {
                            setSelectedElement('global')
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
       {selectedElement !== 'global' && (
           <div className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg pointer-events-auto animate-in fade-in zoom-in duration-300">
               Editando: {selectedElement.replace('text:', '').toUpperCase()}
           </div>
       )}

    </div>
  )
}
