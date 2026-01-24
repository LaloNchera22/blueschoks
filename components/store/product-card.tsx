"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Database } from '@/utils/supabase/types'
import { DesignConfig } from '@/lib/types/design-system'
import { cn } from '@/lib/utils'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  config: DesignConfig
  onSelectElement?: (element: 'container' | 'title' | 'price' | 'cartButton' | 'description') => void
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, config, onSelectElement, onAddToCart }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0)

  // Carousel Logic
  // Use images array if available and not empty, otherwise fallback to image_url
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.image_url ? [product.image_url] : [])

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex(curr => curr === 0 ? images.length - 1 : curr - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex(curr => (curr + 1) % images.length)
  }

  // Styles Resolution
  const style = product.style_config || {}
  const cardStyle = config?.cardStyle || {
      borderRadius: 16,
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      priceColor: '#000000',
      titleColor: '#1f2937'
  }
  const globalColors = config?.colors || { cardBackground: '#ffffff', text: '#1f2937' }

  // Background
  const isTransparent = style.cardBackground === 'transparent'
  const bgColor = isTransparent ? 'transparent' : (style.cardBackground || globalColors.cardBackground || '#ffffff')
  const borderColor = isTransparent ? 'none' : `1px solid ${(cardStyle as any).borderColor || 'rgba(0,0,0,0.05)'}`

  // Fonts & Colors (Granular > Global Fallback)
  const titleFont = style.titleFont
  const priceFont = style.priceFont
  const titleColor = style.titleColor || cardStyle.titleColor || globalColors.text
  const priceColor = style.priceColor || cardStyle.priceColor || globalColors.text

  // Cart Button Styles
  const btnBg = style.cartBtnBackground || cardStyle.buttonColor || '#000000'
  const btnColor = style.cartBtnColor || cardStyle.buttonTextColor || '#ffffff'

  // Description Background (Footer)
  const descBg = style.descriptionBackground === 'transparent'
    ? 'transparent'
    : (style.descriptionBackground || style.footerBackground || '#ffffff')

  return (
    <div
      className={cn(
        "h-full flex flex-col relative overflow-hidden transition-all duration-300 group",
        isTransparent ? "" : "rounded-2xl shadow-sm hover:shadow-md"
      )}
      style={{
        backgroundColor: bgColor,
        border: borderColor
      }}
      onClick={() => onSelectElement && onSelectElement('container')}
    >
      {/* --- ZONA IMAGEN (CARRUSEL) --- */}
      <div className={cn(
          "relative w-full aspect-square bg-gray-100 overflow-hidden",
          isTransparent ? "rounded-xl" : ""
      )}>
        {images.length > 0 ? (
           <Image
             src={images[imgIndex]}
             alt={product.name}
             fill
             className="object-cover transition-transform duration-700 group-hover:scale-105"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           />
        ) : (
           <div className="flex h-full w-full items-center justify-center text-gray-300 bg-gray-50">
             <span className="text-xs font-medium">Sin imagen</span>
           </div>
        )}

        {images.length > 1 && (
          <>
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm text-black"
            >
                <ChevronLeft size={16}/>
            </button>
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm text-black"
            >
                <ChevronRight size={16}/>
            </button>
          </>
        )}
      </div>

      {/* --- FOOTER (INFO + BOTÓN CUSTOM) --- */}
      <div
        className={cn(
            "p-3 flex justify-between items-end gap-2 flex-grow transition-colors relative",
            (style.descriptionBackground || style.footerBackground) && "transition-colors"
        )}
        style={{ backgroundColor: descBg }}
        onClick={(e) => {
            e.stopPropagation();
            if (onSelectElement) onSelectElement('description');
        }}
      >
        <div className="flex flex-col min-w-0 gap-1">
           <h3
             className="truncate font-medium text-sm text-neutral-800"
             style={{ fontFamily: titleFont, color: titleColor }}
             onClick={(e) => { e.stopPropagation(); onSelectElement && onSelectElement('title'); }}
           >
             {product.name}
           </h3>
           <p
             className="text-sm font-semibold opacity-90 text-black"
             style={{ fontFamily: priceFont, color: priceColor }}
             onClick={(e) => { e.stopPropagation(); onSelectElement && onSelectElement('price'); }}
           >
             ${product.price.toFixed(2)}
           </p>
        </div>

        {/* BOTÓN DE CARRITO PERSONALIZABLE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectElement) {
                onSelectElement('cartButton');
            } else if (onAddToCart) {
                onAddToCart(product);
            }
          }}
          className="w-9 h-9 flex items-center justify-center rounded-full border transition-transform active:scale-95 shadow-sm shrink-0"
          style={{
            backgroundColor: btnBg,
            color: btnColor,
            borderColor: btnColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : btnColor // Subtle border if white to separate from card
          }}
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  )
}
