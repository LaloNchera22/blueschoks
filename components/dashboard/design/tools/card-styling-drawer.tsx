'use client';

import React, { useState } from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from '../color-circle';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CardStylingDrawerProps {
  config: DesignConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (path: string[], value: any) => void;
}

export function CardStylingDrawer({ config, onUpdate }: CardStylingDrawerProps) {
  const [showColors, setShowColors] = useState(false);

  return (
    <div className="flex flex-col gap-6">

       {/* 1. Main Visual Controls (Always Visible) */}

       {/* Radius */}
       <div className="space-y-3">
          <div className="flex justify-between items-center">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Redondez</label>
             <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{config.cardStyle.borderRadius}px</span>
          </div>
          <Slider
            value={config.cardStyle.borderRadius || 8}
            max={32}
            min={0}
            step={2}
            onValueChange={(val) => onUpdate(['cardStyle', 'borderRadius'], val)}
          />
       </div>

       {/* Shadow */}
       <div className="flex items-center justify-between py-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sombra</label>
          <Switch
            checked={config.cardStyle.shadow ?? true}
            onCheckedChange={(checked) => onUpdate(['cardStyle', 'shadow'], checked)}
          />
       </div>

       {/* Opacity */}
       <div className="space-y-3">
          <div className="flex justify-between items-center">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Opacidad</label>
             <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
               {Math.round((config.cardStyle.opacity ?? 1) * 100)}%
             </span>
          </div>
          <Slider
            value={(config.cardStyle.opacity ?? 1) * 100}
            max={100}
            min={0}
            step={5}
            onValueChange={(val) => onUpdate(['cardStyle', 'opacity'], val / 100)}
          />
       </div>


       {/* 2. Colors (Collapsible) */}
       <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
          <button
            onClick={() => setShowColors(!showColors)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
             <div className="flex items-center gap-3">
               <span className="font-semibold text-sm text-gray-900">Colores</span>
             </div>
             {showColors ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          </button>

          {showColors && (
             <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-6 animate-in slide-in-from-top-2 duration-200">
                 {/* Card Colors */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tarjeta</label>
                    <div className="grid grid-cols-2 gap-3">
                       {/* Card Background (Global) */}
                       <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                           <ColorCircle
                             color={config.colors.cardBackground || '#ffffff'}
                             onChange={(c) => onUpdate(['colors', 'cardBackground'], c)}
                           />
                           <span className="text-xs font-medium text-gray-700">Fondo</span>
                       </div>

                       {/* Title Color */}
                       <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                           <ColorCircle
                             color={config.cardStyle.titleColor || config.colors.text}
                             onChange={(c) => onUpdate(['cardStyle', 'titleColor'], c)}
                           />
                           <span className="text-xs font-medium text-gray-700">Título</span>
                       </div>

                       {/* Price Color */}
                       <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                           <ColorCircle
                             color={config.cardStyle.priceColor || config.colors.primary}
                             onChange={(c) => onUpdate(['cardStyle', 'priceColor'], c)}
                           />
                           <span className="text-xs font-medium text-gray-700">Precio</span>
                       </div>
                    </div>
                 </div>

                 {/* Button Colors */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Botón de Compra</label>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <ColorCircle
                                color={config.cardStyle.buttonColor || '#000000'}
                                onChange={(c) => onUpdate(['cardStyle', 'buttonColor'], c)}
                              />
                              <span className="text-xs font-medium text-gray-700">Fondo</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <ColorCircle
                                color={config.cardStyle.buttonTextColor || '#ffffff'}
                                onChange={(c) => onUpdate(['cardStyle', 'buttonTextColor'], c)}
                              />
                              <span className="text-xs font-medium text-gray-700">Texto</span>
                           </div>
                        </div>
                    </div>
                 </div>
             </div>
          )}
       </div>

    </div>
  );
}
