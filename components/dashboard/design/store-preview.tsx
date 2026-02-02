'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Smartphone, Check, Link2 as LinkIcon, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DesignConfig } from '@/lib/types/design-system';
import { Database } from '@/utils/supabase/types';
import { ProductCard } from '@/components/store/product-card';
import { PLATFORMS } from './constants';

type Product = Database['public']['Tables']['products']['Row'];

type SelectionState = {
  productId: string;
  elementType: 'container' | 'title' | 'price' | 'cartButton' | 'description';
} | null;

interface StorePreviewProps {
  config: DesignConfig;
  products: Product[];
  activeTool: string | null;
  onSelectTool: (tool: string) => void;
  selection: SelectionState;
  onSelectElement: (productId: string, elementType: 'container' | 'title' | 'price' | 'cartButton' | 'description') => void;
}

export function StorePreview({
  config,
  products,
  activeTool,
  onSelectTool,
  selection,
  onSelectElement
}: StorePreviewProps) {

  // Helper for Text Styles
  const getTextStyle = (type: 'title' | 'bio') => {
    const styleConfig = type === 'title' ? config.profile.titleStyle : config.profile.bioStyle;
    return {
      fontFamily: styleConfig?.fontFamily || (type === 'title' ? config.fonts.heading : config.fonts.body),
      fontWeight: styleConfig?.bold ? 'bold' : 'normal',
      fontStyle: styleConfig?.italic ? 'italic' : 'normal',
      textTransform: styleConfig?.uppercase ? 'uppercase' : 'none',
      textAlign: styleConfig?.align || 'center',
      color: styleConfig?.color || config.colors.text,
      fontSize: styleConfig?.size ? `${styleConfig.size}px` : undefined,
    } as React.CSSProperties;
  };

  // Avatar Classes
  const avatarClasses = useMemo(() => {
    switch(config.profile.avatarShape) {
      case 'none': return 'rounded-none';
      case 'square': return 'rounded-2xl';
      case 'rounded': return 'rounded-2xl';
      case 'circle':
      default: return 'rounded-full';
    }
  }, [config.profile.avatarShape]);

  return (
      <div className="flex justify-center px-4 pt-20 pb-32">
         <div className="w-full max-w-[420px] origin-top scale-[0.95] md:scale-100 transition-transform">
            <div
               className="min-h-[800px] pb-40 relative rounded-[32px] overflow-hidden"
               style={{ backgroundColor: config.colors.background || '#ffffff' }}
               onClick={(e) => e.stopPropagation()}
            >
               {/* User Background Image */}
               {config.backgroundImage && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                     <img
                        src={config.backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover"
                        style={{ opacity: config.backgroundOpacity ?? 0.5 }}
                     />
                  </div>
               )}

               <div className="relative z-10 pt-16 px-6 text-center">
                   {/* 1. HEADER SECTIONS */}

                   {/* AVATAR */}
                   <div
                     className="relative mb-6 inline-block group cursor-pointer"
                     onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool('header-avatar');
                     }}
                   >
                       <div className={cn(
                          "relative h-32 w-32 overflow-hidden ring-4 ring-white/50 shadow-xl transition-all",
                          avatarClasses,
                          activeTool === 'header-avatar' && "ring-blue-500 scale-105"
                       )}>
                           {config.profile.avatarUrl ? (
                               <Image src={config.profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                   <Smartphone className="w-10 h-10" />
                               </div>
                           )}
                       </div>
                       <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className="w-4 h-4 text-blue-500" />
                       </div>
                   </div>

                   {/* SHOP NAME */}
                   <div className="mb-3">
                       <input
                         type="text"
                         value={config.profile.shopName || ''}
                         placeholder="Tu Tienda"
                         readOnly // Make readOnly so clicking opens drawer instead of keyboard
                         className={cn(
                           "bg-transparent border-none outline-none text-center w-full text-2xl font-bold tracking-tight placeholder:text-neutral-400/50 cursor-pointer",
                           activeTool === 'header-title' && "ring-2 ring-blue-500/50 rounded-lg bg-blue-50/10"
                         )}
                         style={getTextStyle('title')}
                         onClick={(e) => { e.stopPropagation(); onSelectTool('header-title'); }}
                       />
                   </div>

                   {/* SOCIALS */}
                   <div className="flex flex-wrap justify-center gap-3 mb-6">
                       {config.socialLinks.map((link) => {
                           const platformDef = PLATFORMS.find(p => p.id === link.platform);
                           const Icon = platformDef?.icon || LinkIcon;
                           return (
                               <div
                                  key={link.id}
                                  className="flex flex-col items-center gap-1"
                               >
                                   <div
                                      className="p-3 rounded-full transition-all border border-gray-100 shadow-sm"
                                      style={{
                                          backgroundColor: config.socialStyle?.buttonColor || '#f9fafb',
                                          color: link.color || config.socialStyle?.iconColor || '#4b5563'
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
                               </div>
                           )
                       })}
                       {config.socialLinks.length === 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onSelectTool('social-global'); }}
                            className="flex items-center gap-2 text-xs text-gray-400 border border-dashed border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                             <Plus className="w-3 h-3" /> Agregar Redes
                          </button>
                       )}
                   </div>

                   {/* BIO */}
                   <div className="mb-8">
                       <textarea
                         value={config.profile.bio || ''}
                         placeholder="Mensaje de bienvenida..."
                         readOnly
                         rows={2}
                         className={cn(
                           "bg-transparent border-none outline-none text-center w-full resize-none text-sm leading-relaxed placeholder:italic placeholder:opacity-50 placeholder:text-gray-400 rounded-lg cursor-pointer",
                           activeTool === 'header-bio' && "ring-2 ring-blue-500/50 bg-blue-50/10"
                         )}
                         style={getTextStyle('bio')}
                         onClick={(e) => { e.stopPropagation(); onSelectTool('header-bio'); }}
                       />
                   </div>

                   {/* 2. PRODUCTS */}
                   <div className="pb-12 text-left">
                       {products.length > 0 ? (
                           <div className="grid grid-cols-2 gap-4">
                              {products.map((p) => {
                                  const isProductSelected = activeTool === 'product-individual' && selection?.productId === p.id;
                                  return (
                                  <div
                                    key={p.id}
                                    className={cn(
                                        "relative transition-all duration-300",
                                        isProductSelected && "ring-2 ring-blue-500 rounded-2xl scale-[1.02]"
                                    )}
                                  >
                                     <ProductCard
                                        product={p}
                                        config={config}
                                        onSelectElement={(elementType) => {
                                            onSelectElement(p.id, elementType);
                                        }}
                                     />
                                  </div>
                              )})}
                           </div>
                       ) : (
                           <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                                <ShoppingBag className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm font-medium text-gray-500">Tu tienda está vacía</p>
                           </div>
                       )}
                   </div>

               </div>
            </div>
         </div>
      </div>
  );
}
