import React from 'react';
import { X, Mountain, Trash2, Loader2, Upload } from 'lucide-react';
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
    <div className="flex items-center justify-center w-full h-full animate-in fade-in slide-in-from-top-2 duration-300">

      <Popover open={true} onOpenChange={(open) => !open && onClose()}>
        <PopoverTrigger asChild>
           <button className="flex flex-col items-center gap-0.5 outline-none">
             <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                 <Mountain className="w-3.5 h-3.5" strokeWidth={1.5} />
             </div>
           </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[280px] max-w-[90vw] p-4 flex flex-col gap-4 bg-white"
          side="bottom"
          sideOffset={16}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex justify-end items-center border-b border-gray-100 pb-2">
              <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
          </div>

          {/* 1. Solid Color */}
          <div>
             <div className="flex items-center gap-2 px-2 py-2 rounded-md border border-gray-200 bg-gray-50/50">
                <ColorCircle
                   color={config.colors.background}
                   onChange={(c) => {
                      onUpdate(['colors', 'background'], c);
                   }}
                   size="md"
                 />
             </div>
          </div>

          {/* 2. Image Upload */}
          <div>

             {!hasImage ? (
                 <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all group">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                         {isUploading ? (
                             <Loader2 className="w-6 h-6 text-gray-400 animate-spin mb-2" />
                         ) : (
                             <Upload className="w-6 h-6 text-gray-400 group-hover:text-black mb-2 transition-colors" strokeWidth={1.5} />
                         )}
                         <p className="text-xs text-gray-500 group-hover:text-black font-medium text-center px-2">
                             {isUploading ? "Subiendo..." : "Subir imagen"}
                         </p>
                     </div>
                     <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={onUploadImage}
                        disabled={isUploading}
                     />
                 </label>
             ) : (
                 <div className="space-y-3">
                     {/* Preview & Remove */}
                     <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 group">
                         {/* Simulate the layering: Color + Image */}
                         <div className="absolute inset-0" style={{ backgroundColor: config.colors.background }} />
                         <img
                            src={config.backgroundImage}
                            alt="Background Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: opacity }}
                         />

                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <button
                                onClick={() => onUpdate(['backgroundImage'], undefined)}
                                className="bg-white text-red-500 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-red-50 shadow-sm"
                             >
                                 <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                                 Quitar
                             </button>
                         </div>
                     </div>

                     {/* Opacity Slider */}
                     <div className="space-y-1">
                         <div className="flex justify-between text-xs text-gray-500">
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
                 </div>
             )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
