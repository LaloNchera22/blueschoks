"use client"

import React, { useState, useMemo } from 'react'
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

  // 2. Lógica de Galería
  const gallery = useMemo(() => {
    // 1. Prioridad: Array de imágenes
    if (product.images && product.images.length > 0) {
      const validImages = product.images.filter(Boolean);
      if (validImages.length > 0) return validImages;
    }

    // 2. Prioridad: Imagen principal (image_url)
    if (product.image_url) {
      return [product.image_url];
    }

    // 3. Fallback: Placeholder
    return ['/placeholder.png'];
  }, [product.images, product.image_url]);

  // 3. HANDLERS DE NAVEGACIÓN
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // CRÍTICO: Evita seleccionar la tarjeta
    setCurrentImg((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // CRÍTICO: Evita seleccionar la tarjeta
    setCurrentImg((prev) => (prev + 1) % gallery.length)
  }

  // 4. Lógica de Estilos (Existente)
  const style = product.style_config || {}

  const getBgStyle = (colorValue: string | undefined) => {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'rgba(0,0,0,0)') {
      return 'transparent';
    }
    return colorValue;
  };

  const cardBg = getBgStyle(style.cardBackground);
  const descBg = getBgStyle(style.descriptionBackground);
  const isCardTransparent = cardBg === 'transparent';

  const cardStyle = config?.cardStyle || {
      borderRadius: 16,
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      priceColor: '#000000',
      titleColor: '#1f2937'
  }
  const globalColors = config?.colors || { cardBackground: '#ffffff', text: '#1f2937' }

  const titleFont = style.titleFont
  const priceFont = style.priceFont
  const titleColor = style.titleColor || cardStyle.titleColor || globalColors.text
  const priceColor = style.priceColor || cardStyle.priceColor || globalColors.text

  const btnBg = style.cartBtnBackground || cardStyle.buttonColor || '#000000'
  const btnColor = style.cartBtnColor || cardStyle.buttonTextColor || '#ffffff'

  return (
    <div
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
      <div className={`relative w-full aspect-square bg-gray-100 overflow-hidden transition-all ${
        style.imageShape === 'square' ? 'rounded-none' : 'rounded-xl'
      }`}>

        <Image
          src={gallery[currentImg]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* CONTROLES DEL CARRUSEL (Solo si hay más de 1 foto) */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-sm opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={18} className="text-black" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-sm opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={18} className="text-black" />
            </button>

            {/* INDICADOR DE PUNTOS */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {gallery.map((_, idx) => (
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectElement) {
               onSelectElement('cartButton');
            } else if (onAddToCart) {
               onAddToCart(product);
            }
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 shrink-0"
          style={{
            backgroundColor: btnBg,
            color: btnColor
          }}
        >
          <ShoppingBag size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
