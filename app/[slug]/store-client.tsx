"use client"

import React, { useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Instagram,
  Twitter,
  Facebook,
  Globe,
  MessageCircle,
  Mail,
  Smartphone,
  Link as LinkIcon,
  Store
} from 'lucide-react'
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
  { id: 'tiktok', icon: LinkIcon, label: 'TikTok' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { id: 'telegram', icon: LinkIcon, label: 'Telegram' },
  { id: 'onlyfans', icon: LinkIcon, label: 'OnlyFans' },
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

  useEffect(() => {
    // UNLOCK BODY FOR PUBLIC STORE NATURAL SCROLL
    document.body.style.setProperty('overflow', 'auto', 'important')
    document.body.style.setProperty('height', 'auto', 'important')
    document.body.style.setProperty('position', 'static', 'important')
    document.documentElement.style.setProperty('overflow', 'auto', 'important')
    document.documentElement.style.setProperty('height', 'auto', 'important')
    document.documentElement.style.setProperty('position', 'static', 'important')

    return () => {
      // RESTORE GLOBAL LOCK
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
      document.documentElement.style.position = ''
    }
  }, [])

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative" style={{ backgroundColor: bgColor, color: textColor }}>
      <FontLoaderListener config={config} products={products} />

      {/* Background Image Layer */}
      {/* DEFENSIVE RENDERING: Only render if valid string URL */}
      {config.backgroundImage &&
       typeof config.backgroundImage === 'string' &&
       config.backgroundImage.startsWith('http') && (
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
      <div className="w-full max-w-[430px] min-h-full relative z-10 flex flex-col shadow-2xl">
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
                        "relative w-32 h-32 overflow-hidden ring-2 ring-offset-2",
                        shapeClass
                      )}
                      style={{
                        '--tw-ring-color': config.profile.avatarBorderColor || 'rgba(23, 23, 23, 0.1)',
                      } as React.CSSProperties}
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

                {/* SOCIALS */}
                {socialLinks.length > 0 && (
                   <div className="flex flex-wrap justify-center gap-3 mb-6">
                       {socialLinks.map((link) => {
                           const platformDef = PLATFORMS.find(p => p.id === link.platform);
                           const Icon = platformDef?.icon || LinkIcon;

                           return (
                               <Link
                                  key={link.id}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex flex-col items-center gap-1 min-w-[60px]"
                               >
                                   <div
                                      className="p-3 rounded-full transition-all duration-300 border border-gray-100 shadow-sm hover:scale-105"
                                      style={{
                                          backgroundColor: config.socialStyle?.buttonColor || '#f9fafb',
                                          color: link.color ? link.color : (config.socialStyle?.iconColor || '#4b5563')
                                      }}
                                   >
                                       <Icon size={20} strokeWidth={1.5} />
                                   </div>
                                   <span
                                      className="text-[10px] font-medium transition-colors"
                                      style={{
                                          color: config.socialStyle?.textColor || '#6b7280',
                                          fontFamily: config.socialStyle?.font || config.fonts.body
                                      }}
                                   >
                                      {link.label || platformDef?.label || link.platform}
                                   </span>
                               </Link>
                           )
                       })}
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
                {config.profile.bio && config.profile.bio.trim().length > 0 && (
                  <p
                    className="max-w-xl text-sm text-neutral-500 leading-relaxed mb-6"
                    style={getTextStyle('bio') as React.CSSProperties}
                  >
                      {config.profile.bio}
                  </p>
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
