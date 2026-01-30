"use client"

import { useState, useEffect, useMemo, memo } from "react"
// Importamos openCart del contexto
import { useCart, CartItem } from "./cart-context"
import CartSidebar from "./cart-sidebar"
import { Plus, Minus, ShoppingBag, Check, Globe, Share2, Trash2, Send, X, ShoppingCart, ChevronLeft, ChevronRight, Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, MessageCircle, Video, AtSign, Music } from "lucide-react"
import { useEditorStore } from "@/hooks/useEditorStore"
import { ThemeConfig, DEFAULT_THEME_CONFIG } from "@/lib/types/theme-config"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Shop {
  // Legacy fields fallback
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

  // New field
  theme_config?: ThemeConfig;

  [key: string]: unknown;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  quantity?: number;
  stock?: number;
  [key: string]: unknown;
}

const CatalogoInteractivo = memo(function CatalogoInteractivo({ products, shop, isEditor = false }: { products: Product[], shop: Shop, isEditor?: boolean }) {
  // 1. Calculamos el total manualmente
  const { items, openCart, removeItem } = useCart()
  const { setSelectedComponent, selectedComponent, theme: editorTheme } = useEditorStore()

  const [isClient, setIsClient] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Use editor theme if in editor mode, otherwise use shop.theme_config or legacy fallback
  const theme = isEditor ? editorTheme : (shop.theme_config || DEFAULT_THEME_CONFIG);

  useEffect(() => {
      setIsClient(true)
  }, [])

  // 2. Fórmulas de Totales (Optimizadas)
  const total = useMemo(() => items?.reduce((acc: number, item: CartItem) => {
      return acc + (Number(item.price) * (item.quantity || 1))
  }, 0) || 0, [items])

  const totalItems = useMemo(() => items?.reduce((acc: number, item: CartItem) => acc + (item.quantity || 0), 0) || 0, [items])

  // LOGICA DE FUENTES Y ESTILOS
  // Extraemos las fuentes usadas para cargarlas
  const fontsToLoad = useMemo(() => {
      const fonts = new Set<string>();
      fonts.add(theme.header.title.fontFamily);
      fonts.add(theme.header.subtitle.fontFamily);
      fonts.add(theme.header.bio.fontFamily);
      // New atomic font sources
      fonts.add(theme.cards.productTitle.fontFamily);
      fonts.add(theme.cards.productPrice.fontFamily);

      // Fallback legacy if using default theme which might just be Inter
      if (!shop.theme_config && shop.design_font) {
          fonts.add(shop.design_font.split(',')[0].replace(/['"]/g, '').trim());
      }

      return Array.from(fonts).map(f => {
         const cleanName = f.split(',')[0].replace(/['"]/g, '').trim();
         return cleanName;
      }).filter(Boolean);
  }, [theme, shop.design_font, shop.theme_config]);

  // Construct Google Fonts URL
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontsToLoad.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;700;900`).join('&')}&display=swap`;

  // Background Logic
  const bgStyle = theme.global.backgroundType === 'image'
    ? { backgroundImage: `url(${theme.global.backgroundValue})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }
    : { backgroundColor: theme.global.backgroundType === 'solid' ? theme.global.backgroundValue : '#ffffff' };

  // Legacy Fallback for Background if no theme config
  const finalBgStyle = (!shop.theme_config && !isEditor && shop.design_bg_color)
      ? { backgroundColor: shop.design_bg_color }
      : bgStyle;

  // Handler para clicks en el editor
  const handleElementClick = (e: React.MouseEvent, type: any) => {
    if (!isEditor) return
    e.stopPropagation()
    setSelectedComponent(type)
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
      <style jsx global>{`@import url('${googleFontsUrl}');`}</style>

      {/* RENDERIZAMOS EL SIDEBAR SOLO SI NO ES EDITOR */}
      {!isEditor && <CartSidebar shop={shop} />}

      {/* CONTENEDOR PRINCIPAL */}
      <div
          className="min-h-screen transition-all duration-500 flex flex-col items-center pb-32"
          style={finalBgStyle}
          onClick={() => isEditor && setSelectedComponent('global_bg')}
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
                onClick={(e) => handleElementClick(e, 'header_title')}
                className={`cursor-pointer transition-all rounded-xl px-4 py-2 ${isEditor && selectedComponent === 'header_title' ? 'ring-2 ring-blue-500 bg-blue-500/10' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5' : ''}`}
                style={{
                    fontFamily: theme.header.title.fontFamily,
                    color: theme.header.title.color,
                }}
              >
                  <h1 className={`font-bold tracking-tight text-${theme.header.title.fontSize} ${theme.header.title.bold ? 'font-black' : 'font-bold'}`} style={{ fontSize: getFontSize(theme.header.title.fontSize) }}>
                      {shop.design_title_text || shop.shop_name || "Mi Tienda"}
                  </h1>
              </div>

              {/* SUBTITULO / BIO / DESCRIPCION */}
              <div
                onClick={(e) => handleElementClick(e, 'header_subtitle')}
                className={`mt-1 cursor-pointer transition-all rounded-lg px-2 py-1 ${isEditor && selectedComponent === 'header_subtitle' ? 'ring-2 ring-blue-500 bg-blue-500/10' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5' : ''}`}
                style={{
                    fontFamily: theme.header.subtitle.fontFamily,
                    color: theme.header.subtitle.color,
                }}
              >
                  <p className="opacity-80 leading-relaxed max-w-xs mx-auto" style={{ fontSize: getFontSize(theme.header.subtitle.fontSize) }}>
                      {shop.design_subtitle_text || shop.bio || "Bienvenido a mi colección de productos."}
                  </p>
              </div>

              {/* REDES SOCIALES */}
              <div
                  onClick={(e) => handleElementClick(e, 'header_social')}
                  className={`flex flex-wrap justify-center gap-3 mt-4 ${isEditor && selectedComponent === 'header_social' ? 'ring-2 ring-blue-500 bg-blue-500/10 p-2 rounded-xl' : isEditor ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 p-2 rounded-xl' : ''}`}
              >
                   {/* Dynamic Links */}
                   {theme.header.socialLinks && theme.header.socialLinks.map(link => {
                        // Icon mapping
                        const iconMap: Record<string, any> = {
                            whatsapp: MessageCircle,
                            instagram: Instagram,
                            facebook: Facebook,
                            x: Twitter,
                            tiktok: Music,
                            youtube: Youtube,
                            linkedin: Linkedin,
                            threads: AtSign,
                            telegram: Send,
                            website: Globe,
                            email: Mail
                        };
                        const Icon = iconMap[link.platform] || Globe;

                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                                style={{
                                    backgroundColor: link.style.backgroundColor,
                                    color: link.style.iconColor,
                                    borderRadius: link.style.borderRadius === 'full' ? '9999px' :
                                                  link.style.borderRadius === 'lg' ? '12px' :
                                                  link.style.borderRadius === 'md' ? '8px' : '0px'
                                }}
                            >
                                <Icon size={18} />
                            </a>
                        )
                   })}

                   {/* Legacy Fallback / Default Add Button for Editor if empty */}
                   {(!theme.header.socialLinks || theme.header.socialLinks.length === 0) && (
                       <>
                            {shop.whatsapp && (
                                <a href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                    <MessageCircle size={18} />
                                </a>
                            )}
                            {!isEditor && (
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><Share2 size={18}/></button>
                            )}

                            {isEditor && !shop.whatsapp && (
                                <div className="text-xs text-slate-400 border border-dashed border-slate-300 px-3 py-1 rounded-full">
                                    Click para agregar redes
                                </div>
                            )}
                       </>
                   )}
              </div>
          </header>

          {/* LISTA DE PRODUCTOS (GRID RESPONSIVE) */}
          <main className="w-full max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {products?.map((product, idx) => (
                      <TarjetaCuadrada
                        key={product.id}
                        product={product}
                        theme={theme}
                        isEditor={isEditor}
                        index={idx}
                        // Fallback color for legacy compatibility in confetti/styles
                        accentColor={theme.header.title.color || shop.design_title_color}
                      />
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
                    style={{ backgroundColor: theme.header.title.color || '#0f172a' }}
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
})

export default CatalogoInteractivo

// --- TARJETA DE PRODUCTO REDISEÑADA (ESTILO EDITORIAL/FASHION) ---
const TarjetaCuadrada = memo(function TarjetaCuadrada({ product, theme, isEditor = false, index = 0, accentColor }: { product: Product, theme: ThemeConfig, isEditor?: boolean, index?: number, accentColor?: string | null }) {
  const { addToCart } = useCart()
  const { setSelectedComponent, selectedComponent } = useEditorStore()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // 1. Lógica de Imágenes (Galería)
  const allImages = useMemo(() => {
    // Combinar images y image_url, priorizando images si existe
    const images = (product.images && product.images.length > 0)
        ? product.images
        : (product.image_url ? [product.image_url] : []);

    // Filtramos nulos y duplicados (básico)
    return Array.from(new Set(images.filter(Boolean)));
  }, [product]);

  const hasMultipleImages = allImages.length > 1;

  const paginate = (newDirection: number) => {
    if (!hasMultipleImages) return;
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = allImages.length - 1;
        if (next >= allImages.length) next = 0;
        return next;
    });
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Si es editor, seleccionamos el componente botón
    if (isEditor) {
        setSelectedComponent('card_add_btn')
        return
    }

    // Efecto de Confeti
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
            colors: [accentColor || theme.header.title.color || '#ea580c', '#ffffff'],
            disableForReducedMotion: true,
            zIndex: 9999
        });
    }

    toast.success(`Agregado`, {
        description: `${quantity}x ${product.name}`,
        duration: 2000,
        position: "bottom-center",
        icon: <ShoppingBag className="text-black" size={18} />,
        className: "bg-white border border-gray-100 shadow-xl",
    })

    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
    setQuantity(1)
  }

  // Card click to edit
  const handleCardClick = (e: React.MouseEvent) => {
      if(!isEditor) return
      e.stopPropagation()
      setSelectedComponent('product_card')
  }

  // Variantes para la animación de slide
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  // Helper para bordes de selección en editor
  const getEditorRing = (component: string) => {
      if (!isEditor) return '';
      if (selectedComponent === component) return 'ring-2 ring-blue-500 bg-blue-500/10';
      return 'hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 cursor-pointer';
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`group relative flex flex-col overflow-hidden transition-all duration-300
            ${theme.cards.border ? 'border' : ''}
            ${getEditorRing('product_card')}`}
        style={{
            backgroundColor: theme.cards.background,
            borderColor: theme.cards.border ? 'rgba(0,0,0,0.1)' : 'transparent',
            borderRadius: '0.5rem' // Default radius
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleCardClick}
    >
        {/* --- 1. GALERÍA / IMAGEN (80-90% visual weight) --- */}
        <div className={`relative w-full aspect-[3/4] overflow-hidden bg-gray-100 ${theme.cards.border ? 'border-b border-gray-50' : ''}`}>
             <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentImageIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {allImages.length > 0 ? (
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-300">
                            <ShoppingBag size={32} />
                        </div>
                    )}
                </motion.div>
             </AnimatePresence>

             {/* Flechas de Navegación (Solo si hay múltiples y hover) */}
             {hasMultipleImages && (
                 <>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-black shadow-sm hover:bg-white transition-colors z-10"
                        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                    >
                        <ChevronLeft size={16} strokeWidth={2} />
                    </motion.button>

                    <motion.button
                         initial={{ opacity: 0 }}
                         animate={{ opacity: isHovered ? 1 : 0 }}
                         className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-black shadow-sm hover:bg-white transition-colors z-10"
                         onClick={(e) => { e.stopPropagation(); paginate(1); }}
                    >
                        <ChevronRight size={16} strokeWidth={2} />
                    </motion.button>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                        {allImages.map((_, idx) => (
                            <motion.div
                                key={idx}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    scale: idx === currentImageIndex ? 1.2 : 1
                                }}
                                className={`h-1.5 rounded-full shadow-sm transition-colors duration-300 ${idx === currentImageIndex ? 'w-1.5 bg-white' : 'w-1.5 bg-white/60'}`}
                            />
                        ))}
                    </div>
                 </>
             )}

             {product.stock === 0 && (
                 <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider backdrop-blur-sm">
                     Agotado
                 </div>
             )}
        </div>

        {/* --- 2. INFORMACIÓN Y ACCIONES --- */}
        <div className="flex flex-col p-3 gap-2">

            {/* Texto Minimalista */}
            <div className="flex flex-col gap-0.5 text-left">
                <h3
                    onClick={(e) => { e.stopPropagation(); isEditor && setSelectedComponent('card_title') }}
                    className={`text-[15px] leading-tight line-clamp-1 p-1 -m-1 rounded ${getEditorRing('card_title')}`}
                    style={{
                        color: theme.cards.productTitle.color,
                        fontFamily: theme.cards.productTitle.fontFamily,
                        fontWeight: theme.cards.productTitle.fontWeight === 'black' ? 900 : theme.cards.productTitle.fontWeight === 'bold' ? 700 : 400
                    }}
                >
                    {product.name}
                </h3>
                <p
                    onClick={(e) => { e.stopPropagation(); isEditor && setSelectedComponent('card_price') }}
                    className={`text-sm w-fit p-1 -m-1 rounded ${getEditorRing('card_price')}`}
                    style={{
                        color: theme.cards.productPrice.color,
                        fontFamily: theme.cards.productPrice.fontFamily,
                        fontWeight: 400
                    }}
                >
                    ${product.price}
                </p>
            </div>

            {/* Zona de Acción: Cantidad + Compra */}
            <div className="flex items-center justify-between mt-1">

                {/* Selector Cantidad (Estilo Cápsula Minimal) */}
                <div
                    onClick={(e) => { e.stopPropagation(); isEditor && setSelectedComponent('card_qty') }}
                    className={`flex items-center h-8 rounded-full px-1 border transition-colors ${getEditorRing('card_qty')}`}
                    style={{
                        backgroundColor: theme.cards.quantitySelector.bgColor,
                        color: theme.cards.quantitySelector.textColor,
                        borderColor: theme.cards.quantitySelector.borderColor
                    }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                        className="w-7 h-full flex items-center justify-center hover:opacity-70 transition active:scale-90"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="text-xs font-semibold w-4 text-center tabular-nums">{quantity}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                        className="w-7 h-full flex items-center justify-center hover:opacity-70 transition active:scale-90"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Botón de Compra */}
                <button
                    id={`btn-add-${product.id}`}
                    onClick={handleAdd}
                    className={`h-9 w-9 flex items-center justify-center shadow-sm transition-all duration-300 active:scale-90 ${getEditorRing('card_add_btn')}`}
                    style={{
                        backgroundColor: isAdded ? '#16a34a' : theme.cards.addButton.bgColor,
                        color: theme.cards.addButton.iconColor,
                        borderRadius: theme.cards.addButton.shape === 'circle' ? '9999px' : theme.cards.addButton.shape === 'square' ? '4px' : '12px'
                    }}
                    title="Agregar al carrito"
                >
                     {isAdded ? (
                         <Check size={16} strokeWidth={3} color="#ffffff" />
                     ) : (
                         <ShoppingBag size={16} strokeWidth={2.5} color={theme.cards.addButton.iconColor} />
                     )}
                </button>
            </div>
        </div>
    </motion.div>
  )
})

function getFontSize(size: string): string {
    switch(size) {
        case 'sm': return '0.875rem';
        case 'base': return '1rem';
        case 'lg': return '1.125rem';
        case 'xl': return '1.25rem';
        case '2xl': return '1.5rem';
        case '3xl': return '1.875rem';
        default: return '1rem';
    }
}
