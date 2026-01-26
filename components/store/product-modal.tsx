"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Database } from '@/utils/supabase/types'
import { DesignConfig } from '@/lib/types/design-system'

type Product = Database['public']['Tables']['products']['Row']

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  gallery: string[]
  config: DesignConfig
  onAddToCart?: (product: Product) => void
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  gallery,
  config,
  onAddToCart
}: ProductModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
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

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url)
  const currentMedia = gallery[currentIndex]

  // Styles from config
  const style = product.style_config || {}
  const cardStyle = config?.cardStyle || {
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
  }
  const globalColors = config?.colors || { text: '#1f2937' }

  const titleFont = style.titleFont || config?.fonts?.heading
  const priceFont = style.priceFont || config?.fonts?.body
  const titleColor = style.titleColor || globalColors.text
  const priceColor = style.priceColor || globalColors.text

  const btnBg = style.cartBtnBackground || cardStyle.buttonColor
  const btnColor = style.cartBtnColor || cardStyle.buttonTextColor

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white gap-0 border-none sm:rounded-2xl md:h-[600px] h-[90vh] flex flex-col md:flex-row">
        {/* Hidden Accessibility Title */}
        <DialogTitle className="sr-only">
          {product.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detalles del producto {product.name}
        </DialogDescription>

        {/* --- LEFT: CAROUSEL --- */}
        <div
          className="relative w-full md:w-1/2 h-[40vh] md:h-full bg-gray-50 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {isVideo(currentMedia) ? (
            <video
              src={currentMedia}
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          ) : (
            <div className="relative w-full h-full">
               <Image
                src={currentMedia}
                alt={product.name}
                fill
                className="object-cover md:object-contain" // Cover on mobile for impact, contain on desktop for details
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-all active:scale-95 z-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-all active:scale-95 z-50"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-50">
                {gallery.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                      idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- RIGHT: DETAILS --- */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Close Button (Visible on Desktop, usually Dialog has one but we might want a custom one or rely on default) */}
             {/* The default DialogClose is top-right of content. Since we split content, it might overlap image or text depending on Z-index.
                 ShadCN's Close is absolute right-4 top-4. It will be over the text part if we are in flex-row.
                 It will be white or dark? Default is generic. Let's ensure it's visible.
             */}

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div>
                  <h2
                    className="text-2xl font-bold leading-tight mb-2"
                    style={{ fontFamily: titleFont, color: titleColor }}
                  >
                    {product.name}
                  </h2>
                  <p
                    className="text-xl font-semibold opacity-90"
                    style={{ fontFamily: priceFont, color: priceColor }}
                  >
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                   {product.description}
                </div>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <Button
                onClick={() => onAddToCart && onAddToCart(product)}
                className="w-full h-12 text-lg font-medium rounded-xl shadow-md transition-transform active:scale-[0.98]"
                style={{
                  backgroundColor: btnBg,
                  color: btnColor
                }}
              >
                Agregar al Carrito - ${product.price.toFixed(2)}
              </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
