"use client"

import { useState, useEffect, useRef } from "react"
import { Palette, X, Type, LayoutTemplate, Lock, Save, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

// LISTA AMPLIADA ESTILO CANVA (20+ Fuentes Populares)
export const canvaFonts = [
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
  design: any
  setDesign: (design: any) => void
  onSave: () => void
  saving: boolean
  isPro: boolean
}

export default function FloatingDesignEditor({ design, setDesign, onSave, saving, isPro }: EditorProps) {
  const [isOpen, setIsOpen] = useState(false) // Ahora isOpen controla si la barra está expandida o colapsada
  const [showSuccess, setShowSuccess] = useState(false)
  const prevSavingRef = useRef(saving)
  
  // ESTADO PARA EL MENÚ DESPLEGABLE DE FUENTES
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false)

  // TABS PARA LA BARRA INFERIOR
  const [activeTab, setActiveTab] = useState<'text' | 'font' | 'color' | 'style'>('text')

  useEffect(() => {
    if (prevSavingRef.current === true && saving === false) {
        setShowSuccess(true)
        const timer = setTimeout(() => setShowSuccess(false), 3000)
        return () => clearTimeout(timer)
    }
    prevSavingRef.current = saving
  }, [saving])

  // Encontrar el objeto de la fuente actual para mostrar su nombre
  const currentFontObj = canvaFonts.find(f => f.value === design.font) || canvaFonts[0]

  return (
    <>
      {/* 1. BOTÓN ACTIVADOR (Solo visible si no está abierto el panel) */}
      {!isOpen && (
        <div className="fixed bottom-8 right-8 z-40 animate-in slide-in-from-bottom-4">
            <button
            onClick={() => setIsOpen(true)}
            className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform flex items-center gap-3 border-4 border-white hover:bg-black"
            >
            <Palette size={20} />
            <span className="font-bold text-xs uppercase tracking-widest">Diseñar</span>
            </button>
        </div>
      )}

      {/* 2. BARRA INFERIOR (Bottom Bar) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[60] border-t border-gray-200 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: '50vh' }}
      >
            {/* A. HEADER BARRA */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-20">
                 <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                    {/* TABS DE NAVEGACIÓN */}
                    <button onClick={() => setActiveTab('text')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === 'text' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                        Textos
                    </button>
                    <button onClick={() => setActiveTab('font')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === 'font' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                        Tipografía
                    </button>
                    <button onClick={() => setActiveTab('color')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === 'color' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                        Colores
                    </button>
                    <button onClick={() => setActiveTab('style')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${activeTab === 'style' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                        Estilo
                    </button>
                 </div>

                 <div className="flex items-center gap-2">
                    {!isPro && <span className="hidden sm:inline-block text-[10px] text-amber-600 font-bold mr-2">Vista Previa (Plan Gratuito)</span>}
                    <Button
                        onClick={onSave}
                        disabled={saving || !isPro}
                        size="sm"
                        className={`h-9 px-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                            saving
                            ? '!bg-white !text-black border border-black cursor-wait'
                            : showSuccess
                                ? '!bg-green-600 !text-white hover:!bg-green-700'
                                : 'bg-slate-900 text-white hover:bg-black'
                        }`}
                    >
                        {saving ? (
                            <Loader2 size={14} className="animate-spin text-black" />
                        ) : showSuccess ? (
                            <Check size={16} />
                        ) : (
                            "Guardar"
                        )}
                    </Button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-slate-500 hover:text-black"
                    >
                        <ChevronDown size={20} />
                    </button>
                 </div>
            </div>

            {/* B. CONTENIDO (Horizontal Scrollable or Grid) */}
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar relative">
                
                {/* BLOQUEO PRO */}
                {!isPro && (
                    <div className="absolute inset-0 z-30 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 h-full">
                         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
                            <Lock size={24} className="text-amber-500 mb-2" strokeWidth={1.5} />
                            <h3 className="font-black text-sm mb-1 text-slate-900">Función Premium</h3>
                            <Button size="sm" className="mt-2 bg-slate-900 hover:bg-black text-white font-bold text-xs">
                                Desbloquear
                            </Button>
                        </div>
                    </div>
                )}

                {/* 1. TEXTOS */}
                {activeTab === 'text' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Título Principal</label>
                            <input 
                                value={design.title_text}
                                onChange={(e) => setDesign({...design, title_text: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Subtítulo</label>
                            <input 
                                value={design.subtitle_text}
                                onChange={(e) => setDesign({...design, subtitle_text: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                )}

                {/* 2. TIPOGRAFÍA */}
                {activeTab === 'font' && (
                    <div className="max-w-4xl mx-auto">
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {canvaFonts.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => setDesign({...design, font: font.value})}
                                        className={`px-3 py-2 text-left rounded-lg border transition-all flex items-center justify-between ${
                                            design.font === font.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div>
                                            <span style={{ fontFamily: font.value }} className="text-sm block truncate pr-2">
                                                {font.name}
                                            </span>
                                        </div>
                                        {design.font === font.value && <Check size={12} />}
                                    </button>
                                ))}
                         </div>
                    </div>
                )}

                {/* 3. COLORES */}
                {activeTab === 'color' && (
                    <div className="flex justify-center gap-8 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center gap-2">
                             <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm hover:scale-105 transition-transform">
                                <input
                                    type="color"
                                    value={design.bg_color}
                                    onChange={(e) => setDesign({...design, bg_color: e.target.value})}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-none"
                                />
                             </div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase">Fondo</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm hover:scale-105 transition-transform">
                                <input
                                    type="color"
                                    value={design.title_color}
                                    onChange={(e) => setDesign({...design, title_color: e.target.value})}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-none"
                                />
                             </div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase">Texto</span>
                        </div>
                    </div>
                )}

                {/* 4. TARJETAS */}
                {activeTab === 'style' && (
                    <div className="flex justify-center gap-4 max-w-4xl mx-auto">
                        {[
                            { id: 'minimal', label: 'Minimal' },
                            { id: 'border', label: 'Borde' },
                            { id: 'shadow', label: 'Sombra' },
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setDesign({...design, card_style: style.id})}
                                className={`px-6 py-3 text-xs font-bold uppercase rounded-xl border transition-all ${
                                    design.card_style === style.id 
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                                }`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
      </div>
    </>
  )
}
