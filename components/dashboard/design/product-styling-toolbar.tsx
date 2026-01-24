import React from 'react';
import { Loader2, Save, Minus, Copy, ChevronDown, X, Ban, Check } from 'lucide-react';
import { ProductStyle } from '@/lib/types/design-system';
import { Database } from '@/utils/supabase/types';
import { ColorCircle } from './color-circle';

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
    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">

      {/* Container Tools - Refactored with Floating Panel */}
      {activeElement === 'container' && (() => {
        const isCardTransparent = product.style_config?.cardBackground === 'transparent';
        const cardColor = isCardTransparent ? '#ffffff' : (product.style_config?.cardBackground || '#ffffff');

        return (
          <div className="relative flex flex-col items-center gap-1">
             <span className="text-xs font-semibold text-gray-700">Fondo Tarjeta</span>

             {/* Floating Panel */}
             <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>

                {/* 1. Main Card Background */}
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Fondo General</label>
                   <div className="flex flex-col gap-2">
                      {/* Transparent Option */}
                      <button
                         onClick={(e) => { e.stopPropagation(); onUpdate('cardBackground', 'transparent'); }}
                         className={`flex items-center gap-2 px-2 py-2 rounded-md border w-full transition-all ${isCardTransparent ? 'bg-neutral-50 border-black ring-1 ring-black/5' : 'hover:bg-gray-50 border-gray-200'}`}
                       >
                         <div className="w-4 h-4 rounded border bg-[url('https://placehold.co/4x4/transparent')] opacity-50 shrink-0"></div>
                         <span className="text-xs font-medium">Invisible</span>
                         {isCardTransparent && <Check className="w-3 h-3 ml-auto text-green-600" />}
                       </button>

                       {/* Solid Color Option */}
                       {!isCardTransparent && (
                         <div className="flex items-center gap-2 px-2 py-2 rounded-md border border-gray-200 animate-in fade-in zoom-in duration-200">
                            <ColorCircle
                               color={cardColor}
                               onChange={(val) => onUpdate('cardBackground', val)}
                               size="sm"
                             />
                             <span className="text-xs text-gray-500">Color Sólido</span>
                         </div>
                       )}

                       {/* Restore button if transparent */}
                       {isCardTransparent && (
                           <button
                             onClick={(e) => { e.stopPropagation(); onUpdate('cardBackground', '#ffffff'); }}
                             className="text-xs text-blue-600 underline hover:text-blue-800 text-center w-full"
                           >
                               Restaurar color de fondo
                           </button>
                       )}
                   </div>
                </div>

                <div className="h-px bg-gray-100 w-full" />

                {/* 2. Footer Info Background */}
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Fondo Información (Footer)</label>
                   <div className="flex items-center gap-3">
                      <ColorCircle
                        color={product.style_config?.footerBackground || '#ffffff'}
                        onChange={(c) => onUpdate('footerBackground', c)}
                        size="md"
                      />
                      <span className="text-xs text-gray-400">
                        {product.style_config?.footerBackground ? 'Color activo' : 'Sin fondo (Hereda)'}
                      </span>
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

             </div>
          </div>
        );
      })()}

      {/* Title Tools */}
      {activeElement === 'title' && (
        <>
          {/* Title Font */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <select
                value={product.style_config?.titleFont || ''}
                onChange={(e) => onUpdate('titleFont', e.target.value || undefined)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-full h-6 pl-2 pr-6 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer text-gray-700 hover:bg-gray-100 w-20 truncate"
              >
                <option value="">Default</option>
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
              <ChevronDown className="w-2 h-2 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Título</span>
          </div>

          {/* Title Color */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 relative">
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
                  <Minus size={10} className="text-gray-600" />
                </button>
              )}
            </div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Color T.</span>
          </div>
        </>
      )}

      {/* Price Tools */}
      {activeElement === 'price' && (
        <>
          {/* Price Font */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <select
                value={product.style_config?.priceFont || ''}
                onChange={(e) => onUpdate('priceFont', e.target.value || undefined)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-full h-6 pl-2 pr-6 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer text-gray-700 hover:bg-gray-100 w-20 truncate"
              >
                <option value="">Default</option>
                {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
              <ChevronDown className="w-2 h-2 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Precio</span>
          </div>

          {/* Price Color */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 relative">
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
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Color P.</span>
          </div>
        </>
      )}

      {/* Cart Button Tools */}
      {activeElement === 'cartButton' && (
        <>
          {/* Button Background */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 relative">
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
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fondo Btn</span>
          </div>

          {/* Button Icon/Text Color */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 relative">
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
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Icono</span>
          </div>
        </>
      )}

      {/* Description Tools - Refactored with Floating Panel */}
      {activeElement === 'description' && (() => {
        const isTransparent = product.style_config?.descriptionBackground === 'transparent';
        const currentColor = isTransparent ? '#ffffff' : (product.style_config?.descriptionBackground || product.style_config?.footerBackground || '#ffffff');

        return (
          <div className="relative flex flex-col items-center gap-1">
             <span className="text-xs font-semibold text-gray-700">Fondo Descripción</span>

             {/* Floating Panel */}
             <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>

                {/* Option 1: Transparent */}
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Opción 1: Invisible</label>
                   <button
                     onClick={(e) => { e.stopPropagation(); onUpdate('descriptionBackground', 'transparent'); }}
                     className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border w-full transition-all ${isTransparent ? 'bg-neutral-50 border-black ring-1 ring-black/5' : 'hover:bg-gray-50 border-gray-200 bg-white'}`}
                   >
                     <div className="w-5 h-5 rounded border bg-[url('https://placehold.co/4x4/transparent')] opacity-50 shrink-0"></div>
                     <div className="flex flex-col items-start">
                        <span className={`text-xs font-medium ${isTransparent ? 'text-black' : 'text-gray-600'}`}>Transparente</span>
                        {isTransparent && <span className="text-[9px] text-green-600 font-bold">Activo</span>}
                     </div>
                   </button>
                </div>

                {/* Option 2: Solid Color */}
                {!isTransparent && (
                  <div className="animate-in fade-in zoom-in duration-200">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Opción 2: Color Sólido</label>
                     <div className="p-3 rounded-lg border bg-neutral-50 border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                           <ColorCircle
                             color={currentColor}
                             onChange={(val) => onUpdate('descriptionBackground', val)}
                             size="md"
                           />
                           <span className="text-xs text-gray-500">Seleccionar color...</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* Restore button if transparent */}
                {isTransparent && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onUpdate('descriptionBackground', '#ffffff'); }}
                        className="text-xs text-blue-600 underline hover:text-blue-800 text-center w-full"
                    >
                        Restaurar color de fondo
                    </button>
                )}
             </div>
          </div>
        );
      })()}

      <div className="w-px h-6 bg-gray-200" />

      {/* Apply to All */}
      <button
        onClick={onApplyAll}
        disabled={isSaving}
        className="flex flex-col items-center gap-1 group"
        title="Aplicar a todos"
      >
        <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all text-gray-600">
          <Copy className="w-4 h-4" />
        </div>
        <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Todos</span>
      </button>

      {/* Specific Save Button */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex flex-col items-center gap-1 group"
        title="Guardar cambios del producto"
      >
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all shadow-sm">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        </div>
        <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Guardar</span>
      </button>

      <div className="w-px h-6 bg-gray-200" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex flex-col items-center gap-1 group"
        title="Cerrar selección"
      >
         <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-gray-500">
           <X className="w-4 h-4" />
         </div>
         <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-red-500 transition-colors">Cerrar</span>
      </button>

    </div>
  );
}
