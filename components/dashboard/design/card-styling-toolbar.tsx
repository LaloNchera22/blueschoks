import React from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from './color-circle';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardStylingToolbarProps {
  config: DesignConfig;
  onUpdate: (path: string[], value: any) => void;
  onClose?: () => void;
}

export const CardStylingToolbar = ({ config, onUpdate, onClose }: CardStylingToolbarProps) => {
  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
        {/* Background Color */}
        <ColorCircle
             color={config.colors.cardBackground || '#ffffff'}
             onChange={(c) => onUpdate(['colors', 'cardBackground'], c)}
             size="sm"
        />

        <div className="w-px h-6 bg-gray-200" />

        {/* Opacity */}
        <div className="flex items-center gap-1 w-20">
           <Slider
             value={config.cardStyle.opacity ?? 1}
             max={1}
             step={0.1}
             onValueChange={(val) => onUpdate(['cardStyle', 'opacity'], val)}
             className="w-full"
             title={`Opacidad ${Math.round((config.cardStyle.opacity ?? 1) * 100)}%`}
           />
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Radius Selector */}
         <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
            <button
              onClick={() => onUpdate(['cardStyle', 'borderRadius'], 0)}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                config.cardStyle.borderRadius === 0 ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
              )}
              title="Cuadrado"
            >
               <Square size={14} />
            </button>
            <button
              onClick={() => onUpdate(['cardStyle', 'borderRadius'], 16)}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                (config.cardStyle.borderRadius > 0 && config.cardStyle.borderRadius < 24) ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
              )}
              title="Redondeado"
            >
               <div className="w-3.5 h-3.5 border-2 border-current rounded-md" />
            </button>
            <button
              onClick={() => onUpdate(['cardStyle', 'borderRadius'], 32)}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                config.cardStyle.borderRadius >= 24 ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
              )}
              title="Pill"
            >
               <div className="w-3.5 h-3.5 border-2 border-current rounded-full" />
            </button>
         </div>

         <div className="w-px h-6 bg-gray-200" />

         {/* Shadow Toggle */}
         <div className="flex items-center" title="Sombra">
            <Switch
              checked={config.cardStyle.shadow ?? true}
              onCheckedChange={(c) => onUpdate(['cardStyle', 'shadow'], c)}
              className="scale-75"
            />
         </div>
    </div>
  );
};
