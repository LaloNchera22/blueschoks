"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Database } from '@/utils/supabase/types'
import { DesignConfig } from '@/lib/types/design-system'
import { ProductCard } from './product-card'

type Product = Database['public']['Tables']['products']['Row']

interface ProductGridProps {
  products: Product[]
  config: DesignConfig
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
}

export function ProductGrid({ products, config }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center opacity-60">
        <p className="text-lg font-medium">No hay productos disponibles por el momento.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} config={config} />
        </motion.div>
      ))}
    </motion.div>
  )
}
