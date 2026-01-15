"use client"

import { useState, useEffect, useRef } from "react"
import { Palette, X, Type, LayoutTemplate, Lock, Save, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  design: any
  setDesign: (design: any) => void
  onSave: () => void
  saving: boolean
  isPro: boolean
}

export default function FloatingDesignEditor({ design, setDesign, onSave, saving, isPro }: EditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const prevSavingRef = useRef(saving)
  
  // ESTADO PARA EL MENÚ DESPLEGABLE DE FUENTES
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false)

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
      {/* 1. BOTÓN ACTIVADOR */}
      <div className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${isOpen ? 'translate-x-40 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform flex items-center gap-3 border-4 border-white hover:bg-black"
        >
          <Palette size={20} />
          <span className="font-bold text-xs uppercase tracking-widest">Diseñar</span>
        </button>
      </div>

      {/* 2. PANEL LATERAL */}
      <div 
        className={`fixed inset-y-0 right-0 w-[380px] bg-white shadow-2xl z-[60] border-l border-gray-200 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
            {/* A. HEADER */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-20">
                <div>
                    <h2 className="font-black text-sm uppercase tracking-wide flex items-center gap-2 text-slate-900">
                        <Palette size={18}/> Editor Visual
                    </h2>
                    {!isPro && <p className="text-[10px] text-amber-600 font-bold mt-1">Vista Previa (Plan Gratuito)</p>}
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-slate-500 hover:text-black"
                >
                    <X size={20} />
                </button>
            </div>

            {/* B. CONTENIDO */}
            <div className="flex-1 overflow-y-auto relative p-6 space-y-8 bg-white custom-scrollbar pb-32">
                
                {/* BLOQUEO PRO */}
                {!isPro && (
                    <div className="absolute inset-0 z-30 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 h-full">
                        <div className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 sticky top-1/4 w-full">
                            <Lock size={40} className="mx-auto text-amber-500 mb-4" strokeWidth={1.5} />
                            <h3 className="font-black text-lg mb-2 text-slate-900">Función Premium</h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Desbloquea todas las fuentes, colores ilimitados y estilos de tarjetas.</p>
                            <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg">
                                Desbloquear PRO
                            </Button>
                        </div>
                    </div>
                )}

                {/* 1. TEXTOS */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <Type size={12} /> Textos
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 uppercase mb-1.5 block">Título Principal</label>
                            <input 
                                value={design.title_text}
                                onChange={(e) => setDesign({...design, title_text: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 uppercase mb-1.5 block">Subtítulo</label>
                            <input 
                                value={design.subtitle_text}
                                onChange={(e) => setDesign({...design, subtitle_text: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. TIPOGRAFÍA (NUEVO SELECTOR ESTILO DROPDOWN) */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <Type size={12} /> Tipografía
                    </div>
                    
                    {/* CAJA SELECTORA */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                            className={`w-full flex items-center justify-between bg-white border rounded-xl px-4 py-3 text-left transition-all shadow-sm ${
                                isFontMenuOpen ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fuente Actual</span>
                                <span className="text-sm font-bold text-slate-900" style={{ fontFamily: currentFontObj.value }}>
                                    {currentFontObj.name}
                                </span>
                            </div>
                            {isFontMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {/* LISTA DESPLEGABLE (OVERLAY) */}
                        {isFontMenuOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-slate-50 animate-in fade-in slide-in-from-top-2">
                                {canvaFonts.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => {
                                            setDesign({...design, font: font.value})
                                            setIsFontMenuOpen(false)
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 transition-colors group ${
                                            design.font === font.value ? 'bg-slate-50' : ''
                                        }`}
                                    >
                                        <div>
                                            {/* Nombre en su propia fuente */}
                                            <span style={{ fontFamily: font.value }} className="text-base text-slate-800 block">
                                                {font.name}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                {font.category}
                                            </span>
                                        </div>
                                        {design.font === font.value && (
                                            <Check size={16} className="text-slate-900" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. COLORES */}
                <section>
                     <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <Palette size={12} /> Colores de Marca
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-slate-200 p-2 rounded-xl flex items-center gap-3 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                             <input 
                                type="color" 
                                value={design.bg_color} 
                                onChange={(e) => setDesign({...design, bg_color: e.target.value})} 
                                className="w-10 h-10 rounded-lg border-none p-0 bg-transparent cursor-pointer shrink-0"
                             />
                             <div className="flex flex-col overflow-hidden">
                                <span className="text-[11px] font-bold text-slate-700">Fondo</span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase truncate">{design.bg_color}</span>
                             </div>
                        </div>
                        <div className="border border-slate-200 p-2 rounded-xl flex items-center gap-3 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                             <input 
                                type="color" 
                                value={design.title_color} 
                                onChange={(e) => setDesign({...design, title_color: e.target.value})} 
                                className="w-10 h-10 rounded-lg border-none p-0 bg-transparent cursor-pointer shrink-0"
                             />
                             <div className="flex flex-col overflow-hidden">
                                <span className="text-[11px] font-bold text-slate-700">Texto</span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase truncate">{design.title_color}</span>
                             </div>
                        </div>
                    </div>
                </section>

                {/* 4. TARJETAS */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <LayoutTemplate size={12} /> Estilo Tarjetas
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'minimal', label: 'Minimal' },
                            { id: 'border', label: 'Borde' },
                            { id: 'shadow', label: 'Sombra' },
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setDesign({...design, card_style: style.id})}
                                className={`py-3 text-[10px] font-bold uppercase rounded-xl border transition-all ${
                                    design.card_style === style.id 
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                                }`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* C. FOOTER */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <Button 
                    onClick={onSave} 
                    disabled={saving || !isPro} 
                    className={`w-full h-14 text-sm font-black uppercase tracking-widest shadow-xl transition-all duration-300 border-2 ${
                        saving 
                        ? '!bg-white !text-black !border-black cursor-wait'
                        : showSuccess
                            ? '!bg-green-600 !text-white !border-green-600 hover:!bg-green-700'
                            : 'bg-slate-900 text-white border-slate-900 hover:bg-black'
                    }`}
                >
                    {saving ? (
                        <div className="flex items-center gap-3">
                            <Loader2 size={20} className="animate-spin text-black" /> 
                            <span>Guardando...</span>
                        </div>
                    ) : showSuccess ? (
                        <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                            <Check size={22} className="text-white" /> 
                            <span>¡Página Guardada!</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Save size={20} /> 
                            <span>Guardar Página</span>
                        </div>
                    )}
                </Button>
            </div>
      </div>
    </>
  )
}