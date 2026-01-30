import React from 'react';
import { X, Image as ImageIcon, Trash2, Loader2, Upload } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from './color-circle';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface BackgroundStylingToolbarProps {
  config: DesignConfig;
  onUpdate: (path: string[], value: any) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  isUploading: boolean;
}

const PRESET_COLORS = [
  '#ffffff', // White
  '#f3f4f6', // Gray-100
  '#e5e7eb', // Gray-200
  '#d1d5db', // Gray-300
  '#9ca3af', // Gray-400
  '#6b7280', // Gray-500
  '#374151', // Gray-700
  '#1f2937', // Gray-800
  '#111827', // Gray-900
  '#000000', // Black
  '#fee2e2', // Red-100
  '#fecaca', // Red-200
  '#ffedd5', // Orange-100
  '#fef3c7', // Amber-100
  '#fef9c3', // Yellow-100
  '#ecfccb', // Lime-100
  '#dcfce7', // Green-100
  '#d1fae5', // Emerald-100
  '#ccfbf1', // Teal-100
  '#e0f2fe', // Sky-100
  '#dbeafe', // Blue-100
  '#e0e7ff', // Indigo-100
  '#ede9fe', // Violet-100
  '#f3e8ff', // Purple-100
  '#fae8ff', // Fuchsia-100
  '#fce7f3', // Pink-100
  '#ffe4e6', // Rose-100
];

export function BackgroundStylingToolbar({
  config,
  onUpdate,
  onUploadImage,
  onClose,
  isUploading
}: BackgroundStylingToolbarProps) {

  const hasImage = !!config.backgroundImage;
  const opacity = config.backgroundOpacity ?? 0.5;

  return (
    <div className="flex items-center gap-2 w-full h-full animate-in fade-in slide-in-from-top-2 duration-300">

        {/* 1. Colors List (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 px-1 py-1">
             {/* Custom Picker */}
             <div className="shrink-0" title="Color personalizado">
                <ColorCircle
                   color={config.colors.background}
                   onChange={(c) => onUpdate(['colors', 'background'], c)}
                   size="sm"
                 />
             </div>

             {/* Presets */}
             {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate(['colors', 'background'], color)}
                  className={cn(
                    "w-6 h-6 rounded-full border border-gray-200 shrink-0 transition-transform hover:scale-110",
                    config.colors.background === color && "ring-2 ring-black ring-offset-1 scale-110"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
             ))}
        </div>

        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* 2. Image Controls */}
        <div className="flex items-center gap-2 shrink-0">
             {!hasImage ? (
                 <label className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors group" title="Subir Imagen">
                     {isUploading ? (
                         <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                     ) : (
                         <ImageIcon className="w-4 h-4 text-gray-600 group-hover:text-black transition-colors" />
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
                 <div className="flex items-center gap-2">
                     {/* Opacity Slider (Mini) */}
                     <div className="w-20 px-2" title="Opacidad">
                         <Slider
                             value={opacity * 100}
                             max={100}
                             min={0}
                             step={5}
                             onValueChange={(val) => onUpdate(['backgroundOpacity'], val / 100)}
                             className="h-4"
                         />
                     </div>

                     {/* Remove Button */}
                     <button
                        onClick={() => onUpdate(['backgroundImage'], undefined)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Quitar Imagen"
                     >
                         <Trash2 className="w-3.5 h-3.5" />
                     </button>
                 </div>
             )}
        </div>

        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* Close Button */}
        <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
            title="Cerrar"
        >
            <X className="w-4 h-4" />
        </button>
    </div>
  );
}
