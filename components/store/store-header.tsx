"use client"

import React from 'react'
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
  ShoppingBag,
  Link as LinkIcon
} from 'lucide-react'
import { DesignConfig, LinkItem } from '@/lib/types/design-system'
import { useCart } from '@/components/shop/cart-context'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

interface StoreHeaderProps {
  config: DesignConfig
}

const OnlyFansIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.426 3.018a9.423 9.423 0 0 0-3.344.606 8.32 8.32 0 0 0-4.707-1.42 8.356 8.356 0 0 0-8.375 8.337 8.356 8.356 0 0 0 8.375 8.338 8.32 8.32 0 0 0 4.67-1.405 9.42 9.42 0 1 0 3.38-14.456zm-7.98 12.875a5.454 5.454 0 1 1 5.474-5.454 5.467 5.467 0 0 1-5.474 5.454zm7.98-1.57a6.6 6.6 0 1 1 6.598-6.6 6.612 6.612 0 0 1-6.598 6.6zM15.5 8.5l-2.5 4h5l-2.5-4z"/>
  </svg>
);

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram className="w-5 h-5" />
    case 'twitter': return <Twitter className="w-5 h-5" />
    case 'facebook': return <Facebook className="w-5 h-5" />
    case 'whatsapp': return <MessageCircle className="w-5 h-5" />
    case 'website': return <Globe className="w-5 h-5" />
    case 'email': return <Mail className="w-5 h-5" />
    // Generic Icon Rule for Specific Networks
    case 'tiktok':
    case 'onlyfans':
    case 'telegram':
      return <LinkIcon className="w-5 h-5" />
    default: return <ExternalLink className="w-5 h-5" />
  }
}

const getSocialLabel = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return 'Instagram'
    case 'tiktok': return 'TikTok'
    case 'twitter': return 'Twitter'
    case 'facebook': return 'Facebook'
    case 'whatsapp': return 'WhatsApp'
    case 'onlyfans': return 'OnlyFans'
    case 'website': return 'Web'
    case 'email': return 'Email'
    case 'telegram': return 'Telegram'
    default: return platform.charAt(0).toUpperCase() + platform.slice(1)
  }
}

export function StoreHeader({ config }: StoreHeaderProps) {
  const { cartCount, openCart } = useCart()

  const shopName = config?.profile?.shopName || 'Mi Tienda'
  const bio = config?.profile?.bio
  const avatarUrl = config?.profile?.avatarUrl || 'https://via.placeholder.com/150'
  const socialLinks = Array.isArray(config?.socialLinks) ? config.socialLinks.filter(l => l.active) : []

  // Derived styles
  const primaryColor = config?.colors?.primary || '#000000'
  const textColor = config?.colors?.text || '#1f2937'

  return (
    <div className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-gray-100/50 shadow-sm" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">

          {/* Left: Brand / Avatar (Small version for sticky header could go here, but for now we keep it centered or simple) */}
          <div className="flex items-center gap-3">
             {/* Mobile: Show small avatar next to name if scrolled? For now, keep it simple. */}
             <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 shadow-sm relative md:hidden">
                <Image src={avatarUrl} alt={shopName} fill className="object-cover" />
             </div>
             <span className="font-bold text-lg tracking-tight md:hidden" style={{ color: textColor }}>{shopName}</span>
          </div>

          {/* Right: Cart Trigger */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100/80 transition-all"
              onClick={openCart}
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-6 w-6" style={{ color: textColor }} strokeWidth={2} />
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px] border-2 border-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Hero Section (Only visible when at top usually, but here we integrate it into the flow) */}
        {/* We will render the large hero OUTSIDE the sticky header in the main layout,
            so this component handles the 'sticky' top bar + controls.
            However, for this specific request, the user wants a "Header (Hero Section)".

            Let's split: StoreNavbar (Sticky) vs StoreHero (Content).
        */}
      </div>
    </div>
  )
}

export function StoreHero({ config }: StoreHeaderProps) {
    const shopName = config?.profile?.shopName || 'Mi Tienda'
    const bio = config?.profile?.bio
    const avatarUrl = config?.profile?.avatarUrl || 'https://via.placeholder.com/150'
    const socialLinks = Array.isArray(config?.socialLinks) ? config.socialLinks.filter(l => l.active) : []

    const primaryColor = config?.colors?.primary || '#000000'
    const textColor = config?.colors?.text || '#1f2937'

    const avatarShapeClass = React.useMemo(() => {
        switch (config?.profile?.avatarShape) {
            case 'none': return 'rounded-none'
            case 'square': return 'rounded-2xl'
            case 'rounded': return 'rounded-2xl'
            case 'circle':
            default: return 'rounded-full'
        }
    }, [config?.profile?.avatarShape])

    return (
        <div className="flex flex-col items-center text-center pt-8 pb-10 px-4">
            <div className="relative mb-6 group">
                <div className={cn(
                    "absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 blur opacity-50 group-hover:opacity-75 transition duration-500",
                    avatarShapeClass
                )}></div>
                <div className={cn(
                    "relative h-32 w-32 overflow-hidden border-4 border-white shadow-xl",
                    avatarShapeClass
                )}>
                    <Image
                        src={avatarUrl}
                        alt={shopName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                    />
                </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: textColor }}>
                {shopName}
            </h1>

            {bio && (
                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-6 font-medium opacity-90">
                    {bio}
                </p>
            )}

             {/* Social Links */}
             {socialLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-1 min-w-[60px]"
                    >
                      <div className="p-3 rounded-full bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900 group-hover:scale-110 transition-all duration-300 border border-gray-100 shadow-sm">
                        {getSocialIcon(link.platform)}
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                        {getSocialLabel(link.platform)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
        </div>
    )
}
