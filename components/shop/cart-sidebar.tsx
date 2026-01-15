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
    let message = `Hola *${shop.shop_name || 'Tienda'}*, quiero realizar el siguiente pedido:\n\n`
    items.forEach((item: CartItem) => {
        message += `▫️ ${item.quantity}x *${item.name}* - $${item.price * item.quantity}\n`
    })
    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n\nQuedo pendiente para el pago y envío.`
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
        <div className="p-5 border-b border-gray-100 bg-white/80 backdrop-blur-md flex justify-between items-center shadow-sm z-10 shrink-0 sticky top-0">
            <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg shadow-slate-900/20">
                    <ShoppingBag size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg text-slate-900 leading-none">Tu Pedido</span>
                    <span className="text-slate-400 text-xs font-medium mt-1">{validItems.length} productos</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full hover:bg-slate-100 text-slate-500 transition-all hover:rotate-90">
                <X size={22} strokeWidth={2.5} />
            </Button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 custom-scrollbar">
            {validItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2 animate-pulse">
                         <ShoppingBag size={48} className="opacity-20" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-700 mb-1">Tu carrito está vacío</p>
                        <p className="text-sm font-medium opacity-60">¡Agrega algunos productos para empezar!</p>
                    </div>
                    <Button variant="outline" onClick={closeCart} className="rounded-full px-8 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold">
                        Explorar Tienda
                    </Button>
                </div>
            ) : (
                <AnimatePresence>
                    {validItems.map((item: CartItem) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            layout
                            className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative group">
                                {item.image_url ? (
                                    <Image
                                      src={item.image_url}
                                      fill
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      alt={item.name || "Producto"}
                                      sizes="80px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="opacity-20"/></div>
                                )}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-sm line-clamp-2 leading-tight text-slate-800">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1.5 -mr-2 -mt-2 rounded-full hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200/50 shadow-sm">
                                        <button onClick={() => removeItem(item.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100 text-slate-600 hover:scale-105 active:scale-95 transition-all"><Minus size={12} strokeWidth={3}/></button>
                                        <span className="text-xs font-bold w-6 text-center tabular-nums text-slate-900">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-100 text-slate-600 hover:scale-105 active:scale-95 transition-all"><Plus size={12} strokeWidth={3}/></button>
                                    </div>
                                    <span className="font-black text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>

        {/* FOOTER */}
        {validItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
                <div className="space-y-3 mb-6">
                     <div className="flex justify-between items-center text-slate-500 text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-slate-900">Total a Pagar</span>
                        <span className="text-2xl font-black text-slate-900">{formatPrice(cartTotal)}</span>
                    </div>
                </div>
                
                {whatsappLink ? (
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0e6f64] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 group text-center no-underline relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                        <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10">Completar Pedido por WhatsApp</span>
                        <ArrowRight size={18} className="opacity-60 group-hover:translate-x-1 transition-transform relative z-10"/>
                    </a>
                ) : (
                    <button 
                        onClick={() => alert("⚠️ Error: El dueño de la tienda no ha configurado su número de WhatsApp en el Panel de Control.")}
                        className="w-full bg-gray-200 text-gray-500 py-4 rounded-xl font-bold flex items-center justify-center gap-3 cursor-not-allowed opacity-70"
                    >
                        <MessageCircle size={22} />
                        <span>WhatsApp no configurado</span>
                    </button>
                )}
                <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wider">Pago seguro y envío coordinado</p>
            </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
