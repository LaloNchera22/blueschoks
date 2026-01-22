"use client"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useCart, CartItem } from "./cart-context"
import { X, Trash2, MessageCircle, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Shop {
  whatsapp?: string | null;
  shop_name?: string | null;
  [key: string]: unknown;
}

export default function CartSidebar({ shop }: { shop: Shop }) {
  const { items, removeFromCart, addToCart, removeItem, cartTotal, isCartOpen, closeCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsClient(true) }, [])

  const formatPrice = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)

  const whatsappLink = useMemo(() => {
    if (!shop || !shop.whatsapp) return null;
    const phone = shop.whatsapp.replace(/\D/g, ''); 
    // Format: Hola, quiero pedir: 1x ProdA ($100), 2x ProdB ($50) Total: $200
    let itemList = items.map((item: CartItem) => {
        return `${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`
    }).join(", ");

    let message = `Hola, quiero pedir:\n${itemList}\nTotal: ${formatPrice(cartTotal)}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }, [shop, items, cartTotal])

  if (!isClient) return null

  // Ensure items are valid objects before rendering
  const validItems = items.filter((item: unknown): item is CartItem => !!item && typeof item === 'object');

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart} modal={true}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] bg-white p-0 flex flex-col z-[100] h-full shadow-2xl border-l border-gray-100/50"
      >
        <SheetTitle className="hidden">Carrito de Compras</SheetTitle>
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm flex justify-between items-center z-10 shrink-0 sticky top-0">
            <div className="flex flex-col">
                <h2 className="font-bold text-xl text-slate-900 tracking-tight">Tu Bolsa</h2>
                <span className="text-slate-500 text-sm font-medium">{validItems.length} productos</span>
            </div>
            <Button variant="outline" size="icon" onClick={closeCart} className="h-10 w-10 rounded-full border-gray-200 text-slate-900 hover:bg-gray-50 transition-all">
                <X size={20} />
            </Button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white custom-scrollbar">
            {validItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                         <ShoppingBag size={40} className="opacity-30" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-800 mb-1">Tu bolsa está vacía</p>
                        <p className="text-sm font-medium opacity-60">Parece que aún no has elegido nada.</p>
                    </div>
                    <Button variant="outline" onClick={closeCart} className="rounded-full px-8 border-gray-200 text-slate-800 hover:bg-gray-50 font-semibold">
                        Seguir Comprando
                    </Button>
                </div>
            ) : (
                <AnimatePresence>
                    {validItems.map((item: CartItem) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            layout
                            className="flex gap-5"
                        >
                            {/* Product Image */}
                            <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative group">
                                {item.image_url ? (
                                    <Image
                                      src={item.image_url}
                                      fill
                                      className="w-full h-full object-cover"
                                      alt={item.name || "Producto"}
                                      sizes="80px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="opacity-20"/></div>
                                )}
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 flex flex-col py-1">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <h4 className="font-semibold text-sm line-clamp-2 leading-snug text-slate-900">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-2 -mt-1 rounded-full">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <span className="text-sm font-medium text-muted-foreground mb-auto">{formatPrice(item.price)}</span>

                                <div className="flex items-center justify-between mt-3">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-full px-1 py-1">
                                        <button onClick={() => removeItem(item.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-slate-600 transition-colors"><Minus size={14} /></button>
                                        <span className="text-sm font-semibold w-4 text-center tabular-nums text-slate-900">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-slate-600 transition-colors"><Plus size={14} /></button>
                                    </div>
                                    <span className="font-bold text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>

        {/* FOOTER */}
        {validItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white z-10 shrink-0">
                <div className="space-y-2 mb-6">
                     <div className="flex justify-between items-center text-slate-500 text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-2 mt-2">
                        <span className="text-lg font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-black text-slate-900">{formatPrice(cartTotal)}</span>
                    </div>
                </div>
                
                {whatsappLink ? (
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:bg-gray-900 active:scale-95 group text-center no-underline relative overflow-hidden shadow-lg shadow-gray-200"
                    >
                        <span>Checkout por WhatsApp</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </a>
                ) : (
                    <button 
                        onClick={() => alert("⚠️ Error: El dueño de la tienda no ha configurado su número de WhatsApp en el Panel de Control.")}
                        className="w-full bg-gray-100 text-gray-400 py-4 rounded-full font-bold flex items-center justify-center gap-3 cursor-not-allowed"
                    >
                        <MessageCircle size={20} />
                        <span>WhatsApp no configurado</span>
                    </button>
                )}
            </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
