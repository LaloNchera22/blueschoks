"use client"

import { useState, useMemo, useEffect } from "react"
// Importamos openCart del contexto
import { useCart } from "./cart-context"
import CartSidebar from "./cart-sidebar" 
import { Plus, Minus, ShoppingBag, Check, ArrowRight } from "lucide-react"

export default function CatalogoInteractivo({
    products,
    shop,
    onSelectElement,
    selectedElement
}: {
    products: any[],
    shop: any,
    onSelectElement?: (id: string | null) => void,
    selectedElement?: string | null
}) {
  // USAMOS EL CONTEXTO DIRECTAMENTE
  const { items, openCart, addToCart } = useCart() 
  const [isClient, setIsClient] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  // Totales (ahora vienen del contexto, pero los calculamos aquí para UI local si quieres)
  const totalItems = items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  // LOGICA DE FUENTES
  const fontValue = shop.design_font || 'Inter, sans-serif';
  const fontName = fontValue.split(',')[0].replace(/['"]/g, '').trim();
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;700;900&display=swap`;
  const bgColor = shop.design_bg_color || "#ffffff"
  const textColor = shop.design_title_color || "#000000"

  return (
    <>
      <style jsx global>{`@import url('${googleFontUrl}');`}</style>

      {/* RENDERIZAMOS EL SIDEBAR */}
      <CartSidebar shop={shop} />

      <div 
          className="min-h-screen pb-32 relative transition-all duration-500"
          style={{ backgroundColor: bgColor, color: textColor, fontFamily: fontValue }}
      >
          {/* HEADER */}
          <header className="sticky top-0 z-30 backdrop-blur-md h-16 flex items-center border-b border-black/5" style={{ backgroundColor: `${bgColor}cc` }}>
              <div className="max-w-6xl mx-auto w-full px-4 flex justify-between items-center">
                  <h1 className="font-bold uppercase tracking-widest text-sm truncate">{shop.shop_name}</h1>
                  
                  {/* BOTÓN HEADER - AHORA USA openCart() */}
                  <button onClick={openCart} className="relative p-2 hover:opacity-70 transition-opacity">
                      <ShoppingBag size={20} />
                      {totalItems > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                  </button>
              </div>
          </header>

          {/* CATALOGO */}
          <main className="max-w-6xl mx-auto px-4 py-8" onClick={(e) => {
               // Si se hace clic en el fondo blanco del main, deseleccionar
               if (e.target === e.currentTarget) onSelectElement?.(null)
          }}>
              <div className="text-center mb-12 flex flex-col items-center gap-2">
                  <h2
                    className={`
                        text-4xl md:text-5xl font-black leading-tight cursor-pointer transition-all duration-200 border-2 rounded-lg p-2
                        ${selectedElement === 'title'
                            ? 'border-blue-500 bg-blue-50/10 ring-4 ring-blue-500/20'
                            : 'border-transparent hover:border-dashed hover:border-slate-300'
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelectElement?.('title')
                    }}
                  >
                      {shop.design_title_text || "Colección"}
                  </h2>
                  <p
                    className={`
                        opacity-75 text-sm md:text-base cursor-pointer transition-all duration-200 border-2 rounded-lg p-2
                        ${selectedElement === 'subtitle'
                            ? 'border-blue-500 bg-blue-50/10 ring-4 ring-blue-500/20'
                            : 'border-transparent hover:border-dashed hover:border-slate-300'
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelectElement?.('subtitle')
                    }}
                  >
                      {shop.design_subtitle_text}
                  </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products?.map((product) => (
                      <TarjetaPersonalizable key={product.id} product={product} design={shop} />
                  ))}
              </div>
          </main>

          {/* --- BOTÓN FLOTANTE FINAL (SIN TRUCOS) --- */}
          {totalItems > 0 && (
             <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <button
                    onClick={openCart} // <--- CLIC DIRECTO AL CONTEXTO
                    className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 px-6 py-3.5 rounded-full"
                    style={{ backgroundColor: textColor, color: bgColor }}
                >
                    <div className="relative">
                        <ShoppingBag size={20} fill="currentColor" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {totalItems}
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase font-bold tracking-widest leading-none opacity-80">Ir a Pagar</span>
                        <span className="text-xs font-black leading-none mt-1">Ver mi pedido</span>
                    </div>

                    <div className="bg-white/20 p-1.5 rounded-full ml-2">
                        <ArrowRight size={14} />
                    </div>
                </button>
             </div>
          )}

      </div>
    </>
  )
}

function TarjetaPersonalizable({ product, design }: { product: any, design: any }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    for(let i=0; i<quantity; i++) addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
    setQuantity(1)
  }

  const borderColor = design.design_card_style === 'border' ? 'border border-current opacity-20' : 'border-transparent'
  const shadowClass = design.design_card_style === 'shadow' ? 'shadow-lg bg-white' : ''
  const textColor = design.design_title_color || "#000000"

  return (
    <div className={`group rounded-2xl overflow-hidden transition-all ${shadowClass} ${borderColor}`}>
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
            {product.image_url ? (
                <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name}/>
            ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag size={32}/></div>
            )}
        </div>
        
        <div className="p-4">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-sm uppercase leading-snug line-clamp-2">{product.name}</h3>
                <span className="font-black text-lg">${product.price}</span>
            </div>
            
            <div className="flex gap-2 h-10">
                <div className="flex items-center border border-current/20 rounded-lg px-2 w-24">
                    <button onClick={()=>setQuantity(q=>Math.max(1, q-1))} className="w-8 flex justify-center"><Minus size={14}/></button>
                    <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                    <button onClick={()=>setQuantity(q=>q+1)} className="w-8 flex justify-center"><Plus size={14}/></button>
                </div>
                <button 
                    onClick={handleAdd}
                    className="flex-1 bg-current text-white/90 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: textColor, color: design.design_bg_color || 'white' }}
                >
                    {isAdded ? <Check size={16}/> : "Agregar"}
                </button>
            </div>
        </div>
    </div>
  )
}