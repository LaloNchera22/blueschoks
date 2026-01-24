"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import { Database } from '@/utils/supabase/types'
import { DesignConfig } from '@/lib/types/design-system'
import { useCart } from '@/components/shop/cart-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  config: DesignConfig
}

export function ProductCard({ product, config }: ProductCardProps) {
  const { addToCart, items } = useCart()
  const [isAdded, setIsAdded] = React.useState(false)

  // Determine if item is already in cart for visual feedback (optional)
  // const inCart = items.find(i => i.id === product.id)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    addToCart({
      id: product.id,
      price: product.price,
      name: product.name,
      image_url: product.image_url || undefined
    })

    // Temporary success state for the button
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  // Styles
  const primaryColor = config?.colors?.primary || '#000000'
  const cardBg = config?.colors?.cardBackground || '#ffffff'
  const textColor = config?.colors?.text || '#1f2937'

  // Card Style Config
  const cardStyle = config.cardStyle || {
    borderRadius: 16,
    buttonColor: primaryColor,
    buttonTextColor: '#ffffff',
    priceColor: primaryColor,
    titleColor: textColor
  }

  // Product Style Override
  const styleConfig = product.style_config
  const titleFont = styleConfig?.titleFont || undefined
  const priceFont = styleConfig?.priceFont || undefined
  const footerBg = styleConfig?.footerBackground || undefined

  // Prioritize product-specific colors over global card style
  const titleColor = styleConfig?.titleColor || cardStyle.titleColor
  const priceColor = styleConfig?.priceColor || cardStyle.priceColor

  return (
    <motion.div
      layout
      className="group relative flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-xl"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 bg-gray-50">
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}

        {/* Floating Action Button (Top Right or Bottom Right) - Let's do Bottom Right for reachability */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
            <Button
                size="icon"
                onClick={handleAdd}
                className={cn(
                    "h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90",
                    isAdded ? "bg-green-500 hover:bg-green-600" : ""
                )}
                style={{
                    backgroundColor: isAdded ? undefined : cardStyle.buttonColor,
                    color: cardStyle.buttonTextColor
                }}
            >
                {isAdded ? (
                    <Check className="h-5 w-5 animate-in zoom-in spin-in-50 duration-300" />
                ) : (
                    <Plus className="h-5 w-5" />
                )}
            </Button>
        </div>
      </div>

      {/* Info */}
      <div
        className={cn("flex flex-col gap-1 px-2 pb-2", footerBg && "p-3 rounded-xl transition-colors")}
        style={{ backgroundColor: footerBg }}
      >
        <div className="flex justify-between items-start gap-4">
            <h3
              className="font-medium text-neutral-800 text-sm leading-snug line-clamp-2"
              style={{
                color: titleColor, // Keep override if needed, or default to neutral-800 via class
                fontFamily: titleFont
              }}
            >
                {product.name}
            </h3>
        </div>
        <p
          className="font-semibold text-black text-base tracking-tight"
          style={{
            color: priceColor, // Keep override if needed
            fontFamily: priceFont
          }}
        >
          ${product.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  )
}
