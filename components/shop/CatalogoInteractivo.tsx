"use client"

import { useState, useEffect } from "react"
// Importamos openCart del contexto
import { useCart, CartItem } from "./cart-context"
import CartSidebar from "./cart-sidebar" 
import { Plus, ShoppingBag, Check, Globe, Share2 } from "lucide-react"
import { useEditorStore } from "@/hooks/useEditorStore"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

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
  quantity?: number; // Optional as it might not be present initially
  [key: string]: unknown;
}

export default function CatalogoInteractivo({ products, shop, isEditor = false }: { products: Product[], shop: Shop, isEditor?: boolean }) {
  // USAMOS EL CONTEXTO DIRECTAMENTE
  const { items, openCart } = useCart()
  const { setSelectedElement, selectedElement } = useEditorStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isClient, setIsClient] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsClient(true)
  }, [])

  useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Totales
  const totalItems = items?.reduce((acc: number, item: CartItem) => acc + (item.quantity || 0), 0) || 0

  // LOGICA DE FUENTES
  const fontValue = shop.design_font || 'Inter, sans-serif';
  const fontName = fontValue.split(',')[0].replace(/['"]/g, '').trim();
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;700;900&display=swap`;
  const bgColor = shop.design_bg_color || "#f3f4f6" // Default to light gray if null
  const textColor = shop.design_title_color || "#000000"

  // Handler para clicks en el editor
  const handleElementClick = (e: React.MouseEvent, type: 'global' | 'text:title' | 'text:subtitle') => {
    if (!isEditor) return
    e.stopPropagation()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedElement(type as any) // Type assertion due to useEditorStore types
  }

  // Helper para generar iniciales
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'TI'

  return (
    <>
      <style jsx global>{`@import url('${googleFontUrl}');`}</style>

      {/* RENDERIZAMOS EL SIDEBAR SOLO SI NO ES EDITOR */}
      {!isEditor && <CartSidebar shop={shop} />}

      {/* CONTENEDOR PRINCIPAL - LINKTREE STYLE */}
      <div 
          className="min-h-screen transition-all duration-500 flex flex-col items-center"
          style={{ backgroundColor: bgColor, color: textColor, fontFamily: fontValue }}
          onClick={() => isEditor && setSelectedElement('global')}
      >
          {/* HEADER DE PERFIL (LINKTREE HEADER) */}
          <header className="w-full max-w-md mx-auto pt-12 pb-6 px-6 flex flex-col items-center text-center">

              {/* AVATAR */}
              <div className="mb-4 relative">
                  <Avatar className="w-24 h-24 border-4 border-current/10 shadow-lg">
                        <AvatarImage src={shop.avatar_url || shop.image_url || undefined} alt={shop.shop_name || "Avatar"} />
                        <AvatarFallback className="font-bold text-2xl bg-current/5 text-current/70">{getInitials(shop.shop_name || "")}</AvatarFallback>
                   </Avatar>
                   {/* Botón Carrito Flotante (Header) si hay items */}
                   {!isEditor && totalItems > 0 && (
                        <button onClick={openCart} className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
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

              {/* REDES SOCIALES (Placeholder/Example) */}
              <div className="flex gap-4 mt-4 opacity-60">
                   {shop.whatsapp && (
                       <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-current/5 hover:bg-current/10 transition-colors">
                           <Globe size={18} /> {/* Using Globe as generic link icon if whatsapp icon not desired specifically */}
                       </a>
                   )}
                   <button className="p-2 rounded-full bg-current/5 hover:bg-current/10 transition-colors"><Share2 size={18}/></button>
              </div>
          </header>

          {/* LISTA DE PRODUCTOS (STACK) */}
          <main className="w-full max-w-md mx-auto px-4 pb-32 flex flex-col gap-4">
              {products?.map((product, idx) => (
                  <TarjetaPersonalizable key={product.id} product={product} design={shop} isEditor={isEditor} index={idx} />
              ))}

              {(!products || products.length === 0) && (
                  <div className="text-center py-12 opacity-50">
                      <p>No hay productos disponibles.</p>
                  </div>
              )}
          </main>

          {/* FLOATING ACTION BUTTON FOR CART (Mobile Friendly) */}
          {!isEditor && totalItems > 0 && (
             <AnimatePresence>
                 <motion.div
                    key="cart-fab"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 z-50 left-0 right-0 flex justify-center pointer-events-none"
                 >
                    <button
                        onClick={openCart}
                        className="pointer-events-auto shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 pl-5 pr-6 py-3.5 rounded-full"
                        style={{ backgroundColor: textColor === '#ffffff' ? '#000000' : textColor, color: bgColor === '#000000' ? '#ffffff' : bgColor }}
                    >
                        <div className="relative">
                            <ShoppingBag size={20} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        </div>
                        <span className="font-bold text-sm">Ver Carrito</span>
                    </button>
                 </motion.div>
             </AnimatePresence>
          )}

      </div>
    </>
  )
}

function TarjetaPersonalizable({ product, design, isEditor = false, index = 0 }: { product: Product, design: Shop, isEditor?: boolean, index?: number }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isEditor) return

    const btn = document.getElementById(`btn-add-${product.id}`)
    if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            origin: { x, y },
            particleCount: 40,
            spread: 50,
            startVelocity: 25,
            colors: [design.design_title_color || '#000000', '#FF0000'],
            disableForReducedMotion: true,
            zIndex: 9999
        });
    }

    toast.success(`Agregado al carrito`, {
        description: `${product.name}`,
        duration: 1500,
        position: "bottom-center",
        icon: <Check className="text-green-500" size={16} />
    })

    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
    setQuantity(1)
  }

  // Estilos Condicionales
  const cardStyle = design.design_card_style || 'minimal'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMinimal = cardStyle === 'minimal'
  const isShadow = cardStyle === 'shadow' || cardStyle === 'Sombra' // Handle potential DB naming variations

  // Determinar colores de contraste para la tarjeta
  const cardBg = isShadow ? '#ffffff' : 'transparent'
  // Si es minimal (transparente), usamos el color de texto global. Si es shadow (blanco), usamos negro por defecto o el color global si es oscuro.
  // Para simplificar: Shadow siempre blanco con texto negro/gris. Minimal hereda.
  const cardTextColor = isShadow ? '#000000' : 'currentColor'
  const shadowClass = isShadow ? 'shadow-md border border-gray-100' : 'border border-current/10'

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`group relative rounded-3xl overflow-hidden transition-all duration-300 w-full ${shadowClass}`}
        style={{ backgroundColor: cardBg, color: cardTextColor }}
        onClick={() => setExpanded(!expanded)}
    >
        <div className="flex flex-row items-stretch h-full">
            {/* IMAGEN A LA IZQUIERDA (Thumbnail Style) o FULL WIDTH si es muy vertical?
                User req: "Lista de Productos (Stack)... imagen del producto debe verse bien... adaptándose".
                Linktree style usually has image on left (thumbnail) OR full width card.
                Let's go with a balanced approach: Image on Left (30-40%) + Content Right.
            */}
            <div className="w-1/3 min-w-[100px] bg-gray-100 relative">
                 {product.image_url ? (
                    <Image
                        src={product.image_url}
                        fill
                        className="w-full h-full object-cover absolute inset-0"
                        alt={product.name}
                        sizes="(max-width: 768px) 33vw, 20vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag size={24}/></div>
                )}
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 p-4 flex flex-col justify-between min-h-[120px]">
                <div>
                    <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs opacity-70 line-clamp-2 mb-2 leading-relaxed">
                        {product.description || "Sin descripción."}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-lg tabular-nums">${product.price}</span>

                    <button
                        id={`btn-add-${product.id}`}
                        onClick={handleAdd}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-90 ${isAdded ? 'bg-green-500 text-white' : 'bg-current text-white'}`}
                        style={{ backgroundColor: isAdded ? undefined : (isShadow ? design.design_title_color || '#000000' : 'currentColor'), color: isShadow ? '#ffffff' : design.design_bg_color || '#ffffff' }}
                    >
                         {isAdded ? <Check size={14} /> : <Plus size={16} />}
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
  )
}
