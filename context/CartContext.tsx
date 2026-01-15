'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (id: string) => void
  decreaseQuantity: (id: string) => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('blueshock-cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('blueshock-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const decreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity - 1) }
      }
      return item
    }).filter(item => item.quantity > 0)) // Si llega a 0, se borra
  }

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, decreaseQuantity, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}