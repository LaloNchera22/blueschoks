"use client"

import { useState } from "react"
import { HelpCircle, X, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"

export default function BotonAyuda() {
  const [isOpen, setIsOpen] = useState(false)
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const faqs = [
    { 
      id: 1, 
      q: "¿Cómo agrego un nuevo producto?", 
      a: "Ve a la sección 'Mis Productos' en el menú lateral y haz clic en el botón negro '+ Nuevo Producto' situado en la esquina superior derecha." 
    },
    { 
      id: 2, 
      q: "¿Cómo comparto mi tienda?", 
      a: "En el menú lateral, justo debajo de tu nombre, encontrarás un botón llamado 'Copiar Enlace'. Al pulsarlo, tendrás el link listo para enviar." 
    },
    { 
      id: 3, 
      q: "¿Puedo personalizar los colores?", 
      a: "Sí. Dirígete a 'Configuración' para ajustar el logo, los colores y la información visible de tu tienda." 
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
      
      {/* --- VENTANA DE AYUDA (MODAL) --- */}
      <div 
        className={`w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right transform ${
          isOpen 
          ? "opacity-100 scale-100 translate-y-0" 
          : "opacity-0 scale-95 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header Negro */}
        <div className="bg-black p-5 flex justify-between items-start text-white">
            <div>
                <h3 className="font-bold text-lg leading-tight">Centro de Ayuda</h3>
                <p className="text-gray-400 text-xs mt-1">Resolvemos tus dudas al instante.</p>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
                <X size={16} />
            </button>
        </div>

        {/* Lista de Preguntas */}
        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-100 last:border-0">
                    <button 
                        onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors group"
                    >
                        <span className={`text-sm font-bold transition-colors ${openQuestion === faq.id ? 'text-black' : 'text-slate-700'}`}>
                            {faq.q}
                        </span>
                        
                        {/* FLECHAS NEGRAS */}
                        {openQuestion === faq.id ? (
                            <ChevronUp size={18} className="text-black shrink-0" />
                        ) : (
                            <ChevronDown size={18} className="text-black shrink-0" />
                        )}
                    </button>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openQuestion === faq.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed font-medium">
                            {faq.a}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
            <a 
                href="https://wa.me/5211234567890" 
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-black text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide shadow-md hover:bg-gray-900 hover:shadow-lg transition-all"
            >
                <MessageCircle size={16} /> 
                <span>Contactar Soporte</span>
            </a>
        </div>
      </div>

      {/* --- BOTÓN FLOTANTE (FORZADO A NEGRO) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        // ESTA LÍNEA OBLIGA AL BOTÓN A SER NEGRO PASE LO QUE PASE
        style={{ backgroundColor: isOpen ? '#ffffff' : '#000000', color: isOpen ? '#000000' : '#ffffff' }}
        className={`w-14 h-14 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-[9999] ${
            isOpen ? "border-2 border-black rotate-90" : "border-none"
        }`}
      >
        {isOpen ? (
            <X size={24} strokeWidth={2.5} />
        ) : (
            <HelpCircle size={32} strokeWidth={2} />
        )}
      </button>

    </div>
  )
}