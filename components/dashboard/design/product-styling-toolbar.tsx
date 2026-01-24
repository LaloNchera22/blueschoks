import React from 'react';
import { Loader2, Save, Minus, Copy, ChevronDown, X, Ban } from 'lucide-react';
import { ProductStyle } from '@/lib/types/design-system';
import { Database } from '@/utils/supabase/types';
import { ColorCircle } from './color-circle';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductStylingToolbarProps {
  product: Product;
  activeElement: 'container' | 'title' | 'price' | 'cartButton';
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

      {/* Footer Background - Only for container */}
      {activeElement === 'container' && (
        <>
          {/* Card Background */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 relative">
              <ColorCircle
                color={product.style_config?.cardBackground === 'transparent' ? '#ffffff' : (product.style_config?.cardBackground || '#ffffff')}
                onChange={(c) => onUpdate('cardBackground', c)}
                size="sm"
              />
              <button
                onClick={(e) => { e.stopPropagation(); onUpdate('cardBackground', 'transparent'); }}
                className="absolute -bottom-1 -right-2 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-gray-100 transition-colors shadow-sm z-10"
                title="Transparente"
              >
                <Ban size={10} className="text-gray-400" />
              </button>
              {product.style_config?.cardBackground && product.style_config.cardBackground !== 'transparent' && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdate('cardBackground', undefined); }}
                  className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                  title="Restaurar"
                >
                  <Minus size={10} className="text-gray-600" />
                </button>
              )}
            </div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Tarjeta</span>
          </div>

          {/* Footer Background */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 relative">
              <ColorCircle
                color={product.style_config?.footerBackground || 'transparent'}
                onChange={(c) => onUpdate('footerBackground', c)}
                size="sm"
              />
              {product.style_config?.footerBackground && (
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdate('footerBackground', undefined); }}
                  className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                  title="Quitar fondo"
                >
                  <Minus size={10} className="text-gray-600" />
                </button>
              )}
            </div>
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Info</span>
          </div>
        </>
      )}

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
