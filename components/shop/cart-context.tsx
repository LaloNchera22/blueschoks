"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string;
  name?: string;
  price: number;
  image_url?: string;
  quantity: number;
  [key: string]: unknown;
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  // NUEVOS CONTROLES DE VISIBILIDAD
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)
  // ESTADO GLOBAL DEL CARRITO (ABIERTO/CERRADO)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      try { setItems(JSON.parse(savedCart)) } catch (e) { console.error(e) }
    }
  }, [])

  useEffect(() => {
    if (isClient) localStorage.setItem("cart", JSON.stringify(items))
  }, [items, isClient])

  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const addToCart = (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setIsCartOpen(true) // TRUCO: Al agregar, abrimos el carrito automáticamente (opcional)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: (i.quantity || 1) + quantity } : i
        )
      }
      const newItem = { ...product, quantity: quantity } as CartItem
      return [...prev, newItem]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      }
      return prev.filter((i) => i.id !== productId)
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
        if (quantity <= 0) return prev.filter((i) => i.id !== productId)
        return prev.map((i) => i.id === productId ? { ...i, quantity: quantity } : i)
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  const clearCart = () => setItems([])

  // Funciones de control visual
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  return (
    <CartContext.Provider value={{ 
        items, addToCart, removeItem, updateQuantity, removeFromCart, clearCart, 
        cartTotal, cartCount, 
        isCartOpen, openCart, closeCart // Exportamos los controles
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider")
  return context
}