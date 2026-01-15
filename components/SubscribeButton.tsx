'use client'

import { useState } from 'react'

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      // Llamamos a nuestra API Route
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })
      
      const data = await response.json()

      // Si todo sale bien, Stripe nos manda una URL. Redirigimos ahí.
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error al iniciar el pago')
      }
    } catch (error) {
      console.error(error)
      alert('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform w-full disabled:opacity-50"
    >
      {loading ? 'Cargando Stripe...' : '💎 MEJORAR A PLAN PRO ($99/mes)'}
    </button>
  )
}