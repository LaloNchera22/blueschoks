"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Database } from '@/utils/supabase/types'
import { DesignConfig } from '@/lib/types/design-system'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  config: DesignConfig
  onSelectElement?: (element: 'container' | 'title' | 'price' | 'cartButton' | 'description') => void
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, config, onSelectElement, onAddToCart }: ProductCardProps) {
  // 1. ESTADO PARA EL CARRUSEL
  const [currentImg, setCurrentImg] = useState(0)

  // 2. NORMALIZACIÓN DE IMÁGENES
  // Si product.images existe y tiene items, úsalo. Si no, usa la imagen principal o fallback.
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image_url || 'https://via.placeholder.com/400']

  // 3. HANDLERS DE NAVEGACIÓN
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita seleccionar la tarjeta
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita seleccionar la tarjeta
    setCurrentImg((prev) => (prev + 1) % images.length)
  }

  // 4. Lógica de Estilos
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
      <div className={`relative w-full aspect-square bg-gray-100 overflow-hidden ${cardBg === 'transparent' ? 'rounded-xl' : ''}`}>

        {/* IMAGEN ACTUAL */}
        <Image
          src={images[currentImg]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* CONTROLES DEL CARRUSEL (Solo si hay más de 1 foto) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
            >
              <ChevronLeft size={18} className="text-black" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
            >
              <ChevronRight size={18} className="text-black" />
            </button>

            {/* INDICADOR DE PUNTOS */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImg ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
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
