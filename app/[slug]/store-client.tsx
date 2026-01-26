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
  Smartphone,
  Link as LinkIcon,
  Send,
  Store
} from 'lucide-react'
import { OnlyFansLogo } from '@/components/icons/onlyfans-logo'
import { DesignConfig } from '@/lib/types/design-system'
import { Database } from '@/utils/supabase/types'
import { useCart } from '@/components/shop/cart-context'
import CartSidebar from '@/components/shop/cart-sidebar'
import { StoreHeader } from '@/components/store/store-header'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'
import { FontLoaderListener } from '@/components/ui/font-loader-listener'

type Profile = Database['public']['Tables']['profiles']['Row']
type Product = Database['public']['Tables']['products']['Row']

interface StoreClientProps {
  profile: Profile
  products: Product[]
  config: DesignConfig
}

const PLATFORMS = [
  { id: 'instagram', icon: Instagram, label: 'Instagram' },
  { id: 'tiktok', icon: Music2, label: 'TikTok' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { id: 'telegram', icon: Send, label: 'Telegram' },
  { id: 'onlyfans', icon: OnlyFansLogo, label: 'OnlyFans' },
  { id: 'twitter', icon: Twitter, label: 'Twitter' },
  { id: 'facebook', icon: Facebook, label: 'Facebook' },
  { id: 'website', icon: Store, label: 'Mi Tienda Web' },
  { id: 'email', icon: Mail, label: 'Email' },
  { id: 'other', icon: LinkIcon, label: 'Otro' },
]

export default function StoreClient({ profile, products, config }: StoreClientProps) {
  const { addToCart } = useCart()

  // Background style from config
  const bgColor = config?.colors?.background || '#ffffff'
  const textColor = config?.colors?.text || '#1f2937'

  // Helper for Text Styles (Copied from DesignEditor)
  const getTextStyle = (type: 'title' | 'bio') => {
    const styleConfig = type === 'title' ? config.profile.titleStyle : config.profile.bioStyle;
    return {
      fontFamily: styleConfig?.fontFamily || (type === 'title' ? config.fonts.heading : config.fonts.body),
      fontWeight: styleConfig?.bold ? 'bold' : 'normal',
      fontStyle: styleConfig?.italic ? 'italic' : 'normal',
      textAlign: styleConfig?.align || 'center',
      color: styleConfig?.color || config.colors.text,
      fontSize: styleConfig?.size ? `${styleConfig.size}px` : undefined,
    };
  };

  // Avatar Shape & Border Logic
  const avatarShape = config.profile?.avatarShape || 'circle';

  const shapeClass = useMemo(() => {
    if (avatarShape === 'none') return 'rounded-none';
    if (avatarShape === 'square' || avatarShape === 'rounded') return 'rounded-2xl';
    return 'rounded-full';
  }, [avatarShape]);

  const socialLinks = Array.isArray(config?.socialLinks) ? config.socialLinks.filter(l => l.active) : []

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative" style={{ backgroundColor: bgColor, color: textColor }}>
      <FontLoaderListener config={config} products={products} />

      {/* Background Image Layer */}
      {config.backgroundImage && (
        <div className="absolute inset-0 z-0 pointer-events-none">
           <Image
              src={config.backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              style={{ opacity: config.backgroundOpacity ?? 0.5 }}
              priority
           />
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL: Sin bordes blancos, sin bg-white fijo */}
      <div className="w-full max-w-[430px] min-h-screen relative z-10 flex flex-col shadow-2xl overflow-hidden">
          {/*
            Header Sticky Bar
            Contains: Small Logo (optional), Cart Trigger
          */}
          <StoreHeader config={config} />

          {/* Main Content Area */}
          <div className="pb-32">

            {/* --- HERO SECTION (Inlined from DesignEditor logic) --- */}
            <div className="flex flex-col items-center text-center pt-12 pb-6 px-6">

                {/* AVATAR */}
                {profile.is_pro && (
                  <div className="flex justify-center mb-6">
                    <div
                      className={cn(
                        "relative w-32 h-32 overflow-hidden ring-2 ring-offset-2 ring-neutral-900/10",
                        shapeClass
                      )}
                    >
                      {config.profile.avatarUrl ? (
                          <Image
                            src={config.profile.avatarUrl}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            priority
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                              <Smartphone className="w-10 h-10" />
                          </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SHOP NAME */}
                <h1
                  className="text-2xl font-bold text-neutral-900 tracking-tight mb-3"
                  style={getTextStyle('title') as React.CSSProperties}
                >
                    {config.profile.shopName || 'Mi Tienda'}
                </h1>

                {/* BIO */}
                <p
                  className="max-w-xl text-sm text-neutral-500 leading-relaxed mb-6"
                  style={getTextStyle('bio') as React.CSSProperties}
                >
                    {config.profile.bio || 'Bienvenido a mi tienda online'}
                </p>

                {/* SOCIALS */}
                {socialLinks.length > 0 && (
                   <div className="flex flex-wrap justify-center gap-3">
                       {socialLinks.map((link) => {
                           const Icon = PLATFORMS.find(p => p.id === link.platform)?.icon || LinkIcon;
                           return (
                               <Link
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 border border-gray-100 shadow-sm"
                                  style={{ color: link.color ? link.color : undefined }}
                               >
                                   <Icon size={28} strokeWidth={1.5} />
                               </Link>
                           )
                       })}
                   </div>
                )}
            </div>

            {/* --- PRODUCT GRID (INLINED) --- */}
            <div className="px-4">
               {products.length === 0 ? (
                  <div className="py-24 text-center opacity-60">
                    <p className="text-lg font-medium">No hay productos disponibles por el momento.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-2 gap-3 pb-32">
                      {products.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          config={config}
                          onAddToCart={addToCart} // ✅ Pasamos la función como prop
                        />
                      ))}
                  </div>
               )}
            </div>

            {/* FOOTER: POWER BY BLUESHOCKS (Minimalist) */}
            <footer className="w-full py-8 mt-auto flex justify-center items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
              <a
                href="https://blueshocks.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.2em] flex items-center gap-1.5"
                style={{
                  color: getTextStyle('title').color,
                  fontFamily: getTextStyle('title').fontFamily
                }}
              >
                <span className="font-light">Powered by</span>
                <span className="font-bold">BLUESHOCKS</span>
              </a>
            </footer>

          </div>

          {/*
            Slide-over Cart Drawer
            Pass profile shop info for WhatsApp link generation
          */}
          <CartSidebar shop={{ whatsapp: config.checkout.whatsappNumber || profile.whatsapp || '', shop_name: config.profile.shopName || profile.shop_name }} />

      </div>
    </div>
  )
}
