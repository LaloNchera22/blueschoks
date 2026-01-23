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
  const { avatarClasses, shapeClass, frameStyle, borderColor } = useMemo(() => {
    const frameStyle = (config.profile as any).frameStyle || config.profile.avatarShape || 'circle';
    const borderColor = (config.profile as any).borderColor || config.profile.avatarBorderColor || '#ffffff';

    const shapeClass = cn(
      frameStyle === 'circle' && "rounded-full",
      (frameStyle === 'square' || frameStyle === 'rounded') && "rounded-2xl",
      frameStyle === 'none' && "rounded-none"
    );

    const avatarClasses = cn(
      "relative h-32 w-32 overflow-hidden shadow-xl",
      shapeClass,
      frameStyle === 'none' ? "border-0" : "border-4"
    );

    return { avatarClasses, shapeClass, frameStyle, borderColor };
  }, [config.profile]);

  const socialLinks = Array.isArray(config?.socialLinks) ? config.socialLinks.filter(l => l.active) : []

  return (
    <main className="min-h-screen w-full flex justify-center bg-gray-50/50">
       {/* Mobile Container */}
      <div
        className="w-full max-w-md min-h-screen shadow-xl overflow-hidden relative overflow-y-auto"
        style={{ backgroundColor: bgColor, color: textColor, fontFamily: config.fonts.body }}
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
                <div className="relative mb-6">
                    <div className={cn(
                        "absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 blur opacity-50",
                         shapeClass
                    )}></div>
                    <div
                        className={avatarClasses}
                        style={{ borderColor: frameStyle !== 'none' ? borderColor : 'transparent' }}
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
                  className="text-3xl font-extrabold tracking-tight mb-3"
                  style={getTextStyle('title') as React.CSSProperties}
                >
                    {config.profile.shopName || 'Mi Tienda'}
                </h1>

                {/* BIO */}
                <p
                  className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-6 font-medium opacity-90"
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

            {/* Footer Credits */}
            <div className="text-center py-12 opacity-40">
                <p className="text-[10px] font-medium">Powered by EzShop</p>
            </div>

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
