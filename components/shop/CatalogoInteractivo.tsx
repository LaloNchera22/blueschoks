"use client"

import { useState, useMemo, useEffect } from "react"
// Importamos openCart del contexto
import { useCart } from "./cart-context"
import CartSidebar from "./cart-sidebar" 
import { Plus, Minus, ShoppingBag, Check, ArrowRight, Instagram, Facebook, Globe, Share2 } from "lucide-react"
import { useEditorStore } from "@/hooks/useEditorStore"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CatalogoInteractivo({ products, shop, isEditor = false }: { products: any[], shop: any, isEditor?: boolean }) {
  // USAMOS EL CONTEXTO DIRECTAMENTE
  const { items, openCart, addToCart } = useCart() 
  const { setSelectedElement, selectedElement } = useEditorStore()
  const [isClient, setIsClient] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
      setIsClient(true)
  }, [])

  useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Totales (ahora vienen del contexto, pero los calculamos aquí para UI local si quieres)
  const totalItems = items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  // LOGICA DE FUENTES
  const fontValue = shop.design_font || 'Inter, sans-serif';
  const fontName = fontValue.split(',')[0].replace(/['"]/g, '').trim();
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;700;900&display=swap`;
  const bgColor = shop.design_bg_color || "#ffffff"
  const textColor = shop.design_title_color || "#000000"

  // Handler para clicks en el editor
  const handleElementClick = (e: React.MouseEvent, type: 'global' | 'text:title' | 'text:subtitle') => {
    if (!isEditor) return
    e.stopPropagation() // Detener propagación para que no seleccione 'global' inmediatamente si hay un wrapper
    setSelectedElement(type)
  }

  // Helper para generar iniciales
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'TI'

  return (
    <>
      <style jsx global>{`@import url('${googleFontUrl}');`}</style>

      {/* RENDERIZAMOS EL SIDEBAR SOLO SI NO ES EDITOR */}
      {!isEditor && <CartSidebar shop={shop} />}

      <div 
          className="min-h-screen pb-32 relative transition-all duration-500"
          style={{ backgroundColor: bgColor, color: textColor, fontFamily: fontValue }}
          onClick={() => isEditor && setSelectedElement('global')}
      >
          {/* HEADER MEJORADO */}
          <header
            className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
            style={{ backgroundColor: scrolled ? `${bgColor}ee` : 'transparent' }}
          >
              <div className="max-w-7xl mx-auto w-full px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      {/* Logo / Avatar de la tienda */}
                      {shop.image_url || true ? ( // Placeholder for now, replace true with shop.image_url check
                           <Avatar className="w-10 h-10 border border-current/10">
                                <AvatarImage src={shop.image_url} alt={shop.shop_name} />
                                <AvatarFallback className="font-bold bg-current/5 text-current/70">{getInitials(shop.shop_name)}</AvatarFallback>
                           </Avatar>
                      ) : null}
                      <h1 className="font-bold uppercase tracking-widest text-sm md:text-base truncate">{shop.shop_name}</h1>
                  </div>
                  
                  {/* BOTÓN HEADER - Oculto en Editor */}
                  {!isEditor && (
                  <button onClick={openCart} className="relative p-2.5 hover:bg-current/5 rounded-full transition-all group">
                      <ShoppingBag size={22} strokeWidth={2} />
                      {totalItems > 0 && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                      )}
                  </button>
                  )}
              </div>
          </header>

          {/* BANNER / HERO SECTION (Opcional, usando bg-current/5 como fallback) */}
          <div className="w-full h-32 md:h-48 bg-gradient-to-b from-current/5 to-transparent absolute top-0 left-0 -z-10 pointer-events-none opacity-50" />

          {/* CATALOGO */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
              <div className="text-center mb-12 md:mb-16 flex flex-col items-center max-w-3xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div
                    onClick={(e) => handleElementClick(e, 'text:title')}
                    className={`cursor-pointer transition-all rounded-xl p-4 -m-4 ${isEditor && selectedElement === 'text:title' ? 'ring-2 ring-blue-500 bg-blue-500/10' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5' : ''}`}
                  >
                    <h2 className="text-4xl md:text-6xl font-black mb-2 leading-tight select-none tracking-tight">{shop.design_title_text || "Colección"}</h2>
                  </div>

                  <div
                    onClick={(e) => handleElementClick(e, 'text:subtitle')}
                    className={`mt-2 cursor-pointer transition-all rounded-lg p-2 -m-2 ${isEditor && selectedElement === 'text:subtitle' ? 'ring-2 ring-blue-500 bg-blue-500/10' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5' : ''}`}
                  >
                    <p className="opacity-75 text-base md:text-lg select-none max-w-lg mx-auto leading-relaxed">{shop.design_subtitle_text || "Explora nuestros productos exclusivos seleccionados para ti."}</p>
                  </div>

                   {/* BIO / REDES SOCIALES (Placeholder) */}
                   <div className="flex gap-4 mt-6 opacity-60">
                        {/* Estos iconos podrían ser dinámicos si se agregan a la DB */}
                        <div className="p-2 rounded-full hover:bg-current/10 cursor-pointer transition-colors"><Instagram size={20}/></div>
                        <div className="p-2 rounded-full hover:bg-current/10 cursor-pointer transition-colors"><Facebook size={20}/></div>
                        <div className="p-2 rounded-full hover:bg-current/10 cursor-pointer transition-colors"><Share2 size={20}/></div>
                   </div>
              </div>

              {/* GRID RESPONSIVO MEJORADO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {products?.map((product, idx) => (
                      <TarjetaPersonalizable key={product.id} product={product} design={shop} isEditor={isEditor} index={idx} />
                  ))}
              </div>
          </main>

          {/* --- STICKY BOTTOM BAR (Mobile) & FLOATING PILL (Desktop) --- */}
          {!isEditor && totalItems > 0 && (
             <AnimatePresence>
                 {/* MOBILE STICKY BAR */}
                 <motion.div
                    key="mobile-bar"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
                 >
                    <button
                        onClick={openCart}
                        className="w-full bg-slate-900 text-white shadow-[0_-5px_20px_rgba(0,0,0,0.15)] flex items-center justify-between px-6 py-4"
                        style={{ backgroundColor: textColor === '#000000' ? '#000000' : textColor, color: bgColor === '#ffffff' ? '#ffffff' : bgColor }}
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-xs uppercase font-bold tracking-widest opacity-80">Total · {totalItems} items</span>
                            <span className="text-sm font-black">Ver Carrito</span>
                        </div>
                         <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm">
                            <span>Pagar</span>
                            <ArrowRight size={16} />
                        </div>
                    </button>
                 </motion.div>

                 {/* DESKTOP FLOATING PILL */}
                 <motion.div
                    key="desktop-pill"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="hidden md:flex fixed bottom-8 left-0 right-0 z-40 justify-center px-4"
                 >
                    <button
                        onClick={openCart}
                        className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 px-8 py-4 rounded-full"
                        style={{ backgroundColor: textColor, color: bgColor }}
                    >
                        <div className="relative">
                            <ShoppingBag size={22} fill="currentColor" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {totalItems}
                            </span>
                        </div>

                        <div className="flex flex-col items-start">
                            <span className="text-[10px] uppercase font-bold tracking-widest leading-none opacity-80">Ir a Pagar</span>
                            <span className="text-sm font-black leading-none mt-1">Ver mi pedido</span>
                        </div>

                        <div className="bg-white/20 p-2 rounded-full ml-2">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                 </motion.div>
             </AnimatePresence>
          )}

      </div>
    </>
  )
}

function TarjetaPersonalizable({ product, design, isEditor = false, index = 0 }: { product: any, design: any, isEditor?: boolean, index?: number }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    if (isEditor) return // No añadir al carrito en el editor

    // GAMIFICATION: Confetti Effect
    const btn = document.getElementById(`btn-add-${product.id}`)
    if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            origin: { x, y },
            particleCount: 50,
            spread: 60,
            startVelocity: 30,
            colors: [design.design_title_color || '#000000', '#FF0000', '#FFFFFF'],
            disableForReducedMotion: true,
            zIndex: 9999
        });
    }

    // TOAST FEEDBACK
    toast.success(`Agregado: ${product.name}`, {
        description: `${quantity} unidad(es) al carrito`,
        duration: 2000,
        position: "top-center",
        icon: <Check className="text-green-500" size={16} />
    })

    for(let i=0; i<quantity; i++) addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
    setQuantity(1)
  }

  const borderColor = design.design_card_style === 'border' ? 'border border-current opacity-20' : 'border-transparent'
  const shadowClass = design.design_card_style === 'shadow' ? 'shadow-xl bg-white' : '' // Increased shadow for Bento feel
  const textColor = design.design_title_color || "#000000"

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`group rounded-2xl overflow-hidden transition-all bg-white hover:-translate-y-1 hover:shadow-2xl duration-300 ${shadowClass} ${borderColor}`}
    >
        {/* IMAGE CONTAINER */}
        <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
            {product.image_url ? (
                <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name}/>
            ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10"><ShoppingBag size={48}/></div>
            )}
            
            {/* Quick Add Button on Hover (Desktop) or always visible (Mobile) - Styled as floating action */}
             <div className="absolute bottom-3 right-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button 
                    onClick={handleAdd}
                    id={`btn-add-${product.id}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all bg-white text-black"
                >
                     <Plus size={20} />
                </button>
             </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-bold text-sm uppercase leading-snug line-clamp-2 text-gray-800">{product.name}</h3>
                <span className="font-black text-lg tabular-nums tracking-tight">${product.price}</span>
            </div>

            <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                {product.description || "Sin descripción disponible."}
            </p>

            <button
                onClick={handleAdd}
                className="w-full rounded-xl py-3 font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: textColor, color: design.design_bg_color || 'white' }}
            >
                {isAdded ? (
                    <>
                        <Check size={16} /> Agregado
                    </>
                ) : (
                    <>
                         Agregar al Carrito
                    </>
                )}
            </button>
        </div>
    </motion.div>
  )
}
