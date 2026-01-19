"use client"

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Instagram,
  Twitter,
  Facebook,
  Globe,
  MessageCircle,
  Mail,
  Music2,
  ShoppingCart,
  Plus,
  ExternalLink
} from 'lucide-react'
import { DesignConfig, LinkItem } from '@/lib/types/design-system'
import { Database } from '@/utils/supabase/types'
import { useCart } from '@/components/shop/cart-context'
import { cn } from '@/lib/utils'

type Profile = Database['public']['Tables']['profiles']['Row']
type Product = Database['public']['Tables']['products']['Row']

interface StoreClientProps {
  profile: Profile
  products: Product[]
  config: DesignConfig
}

// Helper to get Social Icons
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram className="w-6 h-6" />
    case 'tiktok': return <Music2 className="w-6 h-6" />
    case 'twitter': return <Twitter className="w-6 h-6" />
    case 'facebook': return <Facebook className="w-6 h-6" />
    case 'whatsapp': return <MessageCircle className="w-6 h-6" />
    case 'website': return <Globe className="w-6 h-6" />
    case 'email': return <Mail className="w-6 h-6" />
    default: return <ExternalLink className="w-6 h-6" />
  }
}

export default function StoreClient({ profile, products, config }: StoreClientProps) {
  const { addToCart, cartCount, openCart } = useCart()

  // --- Styles from Config (Robust Fallbacks) ---
  const bgColor = config?.colors?.background || '#f3f4f6'
  const textColor = config?.colors?.text || '#1f2937'
  const primaryColor = config?.colors?.primary || '#000000'
  const cardBg = config?.colors?.cardBackground || '#ffffff'

  const shopName = config?.profile?.shopName || profile.shop_name || 'Mi Tienda'
  const bio = config?.profile?.bio || 'Bienvenido a mi tienda online.'
  // Prioritize config avatar, fall back to profile avatar, then placeholder
  const avatarUrl = config?.profile?.avatarUrl || profile.avatar_url || 'https://via.placeholder.com/150'

  const socialLinks = useMemo(() => {
    if (Array.isArray(config?.socialLinks)) {
        return config.socialLinks.filter(l => l.active);
    }
    return [];
  }, [config?.socialLinks]);

  return (
    <div
      className="min-h-screen pb-20 transition-colors duration-300"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* --- Sticky Cart Button (Floating) --- */}
      {cartCount > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full px-6 py-4 shadow-xl transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: primaryColor, color: cardBg }}
        >
          <ShoppingCart className="mr-2 w-5 h-5" />
          <span className="font-bold">Ver Carrito ({cartCount})</span>
        </button>
      )}

      <div className="mx-auto max-w-md px-4 pt-12 md:max-w-2xl md:pt-16 lg:max-w-4xl">

        {/* --- Header Section --- */}
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full shadow-lg ring-4 ring-offset-2 ring-offset-transparent" style={{ borderColor: primaryColor }}>
            <Image
              src={avatarUrl}
              alt={shopName}
              fill
              className="object-cover"
              priority
            />
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {shopName}
          </h1>

          {bio && (
            <p className="max-w-lg text-lg opacity-80">
              {bio}
            </p>
          )}

          {/* --- Social Links --- */}
          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-3 transition-all hover:scale-110 hover:opacity-80"
                  style={{ backgroundColor: cardBg, color: primaryColor }}
                >
                  {getSocialIcon(link.platform)}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* --- Product Grid --- */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: cardBg }}
            >
              {/* Image Aspect Ratio Wrapper */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                   <div className="flex h-full w-full items-center justify-center text-gray-400">
                     <span className="text-xs">Sin imagen</span>
                   </div>
                )}

                {/* Add to Cart Overlay Button */}
                <button
                  onClick={() => addToCart({ id: product.id, price: product.price, name: product.name, image_url: product.image_url || undefined })}
                  className="absolute bottom-3 right-3 rounded-full p-2.5 shadow-lg transition-transform hover:scale-110 active:scale-90 md:bottom-4 md:right-4"
                  style={{ backgroundColor: primaryColor, color: cardBg }}
                  aria-label="Agregar al carrito"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3 md:p-4">
                <h3 className="truncate text-sm font-semibold md:text-base">
                  {product.name}
                </h3>
                <p className="mt-1 font-bold" style={{ color: primaryColor }}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="py-20 text-center opacity-60">
            <p>No hay productos disponibles por el momento.</p>
          </div>
        )}

      </div>

      {/* Simple Footer */}
      <footer className="mt-20 py-8 text-center text-xs opacity-40">
        <p>Powered by EzShop</p>
      </footer>
    </div>
  )
}
