import React from 'react';
import { Image as ImageIcon, Trash2, Loader2, Upload, Settings2 } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from './color-circle';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BackgroundStylingToolbarProps {
  config: DesignConfig;
  onUpdate: (path: string[], value: any) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  isUploading: boolean;
}

const PRESET_COLORS = [
  '#FFFFFF', '#F3F4F6', '#E5E7EB', '#000000', // Grayscale
  '#EF4444', '#F97316', '#F59E0B', // Warm
  '#84CC16', '#10B981', '#06B6D4', // Cool Green/Teal
  '#3B82F6', '#6366F1', '#8B5CF6', // Cool Blue/Purple
  '#D946EF', '#EC4899', '#F43F5E'  // Pink/Rose
];

export function BackgroundStylingToolbar({
  config,
  onUpdate,
  onUploadImage,
  onClose, // Unused in inline mode but kept for interface compatibility
  isUploading
}: BackgroundStylingToolbarProps) {

  const hasImage = !!config.backgroundImage;
  const opacity = config.backgroundOpacity ?? 0.5;

  return (
    <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-top-2 duration-300 flex-1 min-w-0">

       {/* 1. Colors Section (Scrollable) */}
       <div className="flex-1 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] px-1 mask-fade-disabled">
          {/* Custom Picker */}
          <div className="shrink-0">
             <ColorCircle
                color={config.colors.background}
                onChange={(c) => onUpdate(['colors', 'background'], c)}
                size="sm"
             />
          </div>

          <div className="w-px h-4 bg-gray-200 shrink-0 mx-1" />

          {/* Presets */}
          {PRESET_COLORS.map((color) => (
             <button
               key={color}
               className={cn(
                 "w-6 h-6 rounded-full border border-gray-200 shrink-0 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/5",
                 config.colors.background?.toLowerCase() === color.toLowerCase() && "ring-2 ring-black ring-offset-1"
               )}
               style={{ backgroundColor: color }}
               onClick={() => onUpdate(['colors', 'background'], color)}
               title={color}
             />
          ))}
       </div>

       {/* Divider */}
       <div className="w-px h-6 bg-gray-200 shrink-0" />

       {/* 2. Image Section */}
       <div className="shrink-0 flex items-center">
          {!hasImage ? (
             <label className={cn(
               "flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors group",
               isUploading && "opacity-50 cursor-not-allowed"
             )} title="Subir Imagen de Fondo">
                 {isUploading ? (
                     <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                 ) : (
                     <Upload className="w-4 h-4 text-gray-500 group-hover:text-black" />
                 )}
                 <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onUploadImage}
                    disabled={isUploading}
                 />
             </label>
          ) : (
             <Popover>
                <PopoverTrigger asChild>
                   <button
                     className="relative w-8 h-8 rounded-full border border-gray-200 overflow-hidden hover:ring-2 hover:ring-black/10 transition-all group"
                     title="Ajustar Imagen"
                   >
                       <img
                          src={config.backgroundImage}
                          alt="Background"
                          className="w-full h-full object-cover"
                       />
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Settings2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                       </div>
                   </button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="w-64 p-3">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span>Opacidad</span>
                                <span>{Math.round(opacity * 100)}%</span>
                            </div>
                            <Slider
                                value={opacity * 100}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(val) => onUpdate(['backgroundOpacity'], val / 100)}
                            />
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                             <label className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                Cambiar
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={onUploadImage}
                                />
                             </label>

                             <button
                                onClick={() => onUpdate(['backgroundImage'], undefined)}
                                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                             >
                                <Trash2 className="w-3 h-3" />
                                Quitar
                             </button>
                        </div>
                    </div>
                </PopoverContent>
             </Popover>
          )}
       </div>

    </div>
  );
}
