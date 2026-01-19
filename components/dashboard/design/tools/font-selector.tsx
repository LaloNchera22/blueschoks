import { Type, Check } from "lucide-react"

// LISTA AMPLIADA ESTILO CANVA (20+ Fuentes Populares)
export const fonts = [
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

interface FontSelectorProps {
    currentFont: string
    path: string
    label?: string
    updateThemeConfig: (path: string, value: any) => void
    activeFontField: string | null
    setActiveFontField: (path: string | null) => void
    showFontMenu: boolean
    setShowFontMenu: (show: boolean) => void
}

export const FontSelector = ({ currentFont, path, label, updateThemeConfig, activeFontField, setActiveFontField, showFontMenu, setShowFontMenu }: FontSelectorProps) => (
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

export default FontSelector;
