'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

export default function CartDrawer({ whatsappNumber, shopName }: { whatsappNumber: string, shopName: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { items, total, count, addToCart, decreaseQuantity, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  // --- LA MAGIA: GENERADOR DE LINK DE WHATSAPP ---
  const handleCheckout = () => {
    if (!whatsappNumber) return alert('Esta tienda no tiene número de WhatsApp configurado.')

    let message = `👋 Hola *${shopName}*, me interesa hacer este pedido:\n\n`
    
    items.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.name} - $${item.price * item.quantity}\n`
    })

    message += `\n💰 *TOTAL: $${total}*\n`
    message += `\nQuedo pendiente de los datos de pago/entrega. ¡Gracias!`

    // Codificamos el texto para que funcione en la URL
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    // Abrir en nueva pestaña
    window.open(url, '_blank')
  }

  if (count === 0) return null // No mostrar si está vacío

  return (
    <>
      {/* BOTÓN FLOTANTE (ABRIR CARRITO) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#1a1a8e] text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 hover:scale-105 transition-transform animate-bounce-slow"
      >
        <span>🛒</span>
        <span className="font-bold">{count} items</span>
        <span className="bg-white text-[#1a1a8e] px-2 py-0.5 rounded-full text-xs font-black">
          ${total}
        </span>
      </button>

      {/* DRAWER / MODAL LATERAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Fondo oscuro al hacer click cierra */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            
            {/* Header del Carrito */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-black text-xl text-[#1a1a8e] uppercase">Tu Pedido</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕ CERRAR
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="w-full h-full object-cover"
                        sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-[#1a1a8e] font-bold">${item.price}</p>
                  </div>
                  
                  {/* Controles de Cantidad */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:bg-white rounded">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center font-bold text-[#1a1a8e] hover:bg-white rounded">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con Total y Botón de WhatsApp */}
            <div className="p-5 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">Total a pagar:</span>
                <span className="text-2xl font-black text-[#1a1a8e]">${total}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1ebc57] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              >
                <span>📲</span> COMPLETAR PEDIDO EN WHATSAPP
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Serás redirigido al chat con {shopName} para finalizar.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  )
}