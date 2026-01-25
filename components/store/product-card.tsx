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

  // 1. Lógica de Estilos
  const style = product.style_config || {}

  // Helper para asegurar transparencia real
  const getBgStyle = (colorValue: string | undefined) => {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'rgba(0,0,0,0)') {
      return 'transparent';
    }
    return colorValue;
  };

  const cardBg = getBgStyle(style.cardBackground);
  const descBg = getBgStyle(style.descriptionBackground);
  // Detectamos si es transparente para quitar bordes/sombras
  const isCardTransparent = cardBg === 'transparent';

  const cardStyle = config?.cardStyle || {
      borderRadius: 16,
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      priceColor: '#000000',
      titleColor: '#1f2937'
  }
  const globalColors = config?.colors || { cardBackground: '#ffffff', text: '#1f2937' }

  // Fonts & Colors (Granular > Global Fallback)
  const titleFont = style.titleFont
  const priceFont = style.priceFont
  const titleColor = style.titleColor || cardStyle.titleColor || globalColors.text
  const priceColor = style.priceColor || cardStyle.priceColor || globalColors.text

  // Cart Button Styles
  const btnBg = style.cartBtnBackground || cardStyle.buttonColor || '#000000'
  const btnColor = style.cartBtnColor || cardStyle.buttonTextColor || '#ffffff'

  return (
    <div
      // ⚠️ ASEGURARSE: AQUÍ NO DEBE HABER NINGÚN 'bg-white' o similar.
      className={`
        h-full flex flex-col relative overflow-hidden transition-all duration-300 group
        ${isCardTransparent ? '' : 'rounded-2xl shadow-sm'}
      `}
      style={{
         backgroundColor: cardBg,
         border: isCardTransparent ? 'none' : `1px solid ${style.borderColor || 'rgba(0,0,0,0.05)'}`
      }}
      onClick={() => onSelectElement && onSelectElement('container')}
    >
      {/* --- ZONA IMAGEN (CARRUSEL) --- */}
      <div className={`relative w-full aspect-square bg-gray-100 overflow-hidden ${isCardTransparent ? 'rounded-xl' : ''}`}>
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
        // ⚠️ ASEGURARSE: AQUÍ TAMPOCO DEBE HABER 'bg-*' classes.
        className="p-3 flex justify-between items-end gap-2 flex-grow relative transition-colors"
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
            borderColor: btnColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : btnColor
          }}
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  )
}
