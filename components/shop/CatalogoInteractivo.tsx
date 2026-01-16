"use client"

import { useState, useEffect } from "react"
// Importamos openCart del contexto
import { useCart, CartItem } from "./cart-context"
import CartSidebar from "./cart-sidebar" 
import { Plus, Minus, ShoppingBag, Check, Globe, Share2, Trash2, Send, X, ShoppingCart } from "lucide-react"
import { useEditorStore } from "@/hooks/useEditorStore"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Shop {
  design_font?: string | null;
  design_bg_color?: string | null;
  design_title_color?: string | null;
  design_title_text?: string | null;
  design_subtitle_text?: string | null;
  design_card_style?: string | null;
  shop_name?: string | null;
  bio?: string | null;
  whatsapp?: string | null;
  avatar_url?: string | null;
  image_url?: string | null;
  [key: string]: unknown;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  quantity?: number; 
  stock?: number;
  [key: string]: unknown;
}

export default function CatalogoInteractivo({ products, shop, isEditor = false }: { products: Product[], shop: Shop, isEditor?: boolean }) {
  // 1. Calculamos el total manualmente
  const { items, openCart, removeItem } = useCart()
  const { setSelectedElement, selectedElement } = useEditorStore()
  
  const [isClient, setIsClient] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false) 

  useEffect(() => {
      setIsClient(true)
  }, [])

  useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. Fórmulas de Totales
  const total = items?.reduce((acc: number, item: CartItem) => {
      return acc + (Number(item.price) * (item.quantity || 1))
  }, 0) || 0

  const totalItems = items?.reduce((acc: number, item: CartItem) => acc + (item.quantity || 0), 0) || 0

  // LOGICA DE FUENTES
  const fontValue = shop.design_font || 'Inter, sans-serif';
  const fontName = fontValue.split(',')[0].replace(/['"]/g, '').trim();
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;700;900&display=swap`;
  const bgColor = shop.design_bg_color || "#f3f4f6" 
  const textColor = shop.design_title_color || "#000000"

  // Handler para clicks en el editor
  const handleElementClick = (e: React.MouseEvent, type: 'global' | 'text:title' | 'text:subtitle') => {
    if (!isEditor) return
    e.stopPropagation()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedElement(type as any) 
  }

  // Generar mensaje de WhatsApp
  const handleCheckout = () => {
    if (items.length === 0) return

    let message = `Hola *${shop.shop_name || "la tienda"}*, quiero hacer un pedido:\n\n`
    items.forEach((item: CartItem) => {
      message += `▫️ ${item.quantity}x ${item.name || "Producto"} - $${item.price * (item.quantity || 1)}\n`
    })
    message += `\n*TOTAL: $${total}*`

    const waNumber = shop.whatsapp || ""
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // Helper para generar iniciales
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'TI'

  return (
    <>
      <style jsx global>{`@import url('${googleFontUrl}');`}</style>

      {/* RENDERIZAMOS EL SIDEBAR SOLO SI NO ES EDITOR */}
      {!isEditor && <CartSidebar shop={shop} />}

      {/* CONTENEDOR PRINCIPAL */}
      <div 
          className="min-h-screen transition-all duration-500 flex flex-col items-center pb-32"
          style={{ backgroundColor: bgColor, color: textColor, fontFamily: fontValue }}
          onClick={() => isEditor && setSelectedElement('global')}
      >
          {/* HEADER DE PERFIL */}
          <header className="w-full max-w-md mx-auto pt-12 pb-8 px-6 flex flex-col items-center text-center">

              {/* AVATAR */}
              <div className="mb-4 relative">
                  <Avatar className="w-24 h-24 border-4 border-current/10 shadow-lg">
                        <AvatarImage src={shop.avatar_url || shop.image_url || undefined} alt={shop.shop_name || "Avatar"} />
                        <AvatarFallback className="font-bold text-2xl bg-current/5 text-current/70">{getInitials(shop.shop_name || "")}</AvatarFallback>
                   </Avatar>
                   
                   {/* Botón Carrito Header */}
                   {!isEditor && totalItems > 0 && (
                        <button onClick={() => setIsCartOpen(true)} className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10">
                             <ShoppingBag size={16} />
                        </button>
                   )}
              </div>

              {/* TITULO / NOMBRE TIENDA */}
              <div
                onClick={(e) => handleElementClick(e, 'text:title')}
                className={`cursor-pointer transition-all rounded-xl px-4 py-2 ${isEditor && selectedElement === 'text:title' ? 'ring-2 ring-blue-500 bg-blue-500/10' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5' : ''}`}
              >
                  <h1 className="text-2xl font-bold tracking-tight">{shop.design_title_text || shop.shop_name || "Mi Tienda"}</h1>
              </div>

              {/* BIO / DESCRIPCION */}
              <div
                onClick={(e) => handleElementClick(e, 'text:subtitle')}
                className={`mt-1 cursor-pointer transition-all rounded-lg px-2 py-1 ${isEditor && selectedElement === 'text:subtitle' ? 'ring-2 ring-blue-500 bg-blue-500/10' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5' : ''}`}
              >
                  <p className="opacity-80 text-sm leading-relaxed max-w-xs mx-auto">{shop.design_subtitle_text || shop.bio || "Bienvenido a mi colección de productos."}</p>
              </div>

              {/* REDES SOCIALES */}
              <div className="flex gap-4 mt-4 opacity-60">
                    {shop.whatsapp && (
                        <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-current/5 hover:bg-current/10 transition-colors">
                            <Globe size={18} />
                        </a>
                    )}
                    <button className="p-2 rounded-full bg-current/5 hover:bg-current/10 transition-colors"><Share2 size={18}/></button>
              </div>
          </header>

          {/* LISTA DE PRODUCTOS (GRID RESPONSIVE) */}
          <main className="w-full max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {products?.map((product, idx) => (
                      <TarjetaCuadrada key={product.id} product={product} design={shop} isEditor={isEditor} index={idx} />
                  ))}
              </div>

              {(!products || products.length === 0) && (
                  <div className="text-center py-12 opacity-50">
                      <p>No hay productos disponibles.</p>
                  </div>
              )}
          </main>
      </div>

      {/* --- BOTÓN FLOTANTE "VER CARRITO" --- */}
      {!isEditor && totalItems > 0 && (
         <AnimatePresence>
             <motion.div
                key="cart-fab"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 z-40 left-0 right-0 flex justify-center px-4 pointer-events-none"
             >
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="pointer-events-auto bg-slate-900 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 pl-4 pr-6 py-3 rounded-full border-2 border-white/10"
                    // CORRECCIÓN AQUÍ: Usamos 'shop' en vez de 'design'
                    style={{ backgroundColor: shop.design_title_color || '#0f172a' }}
                >
                    <div className="flex items-center gap-2 border-r border-white/20 pr-4">
                        <ShoppingBag size={20} className="text-white" />
                        <span className="font-bold">{totalItems}</span>
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Total</span>
                        <span className="font-black text-xl">${total}</span>
                    </div>
                </button>
             </motion.div>
         </AnimatePresence>
      )}

      {/* --- DRAWER DEL CARRITO (MODAL) --- */}
      <AnimatePresence>
        {isCartOpen && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
                onClick={() => setIsCartOpen(false)}
            >
                <motion.div 
                    initial={{ y: "100%" }} 
                    animate={{ y: 0 }} 
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="font-black text-xl text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                            <ShoppingBag className="text-slate-900" size={24} /> Tu Pedido
                        </h2>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white rounded-full hover:bg-gray-200 transition text-slate-500 shadow-sm border border-gray-100">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
                        {items.length === 0 ? (
                            <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                                <ShoppingBag size={64} className="mb-4 opacity-20" />
                                <p className="font-medium text-lg">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            items.map((item: CartItem) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative shrink-0 border border-gray-200">
                                        {item.image_url ? (
                                            <Image 
                                                src={item.image_url} 
                                                alt={item.name || "Producto"} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-300"><ShoppingBag size={24}/></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-base text-slate-900 truncate mb-1">{item.name}</p>
                                        <p className="text-sm text-slate-500 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded-md">${item.price} x {item.quantity}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="font-black text-lg text-slate-900">${item.price * (item.quantity || 1)}</div>
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition bg-red-50/50">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="p-5 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-end mb-5">
                                <span className="text-gray-600 font-bold uppercase tracking-wider text-sm">Total a pagar</span>
                                <span className="font-black text-3xl text-slate-900 leading-none">${total}</span>
                            </div>
                            <Button 
                                onClick={handleCheckout}
                                className="w-full h-14 text-lg font-black uppercase tracking-wide bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-3 transition-transform active:scale-95"
                            >
                                <Send size={22} strokeWidth={2.5} /> Pedir por WhatsApp
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- TARJETA DE PRODUCTO REDISEÑADA (ESTILO NENI) ---
function TarjetaCuadrada({ product, design, isEditor = false, index = 0 }: { product: Product, design: Shop, isEditor?: boolean, index?: number }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isEditor) return

    // Efecto de Confeti
    const btn = document.getElementById(`btn-add-${product.id}`)
    if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            origin: { x, y },
            particleCount: 60,
            spread: 70,
            startVelocity: 30,
            colors: [design.design_title_color || '#ea580c', '#FFD700'],
            disableForReducedMotion: true,
            zIndex: 9999
        });
    }

    toast.success(`¡Listo! Agregado al carrito`, {
        description: `${quantity}x ${product.name}`,
        duration: 2000,
        position: "bottom-center",
        icon: <Check className="text-green-500 animate-bounce" size={20} strokeWidth={3} />,
        style: { fontWeight: 'bold', border: '2px solid #22c55e' }
    })

    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    setQuantity(1) 
  }

  // Color de énfasis para el precio y botón
  const accentColor = design.design_title_color || '#0f172a' // Color de la tienda o negro por defecto

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 100 }}
        // ESTILO BASE FIJO: Fondo blanco, borde visible, sombra definida.
        className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 w-full flex flex-col shadow-md border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl"
    >
        {/* IMAGEN */}
        <div className="w-full aspect-square bg-gray-100 relative overflow-hidden border-b border-slate-100">
             {product.image_url ? (
                <Image
                    src={product.image_url}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={product.name || "Producto"}
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20 bg-slate-50"><ShoppingBag size={48} className="text-slate-400"/></div>
            )}
             {/* Overlay sutil al pasar el mouse */}
             <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* CONTENIDO */}
        <div className="p-4 flex flex-col flex-1 justify-between">
            <div className="mb-4">
                {/* PRECIO: Grande, arriba y con color de énfasis */}
                <p className="font-black text-3xl tabular-nums leading-none mb-2" style={{ color: accentColor }}>
                    ${product.price}
                </p>
                {/* TÍTULO: Debajo, fuerte y legible */}
                <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-2 uppercase tracking-tight">
                    {product.name}
                </h3>
            </div>

            {/* CONTROLES */}
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                {/* Selector Numérico (Más sutil, estilo píldora) */}
                <div className="flex items-center justify-center gap-4 bg-slate-50 rounded-full p-1 border border-slate-100 mx-auto w-3/4">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm active:scale-90 transition text-slate-600"
                    >
                        <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <span className="font-black text-lg w-8 text-center tabular-nums text-slate-900">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm active:scale-90 transition text-slate-600"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* BOTÓN AGREGAR: Grande, ancho completo, estilo bloque */}
                <button
                    id={`btn-add-${product.id}`}
                    onClick={handleAdd}
                    className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm relative overflow-hidden
                    ${isAdded ? 'bg-green-600 text-white' : 'text-white hover:opacity-90'}`}
                    style={!isAdded ? { backgroundColor: accentColor } : undefined}
                >
                     {isAdded ? (
                         <><Check size={20} strokeWidth={3} className="animate-bounce"/> ¡AGREGADO!</>
                     ) : (
                         <><ShoppingCart size={20} strokeWidth={3} /> AGREGAR AL CARRITO</>
                     )}
                </button>
            </div>
        </div>
    </motion.div>
  )
}