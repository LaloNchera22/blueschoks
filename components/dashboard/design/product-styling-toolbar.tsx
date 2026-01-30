import React from 'react';
import { Loader2, Check, Minus, Copy, ChevronDown, X } from 'lucide-react';
import { ProductStyle } from '@/lib/types/design-system';
import { Database } from '@/utils/supabase/types';
import { ColorCircle } from './color-circle';
import { FontPicker } from './font-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductStylingToolbarProps {
  product: Product;
  activeElement: 'container' | 'title' | 'price' | 'cartButton' | 'description';
  onUpdate: (key: keyof ProductStyle, value: string | undefined) => void;
  onSave: () => void;
  onApplyAll: () => void;
  onClose: () => void;
  isSaving: boolean;
  fonts: { name: string, value: string }[];
  defaultColors: {
    title: string;
    price: string;
    button?: string;
    buttonText?: string;
  };
}

export function ProductStylingToolbar({
  product,
  activeElement,
  onUpdate,
  onSave,
  onApplyAll,
  onClose,
  isSaving,
  fonts,
  defaultColors
}: ProductStylingToolbarProps) {
  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 w-full justify-between">

      {/* Container Tools - Refactored with Popover */}
      {activeElement === 'container' && (() => {
        const isCardTransparent = product.style_config?.cardBackground === 'transparent' || product.style_config?.cardBackground === 'rgba(0,0,0,0)';
        const cardColor = isCardTransparent ? '#ffffff' : (product.style_config?.cardBackground || '#ffffff');

        return (
          <Popover open={true} onOpenChange={(open) => !open && onClose()}>
            <PopoverTrigger asChild>
              <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                 <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 border border-white rounded-sm" />
                 </div>
              </div>
            </PopoverTrigger>

             {/* Floating Panel */}
             <PopoverContent
                className="w-64 max-w-[90vw] p-4 flex flex-col gap-4 bg-white"
                side="bottom"
                sideOffset={16}
                onOpenAutoFocus={(e) => e.preventDefault()}
             >
                <div className="flex justify-end items-center border-b border-gray-100 pb-2 mb-1">
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>

                {/* 1. Main Card Background */}
                <div>
                   {/* SELECCIÓN DE MODO: TABS VISUALES */}
                   <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
                     <button
                       onClick={(e) => { e.stopPropagation(); onUpdate('cardBackground', 'transparent'); }}
                       className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${isCardTransparent ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                       Invisible
                     </button>
                     <button
                       onClick={(e) => { e.stopPropagation(); onUpdate('cardBackground', '#ffffff'); }}
                       className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${!isCardTransparent ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                       Color
                     </button>
                   </div>

                   {/* CONTENIDO CONDICIONAL */}
                   {isCardTransparent ? (
                      <div className="text-center py-4 px-2 bg-gray-50 rounded border border-dashed border-gray-300">
                         <div className="w-full h-4 bg-[url('https://placehold.co/100x4/transparent')] opacity-30 rounded"></div>
                      </div>
                   ) : (
                      <div className="flex items-center gap-2 px-2 py-2 rounded-md border border-gray-200 animate-in fade-in zoom-in duration-200">
                         <ColorCircle
                            color={cardColor}
                            onChange={(val) => onUpdate('cardBackground', val)}
                            size="md"
                          />
                      </div>
                   )}
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* 2. Footer Info Background */}
                <div>
                   <div className="flex items-center gap-3">
                      <ColorCircle
                        color={product.style_config?.footerBackground || '#ffffff'}
                        onChange={(c) => onUpdate('footerBackground', c)}
                        size="md"
                      />
                      {product.style_config?.footerBackground && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onUpdate('footerBackground', undefined); }}
                          className="ml-auto text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                        >
                          Limpiar
                        </button>
                      )}
                   </div>
                </div>

                {/* --- SECCIÓN NUEVA: FORMA DE IMAGEN --- */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                   <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
                     {/* Opción 1: CUADRADA */}
                     <button
                       onClick={(e) => { e.stopPropagation(); onUpdate('imageShape', 'square'); }}
                       className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${
                         product.style_config?.imageShape === 'square'
                           ? 'bg-white shadow-sm text-black ring-1 ring-black/5'
                           : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                       }`}
                     >
                       <div className="w-3 h-3 border border-current bg-current opacity-20 rounded-none"></div>
                     </button>

                     {/* Opción 2: REDONDA (Default) */}
                     <button
                       onClick={(e) => { e.stopPropagation(); onUpdate('imageShape', 'rounded'); }}
                       className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${
                         (!product.style_config?.imageShape || product.style_config?.imageShape === 'rounded')
                           ? 'bg-white shadow-sm text-black ring-1 ring-black/5'
                           : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                       }`}
                     >
                       <div className="w-3 h-3 border border-current bg-current opacity-20 rounded-full"></div>
                     </button>
                   </div>
                </div>
             </PopoverContent>
          </Popover>
        );
      })()}

      {/* Title Tools */}
      {activeElement === 'title' && (
        <div className="flex gap-2 items-center flex-1">
          {/* Title Font */}
          <div className="flex flex-col items-center gap-0.5">
            <FontPicker
              value={product.style_config?.titleFont || ''}
              onChange={(val) => onUpdate('titleFont', val || undefined)}
              className="w-20"
            />
          </div>

          {/* Title Color */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 relative scale-90">
              <ColorCircle
                color={product.style_config?.titleColor || defaultColors.title}
                onChange={(c) => onUpdate('titleColor', c)}
                size="sm"
              />
              {product.style_config?.titleColor && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdate('titleColor', undefined); }}
                  className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                  title="Reset color"
                >
                  <Minus size={10} className="text-gray-600" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Tools */}
      {activeElement === 'price' && (
        <div className="flex gap-2 items-center flex-1">
          {/* Price Font */}
          <div className="flex flex-col items-center gap-0.5">
            <FontPicker
              value={product.style_config?.priceFont || ''}
              onChange={(val) => onUpdate('priceFont', val || undefined)}
              className="w-20"
            />
          </div>

          {/* Price Color */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 relative scale-90">
              <ColorCircle
                color={product.style_config?.priceColor || defaultColors.price}
                onChange={(c) => onUpdate('priceColor', c)}
                size="sm"
              />
              {product.style_config?.priceColor && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdate('priceColor', undefined); }}
                  className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                  title="Reset color"
                >
                  <Minus size={10} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Button Tools */}
      {activeElement === 'cartButton' && (
        <div className="flex gap-2 items-center flex-1">
          {/* Button Background */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 relative scale-90">
              <ColorCircle
                color={product.style_config?.cartBtnBackground || defaultColors.button || '#000000'}
                onChange={(c) => onUpdate('cartBtnBackground', c)}
                size="sm"
              />
              {product.style_config?.cartBtnBackground && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdate('cartBtnBackground', undefined); }}
                  className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                  title="Reset color"
                >
                  <Minus size={10} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Button Icon/Text Color */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 relative scale-90">
              <ColorCircle
                color={product.style_config?.cartBtnColor || defaultColors.buttonText || '#ffffff'}
                onChange={(c) => onUpdate('cartBtnColor', c)}
                size="sm"
              />
              {product.style_config?.cartBtnColor && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdate('cartBtnColor', undefined); }}
                  className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                  title="Reset color"
                >
                  <Minus size={10} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Description Tools - Refactored with Popover */}
      {activeElement === 'description' && (() => {
        const isDescTransparent = product.style_config?.descriptionBackground === 'transparent' || product.style_config?.descriptionBackground === 'rgba(0,0,0,0)';
        const currentColor = isDescTransparent ? '#ffffff' : (product.style_config?.descriptionBackground || product.style_config?.footerBackground || '#ffffff');

        return (
          <Popover open={true} onOpenChange={(open) => !open && onClose()}>
             <PopoverTrigger asChild>
                <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                   <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                      <div className="w-3.5 h-3.5 flex flex-col gap-0.5">
                         <div className="w-full h-px bg-current opacity-80" />
                         <div className="w-full h-px bg-current opacity-80" />
                         <div className="w-2/3 h-px bg-current opacity-80" />
                      </div>
                   </div>
                </div>
             </PopoverTrigger>

             {/* Floating Panel */}
             <PopoverContent
                className="w-64 max-w-[90vw] p-4 flex flex-col gap-4 bg-white"
                side="bottom"
                sideOffset={16}
                onOpenAutoFocus={(e) => e.preventDefault()}
             >
                <div className="flex justify-end items-center border-b border-gray-100 pb-2 mb-2">
                   <button onClick={onClose} className="text-gray-400 hover:text-black">
                     <X className="w-4 h-4" strokeWidth={1.5} />
                   </button>
                </div>

                {/* SELECCIÓN DE MODO: TABS VISUALES */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdate('descriptionBackground', 'transparent'); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${isDescTransparent ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Invisible
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdate('descriptionBackground', '#ffffff'); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${!isDescTransparent ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Color
                  </button>
                </div>

                {/* CONTENIDO CONDICIONAL */}
                {isDescTransparent ? (
                   <div className="text-center py-4 px-2 bg-gray-50 rounded border border-dashed border-gray-300">
                      <div className="w-full h-4 bg-[url('https://placehold.co/100x4/transparent')] opacity-30 rounded"></div>
                   </div>
                ) : (
                   <div>
                      <div className="flex items-center gap-2">
                        <ColorCircle
                          color={currentColor}
                          onChange={(val) => onUpdate('descriptionBackground', val)}
                          size="md"
                        />
                      </div>
                   </div>
                )}

                <button onClick={onApplyAll} className="mt-2 w-full py-2 bg-black text-white text-xs rounded hover:bg-neutral-800">
                  Aplicar a todos
                </button>
             </PopoverContent>
          </Popover>
        );
      })()}

      <div className="w-px h-6 bg-gray-200" />

      {/* Apply to All */}
      <button
        onClick={onApplyAll}
        disabled={isSaving}
        className="flex flex-col items-center gap-0.5 group"
        title="Aplicar a todos"
      >
        <div className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all text-gray-600">
          <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
        </div>
      </button>

      {/* Specific Save Button */}
      {/*
        NOTE: Removed the Save button from here if it is duplicate or if space is tight.
        But standard implementation had it.
        Let's keep it but compact.
      */}
      {/*
        Actually DesignEditor has a global SAVE button on the right.
        ProductStylingToolbar hides it with `activeTool !== 'product-individual'` condition in parent?
        No, logic in parent:
        `{activeTool !== 'product-individual' && ( ... Save Button ... )}`
        So when `product-individual` is active, parent hides global save button, relying on this one.
      */}

      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex flex-col items-center gap-0.5 group"
        title="Guardar cambios del producto"
      >
        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all shadow-sm">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" strokeWidth={1.5} />}
        </div>
      </button>

      <div className="w-px h-6 bg-gray-200" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex flex-col items-center gap-0.5 group"
        title="Cerrar selección"
      >
         <div className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-gray-500">
           <X className="w-3.5 h-3.5" strokeWidth={1.5} />
         </div>
      </button>

    </div>
  );
}
