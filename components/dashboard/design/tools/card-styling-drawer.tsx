'use client';

import React from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from '../color-circle';
import { Slider } from '@/components/ui/slider';

interface CardStylingDrawerProps {
  config: DesignConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (path: string[], value: any) => void;
}

export function CardStylingDrawer({ config, onUpdate }: CardStylingDrawerProps) {
  return (
    <div className="flex flex-col gap-6">

       {/* 1. Colors */}
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Colores de Tarjeta</label>
          <div className="grid grid-cols-2 gap-3">
             {/* Card Background (Global) */}
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                 <ColorCircle
                   color={config.colors.cardBackground || '#ffffff'}
                   onChange={(c) => onUpdate(['colors', 'cardBackground'], c)}
                 />
                 <span className="text-xs font-medium text-gray-700">Fondo</span>
             </div>

             {/* Title Color */}
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                 <ColorCircle
                   color={config.cardStyle.titleColor || config.colors.text}
                   onChange={(c) => onUpdate(['cardStyle', 'titleColor'], c)}
                 />
                 <span className="text-xs font-medium text-gray-700">Título</span>
             </div>

             {/* Price Color */}
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                 <ColorCircle
                   color={config.cardStyle.priceColor || config.colors.primary}
                   onChange={(c) => onUpdate(['cardStyle', 'priceColor'], c)}
                 />
                 <span className="text-xs font-medium text-gray-700">Precio</span>
             </div>
          </div>
       </div>

       {/* 2. Button Style */}
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Botón de Compra</label>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
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

       {/* 3. Shape / Radius */}
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

    </div>
  );
}
