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
  ExternalLink,
  Smartphone,
  Link as LinkIcon
} from 'lucide-react'
import { DesignConfig } from '@/lib/types/design-system'
import { Database } from '@/utils/supabase/types'
import { useCart } from '@/components/shop/cart-context'
import CartSidebar from '@/components/shop/cart-sidebar'
import { StoreHeader } from '@/components/store/store-header'
import { ProductGrid } from '@/components/store/product-grid'
import { cn } from '@/lib/utils'

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
  { id: 'twitter', icon: Twitter, label: 'Twitter' },
  { id: 'facebook', icon: Facebook, label: 'Facebook' },
  { id: 'website', icon: Globe, label: 'Website' },
  { id: 'email', icon: Mail, label: 'Email' },
  { id: 'other', icon: LinkIcon, label: 'Otro' },
]

export default function StoreClient({ profile, products, config }: StoreClientProps) {

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
  const avatarBorderColor = config.profile?.avatarBorderColor || '#ffffff';

  const shapeClass = useMemo(() => {
    if (avatarShape === 'none') return 'rounded-none';
    if (avatarShape === 'square' || avatarShape === 'rounded') return 'rounded-2xl';
    return 'rounded-full';
  }, [avatarShape]);

  const socialLinks = Array.isArray(config?.socialLinks) ? config.socialLinks.filter(l => l.active) : []

  return (
    <main
      className="min-h-screen w-full flex justify-center items-center py-8 bg-gray-50"
      style={{ backgroundColor: bgColor }}
    >
       {/* Mobile Container - Premium Glassmorphism */}
      <div
        className="w-full max-w-[430px] h-[90vh] rounded-[32px] border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden relative overflow-y-auto"
        style={{ color: textColor, fontFamily: config.fonts.body }}
      >
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
                                   <Icon className="w-5 h-5" />
                               </Link>
                           )
                       })}
                   </div>
                )}
            </div>

            {/* --- PRODUCT GRID --- */}
            <div className="px-4">
               <ProductGrid products={products} config={config} />
            </div>

            {/* FOOTER: POWER BY BLUESHOCKS (Minimalist) */}
            <footer className="mt-auto py-12 w-full flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                Powered by
              </span>
              <a
                href="https://blueshocks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-neutral-800 hover:text-black font-semibold"
              >
                <div className="w-4 h-4 bg-green-500 rounded-sm text-white flex items-center justify-center font-bold text-[8px]">
                  B
                </div>
                <span className="text-[11px] tracking-wide">BLUESHOCKS</span>
              </a>
            </footer>

          </div>

          {/*
            Slide-over Cart Drawer
            Pass profile shop info for WhatsApp link generation
          */}
          <CartSidebar shop={{ whatsapp: config.checkout.whatsappNumber || profile.whatsapp || '', shop_name: config.profile.shopName || profile.shop_name }} />

      </div>
    </main>
  )
}
