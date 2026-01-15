"use client"

import { useState } from "react"
import { useCart } from "./cart-context"
import { ShoppingBag, X, Plus, Minus, Send, Trash2 } from "lucide-react"
import Image from "next/image"

export default function ShoppingCart({ shopPhone, shopName }: { shopPhone: string, shopName: string }) {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleCheckout = () => {
    if (!shopPhone) return alert("Esta tienda no tiene número de WhatsApp configurado.")
    let message = `Hola *${shopName}*, quiero hacer el siguiente pedido:\n\n`
    items.forEach(item => {
      message += `▫️ ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`
    })
    message += `\n*TOTAL: $${cartTotal.toFixed(2)}*`
    const url = `https://wa.me/${shopPhone.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center animate-in zoom-in duration-300"
      >
        <ShoppingBag size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="font-black text-xl text-slate-900 flex items-center gap-2">
                    <ShoppingBag size={20} /> Tu Pedido
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <ShoppingBag size={64} opacity={0.2} />
                        <p>Tu carrito está vacío.</p>
                        <button onClick={() => setIsOpen(false)} className="text-slate-900 font-bold underline">Volver a la tienda</button>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0 border border-slate-200">
                                {item.image_url ? (
                                    <Image
                                      src={item.image_url}
                                      alt={item.name || "Producto"}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag size={16}/></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-900 line-clamp-2">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-2">${item.price}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-slate-200 rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 hover:bg-slate-50 text-slate-500"><Minus size={12}/></button>
                                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 hover:bg-slate-50 text-slate-500"><Plus size={12}/></button>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900 ml-auto">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 font-medium">Total a pagar</span>
                        <span className="text-2xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Send size={20} /> Enviar Pedido por WhatsApp
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}