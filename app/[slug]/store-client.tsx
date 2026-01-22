"use client"

import React from 'react'
import { DesignConfig } from '@/lib/types/design-system'
import { Database } from '@/utils/supabase/types'
import { useCart } from '@/components/shop/cart-context'
import CartSidebar from '@/components/shop/cart-sidebar' // Reusing existing, will update style
import { StoreHeader, StoreHero } from '@/components/store/store-header'
import { ProductGrid } from '@/components/store/product-grid'

type Profile = Database['public']['Tables']['profiles']['Row']
type Product = Database['public']['Tables']['products']['Row']

interface StoreClientProps {
  profile: Profile
  products: Product[]
  config: DesignConfig
}

export default function StoreClient({ profile, products, config }: StoreClientProps) {

  // Background style from config
  const bgColor = config?.colors?.background || '#ffffff'
  const textColor = config?.colors?.text || '#1f2937'

  return (
    <div
      className="min-h-screen relative selection:bg-black/10"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/*
        Header Sticky Bar
        Contains: Small Logo (optional), Cart Trigger
      */}
      <StoreHeader config={config} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
        {/* Hero Section */}
        <StoreHero config={config} />

        {/* Product Grid */}
        <section className="mt-8">
            <ProductGrid products={products} config={config} />
        </section>
      </main>

      {/*
        Slide-over Cart Drawer
        Pass profile shop info for WhatsApp link generation
      */}
      <CartSidebar shop={{ whatsapp: config.checkout.whatsappNumber || profile.whatsapp || '', shop_name: config.profile.shopName || profile.shop_name }} />

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 py-12 mt-20 text-center">
        <p className="text-sm text-gray-400 font-medium">Powered by EzShop</p>
      </footer>
    </div>
  )
}
