'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Type,
  Palette,
  Bold,
  Save,
  Loader2,
  ChevronDown,
  Smartphone,
  Check
} from 'lucide-react';

import { DesignConfig } from '@/lib/types/design-system';
import { saveDesignConfig } from '@/app/dashboard/actions/design-actions';
import { Database } from '@/utils/supabase/types';
import { cn } from '@/lib/utils';

// --- TYPES ---
type Product = Database['public']['Tables']['products']['Row'];

interface DesignEditorProps {
  initialConfig: DesignConfig;
  initialProducts: Product[];
  userId: string;
  slug: string;
}

type ToolType = 'global' | 'header' | 'cards';

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Camiseta Básica', price: 25.00, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60' },
  { id: '2', name: 'Gorra Urbana', price: 15.00, image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Sneakers Pro', price: 120.00, image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Mochila Viaje', price: 45.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Playfair', value: 'Playfair Display' },
];

// --- COMPONENTS ---

const ColorCircle = ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
  <div className="relative group w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform">
    <input
      type="color"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
    />
  </div>
);

export default function DesignEditor({ initialConfig, initialProducts, userId, slug }: DesignEditorProps) {
  const [config, setConfig] = useState<DesignConfig>(initialConfig);
  const [activeTool, setActiveTool] = useState<ToolType>('global');
  const [isSaving, setIsSaving] = useState(false);
  const [isBold, setIsBold] = useState(false); // Visual-only toggle state for Header name

  // Helper to update deep nested config
  const updateConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newConfig;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!current[key]) current[key] = {};
        current[key] = { ...current[key] };
        current = current[key];
      }

      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveDesignConfig(config);
      if (result.success) {
        toast.success("Diseño guardado correctamente");
      } else {
        toast.error("Error al guardar cambios");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  const displayProducts = initialProducts.length > 0 ? initialProducts : DUMMY_PRODUCTS;

  return (
    <div className="w-full h-[calc(100vh-64px)] relative bg-gray-50 overflow-hidden flex flex-col items-center justify-center font-sans">

      {/* BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* --- PREVIEW CANVAS --- */}
      <div className="relative z-10 w-[360px] h-[720px] shadow-2xl rounded-[3rem] border-[8px] border-gray-900 bg-gray-900 overflow-hidden ring-4 ring-black/5">

        {/* Phone Notch/Status Bar Area */}
        <div className="absolute top-0 w-full h-8 z-20 bg-black/20 flex justify-between px-6 items-center backdrop-blur-sm pointer-events-none">
           <div className="w-16 h-4 bg-black/40 rounded-full mx-auto" />
        </div>

        {/* --- INTERACTIVE STORE PREVIEW --- */}
        <div
          className={cn(
            "w-full h-full overflow-y-auto scrollbar-hide bg-white transition-colors duration-300 relative",
            activeTool === 'global' && "ring-inset ring-4 ring-indigo-500/20"
          )}
          style={{
            backgroundColor: config.colors.background,
            color: config.colors.text,
            fontFamily: config.fonts.body
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTool('global');
          }}
        >
          {/* Header Section */}
          <div
            className={cn(
              "pt-16 pb-8 px-6 flex flex-col items-center text-center cursor-pointer transition-all hover:opacity-90",
              activeTool === 'header' && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent bg-black/5 rounded-xl mx-2 mt-12"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool('header');
            }}
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-4 border-2 border-white shadow-md relative">
              {config.profile.avatarUrl ? (
                <Image src={config.profile.avatarUrl} alt="Shop Avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Smartphone className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Shop Info */}
            <h1
              className="text-xl font-bold leading-tight mb-1"
              style={{ fontFamily: config.fonts.heading }}
            >
              {config.profile.shopName || 'Mi Tienda'}
            </h1>
            <p className="text-sm opacity-80 max-w-[200px] line-clamp-2">
              {config.profile.bio || 'Bienvenido a mi tienda online'}
            </p>
          </div>

          {/* Products Grid Section */}
          <div
            className={cn(
              "px-4 pb-24 transition-all cursor-pointer",
              activeTool === 'cards' && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent bg-black/5 rounded-xl mx-2 py-4"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool('cards');
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              {displayProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl overflow-hidden shadow-sm flex flex-col pb-3"
                  style={{ backgroundColor: config.colors.cardBackground }}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                  </div>
                  <div className="px-3 pt-2">
                     <p className="text-xs font-medium opacity-90 line-clamp-1">{p.name}</p>
                     <p className="text-sm font-bold mt-0.5">${Number(p.price).toFixed(2)}</p>

                     {/* Fake Add Button */}
                     <div
                        className="mt-2 w-full h-7 rounded-lg flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: config.colors.primary }}
                     >
                       Agregar
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Cart Button Preview (Static) */}
          <div className="absolute bottom-6 left-0 right-0 px-6 pointer-events-none">
             <div
                className="w-full h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                style={{ backgroundColor: config.colors.primary }}
             >
                {config.checkout?.cartButtonText || 'Ver Carrito'}
             </div>
          </div>

        </div>
      </div>

      {/* --- FLOATING TOOLBAR --- */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="h-16 px-6 rounded-full bg-white shadow-2xl shadow-black/10 border border-gray-100 flex items-center gap-6">

          {/* GLOBAL TOOLS */}
          {activeTool === 'global' && (
            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.colors.background} onChange={(c) => updateConfig(['colors', 'background'], c)} />
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Fondo</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                 <div className="relative">
                    <select
                      value={config.fonts.body}
                      onChange={(e) => {
                        updateConfig(['fonts', 'body'], e.target.value);
                        updateConfig(['fonts', 'heading'], e.target.value); // Simple sync for now
                      }}
                      className="appearance-none bg-gray-50 border border-gray-200 rounded-full h-8 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
                    >
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                 </div>
                 <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Tipografía</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.colors.text} onChange={(c) => updateConfig(['colors', 'text'], c)} />
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Texto</span>
              </div>
            </div>
          )}

          {/* HEADER TOOLS */}
          {activeTool === 'header' && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <input
                type="text"
                value={config.profile.shopName || ''}
                onChange={(e) => updateConfig(['profile', 'shopName'], e.target.value)}
                placeholder="Nombre Tienda"
                className="h-8 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs w-32 focus:outline-none focus:ring-2 focus:ring-black/5"
              />

              <button
                onClick={() => setIsBold(!isBold)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full border transition-colors",
                  isBold ? "bg-black text-white border-black" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                )}
              >
                <Bold className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <div className="w-px h-6 bg-gray-200 mx-1" />

              <div className="flex flex-col items-center gap-1">
                 {/* Assuming primary color affects titles or we reuse text color.
                     The prompt asks for [Color Picker] Title.
                     Since 'colors.text' is global, we might not have a specific 'title color' in DesignConfig.
                     I will map it to 'primary' as an accent for now, or just reuse 'text'.
                     Let's use 'text' again for consistency with the model unless we want to use 'primary' for brand color.
                 */}
                <ColorCircle color={config.colors.text} onChange={(c) => updateConfig(['colors', 'text'], c)} />
                 <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Color</span>
              </div>
            </div>
          )}

          {/* CARDS TOOLS */}
          {activeTool === 'cards' && (
             <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col items-center gap-1">
                  <ColorCircle color={config.colors.cardBackground} onChange={(c) => updateConfig(['colors', 'cardBackground'], c)} />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Fondo</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <ColorCircle color={config.colors.primary} onChange={(c) => updateConfig(['colors', 'primary'], c)} />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Acción</span>
                </div>

                {/* Border Style Selector - Visual Placeholder as per prompt request "si existe" */}
                {/* Since it doesn't exist in config, we skip logic but could show UI if needed.
                    Prompt said "Select Estilo Borde (si existe)". It doesn't. Skipping to keep UI clean.
                */}
             </div>
          )}

          {/* DIVIDER & SAVE BUTTON */}
          <div className="w-px h-8 bg-gray-200 mx-2" />

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gray-900 hover:bg-black text-white rounded-full px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Guardar</span>
                {/* <Check className="w-3 h-3" strokeWidth={3} /> */}
              </>
            )}
          </button>

        </div>
      </div>

    </div>
  );
}
