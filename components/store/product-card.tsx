"use client"

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Database } from '@/utils/supabase/types'
import { DesignConfig } from '@/lib/types/design-system'
import { ProductModal } from './product-modal'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  config: DesignConfig
  onSelectElement?: (element: 'container' | 'title' | 'price' | 'cartButton' | 'description') => void
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, config, onSelectElement, onAddToCart }: ProductCardProps) {
  // 1. ESTADO PARA EL CARRUSEL & MODAL
  const [currentImg, setCurrentImg] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // 2. Lógica de Galería
  const gallery = useMemo(() => {
    // 1. Array base (imagen principal si existe)
    const mainImg = product.image_url ? [product.image_url] : []

    // 2. Array adicional
    const extraImgs = product.images && product.images.length > 0 ? product.images : []

    // 3. Combinar y filtrar
    const rawGallery = [...mainImg, ...extraImgs].filter(url => url && url.length > 5)

    // 4. Deduplicar
    const uniqueGallery = Array.from(new Set(rawGallery))

    // Fallback final
    if (uniqueGallery.length === 0) {
      return ['/placeholder.png']
    }

    return uniqueGallery
  }, [product.images, product.image_url])

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url)
  }

  // 3. HANDLERS DE NAVEGACIÓN
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentImg((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentImg((prev) => (prev + 1) % gallery.length)
  }

  // Swipe Handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return

    // Si la distancia es pequeña, puede ser un tap. Pero aquí solo nos importa el swipe.
    // El tap se maneja con onClick.

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe Left -> Next Image
      // Debemos detener la propagación si es un swipe válido para no abrir el modal?
      // Usualmente swipe no dispara click, pero depende del navegador.
      handleNext()
    } else if (isRightSwipe) {
      // Swipe Right -> Prev Image
      handlePrev()
    }
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

  const currentMediaUrl = gallery[currentImg];

  const handleCardClick = () => {
    if (onSelectElement) {
      onSelectElement('container')
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div
        className={`
          h-full flex flex-col relative overflow-hidden transition-all duration-300 group cursor-pointer
          ${isCardTransparent ? '' : 'rounded-2xl shadow-sm'}
        `}
        style={{
          backgroundColor: cardBg,
          border: isCardTransparent ? 'none' : `1px solid ${style.borderColor || 'rgba(0,0,0,0.05)'}`
        }}
        onClick={handleCardClick}
      >
        {/* --- ZONA IMAGEN (CARRUSEL) --- */}
        <div
          className={`relative w-full aspect-square bg-gray-100 overflow-hidden transition-all ${
            style.imageShape === 'square' ? 'rounded-none' : 'rounded-xl'
          }`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          {isVideo(currentMediaUrl) ? (
            <video
              src={currentMediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={currentMediaUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* CONTROLES DEL CARRUSEL (Solo si hay más de 1 foto) */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm z-50 transition-transform active:scale-95 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={18} className="text-black" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm z-50 transition-transform active:scale-95 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={18} className="text-black" />
              </button>

              {/* INDICADOR DE PUNTOS */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-50 pointer-events-none">
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
              // Si estamos en modo edición, permitimos seleccionar la descripción específicamente
              if (onSelectElement) {
                e.stopPropagation();
                onSelectElement('description');
              }
              // Si no, el click burbujea al container y abre el modal, que es lo deseado.
          }}
        >
          <div className="flex flex-col min-w-0 gap-1">
            <h3
              className="truncate font-medium text-sm text-neutral-800"
              style={{ fontFamily: titleFont, color: titleColor }}
              onClick={(e) => {
                if (onSelectElement) {
                  e.stopPropagation();
                  onSelectElement('title');
                }
              }}
            >
              {product.name}
            </h3>
            <p
              className="text-sm font-semibold opacity-90 text-black"
              style={{ fontFamily: priceFont, color: priceColor }}
              onClick={(e) => {
                if (onSelectElement) {
                  e.stopPropagation();
                  onSelectElement('price');
                }
              }}
            >
              ${product.price.toFixed(2)}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Siempre detener propagación en el botón de compra
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

      {/* --- MODAL DE PRODUCTO --- */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        gallery={gallery}
        config={config}
        onAddToCart={(p) => {
           // Cerrar modal al agregar? Opcional. Dejamos abierto por ahora para UX de "seguir viendo".
           // O tal vez mostrar toast.
           // El StoreClient maneja el toast.
           if (onAddToCart) onAddToCart(p);
           setIsModalOpen(false); // Cerramos por UX más limpia
        }}
      />
    </>
  )
}
