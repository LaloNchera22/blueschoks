"use client"

// 1. AGREGAMOS 'SheetTitle' A LOS IMPORTS
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "./cart-context"
import { X, Trash2, MessageCircle, ShoppingBag, Plus, Minus } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"

export default function CartSidebar({ shop }: { shop: any }) {
  const { items, removeFromCart, addToCart, removeItem, cartTotal, isCartOpen, closeCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  const formatPrice = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)

  const whatsappLink = useMemo(() => {
    if (!shop || !shop.whatsapp) return null;
    const phone = shop.whatsapp.replace(/\D/g, ''); 
    let message = `Hola *${shop.shop_name || 'Tienda'}*, quiero realizar el siguiente pedido:\n\n`
    items.forEach((item: any) => {
        message += `▫️ ${item.quantity}x *${item.name}* - $${item.price * item.quantity}\n`
    })
    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n\nQuedo pendiente para el pago y envío.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }, [shop, items, cartTotal])

  if (!isClient) return null

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart} modal={false}>
      
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] bg-white p-0 flex flex-col z-[100] h-full shadow-2xl border-l border-gray-100"
      >
        {/* --- CORRECCIÓN DEL ERROR --- */}
        {/* Agregamos el Título oculto para accesibilidad */}
        <SheetTitle className="hidden">Carrito de Compras</SheetTitle>
        
        {/* HEADER VISUAL */}
        <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-black text-white p-2 rounded-lg shadow-md">
                    <ShoppingBag size={18} />
                </div>
                <span className="font-bold text-lg text-slate-900">Tu Pedido <span className="text-gray-400 text-sm ml-1">({items.length})</span></span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full hover:bg-gray-100 text-slate-500">
                <X size={20} />
            </Button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 custom-scrollbar">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <ShoppingBag size={64} className="opacity-10" />
                    <p className="text-sm font-medium opacity-60">Tu carrito está vacío</p>
                    <Button variant="outline" onClick={closeCart}>Seguir comprando</Button>
                </div>
            ) : (
                items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                            {item.image_url ? (
                                <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="opacity-20"/></div>
                            )}
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm line-clamp-2 leading-tight text-slate-800">{item.name}</h4>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            
                            <div className="flex items-end justify-between mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                                    <button onClick={() => removeItem(item.id)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors"><Minus size={12} className="text-slate-600"/></button>
                                    <span className="text-xs font-black w-4 text-center tabular-nums text-slate-900">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors"><Plus size={12} className="text-slate-600"/></button>
                                </div>
                                <span className="font-black text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-gray-500 font-medium">Total estimado</span>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(cartTotal)}</span>
                </div>
                
                {whatsappLink ? (
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-95 group text-center no-underline"
                    >
                        <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                        <span>Pedir por WhatsApp</span>
                    </a>
                ) : (
                    <button 
                        onClick={() => alert("⚠️ Error: El dueño de la tienda no ha configurado su número de WhatsApp en el Panel de Control.")}
                        className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold flex items-center justify-center gap-3 cursor-not-allowed"
                    >
                        <MessageCircle size={22} />
                        <span>WhatsApp no configurado</span>
                    </button>
                )}
            </div>
        )}
      </SheetContent>
    </Sheet>
  )
}