import React from 'react';
import { Trash2, Loader2, Upload } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from './color-circle';
import { Slider } from '@/components/ui/slider';

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
  isUploading
}: BackgroundStylingToolbarProps) {

  const hasImage = !!config.backgroundImage;
  const opacity = config.backgroundOpacity ?? 0.5;

  return (
    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 w-full justify-between px-2">

      {/* Left: Color Picker */}
      <div className="flex items-center gap-2">
         <div className="flex flex-col items-center gap-1">
            <ColorCircle
               color={config.colors.background}
               onChange={(c) => {
                  onUpdate(['colors', 'background'], c);
               }}
               size="sm"
             />
         </div>
      </div>

      <div className="w-px h-6 bg-gray-200 shrink-0" />

      {/* Right: Image Controls */}
      <div className="flex items-center gap-3">
         {!hasImage ? (
             <label className="cursor-pointer group flex items-center gap-2" title="Subir imagen de fondo">
                 <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onUploadImage}
                    disabled={isUploading}
                 />
                 <div className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-black">
                     {isUploading ? (
                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     ) : (
                         <Upload className="w-3.5 h-3.5" />
                     )}
                 </div>
                 <span className="text-[10px] text-gray-500 font-medium uppercase hidden sm:inline-block">Subir Foto</span>
             </label>
         ) : (
             <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-200">
                 {/* Preview */}
                 <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200 shrink-0 group">
                     {/* Background color behind image to show opacity effect correctly */}
                     <div className="absolute inset-0" style={{ backgroundColor: config.colors.background }} />
                     <img
                        src={config.backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover relative z-10"
                        style={{ opacity: opacity }}
                     />
                 </div>

                 {/* Opacity Slider */}
                 <div className="w-20 flex flex-col justify-center gap-0.5">
                     <Slider
                         value={[opacity * 100]}
                         max={100}
                         min={0}
                         step={1}
                         onValueChange={(val) => onUpdate(['backgroundOpacity'], val[0] / 100)}
                         className="cursor-pointer"
                     />
                 </div>

                 {/* Remove Button */}
                 <button
                    onClick={() => onUpdate(['backgroundImage'], undefined)}
                    className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                    title="Quitar fondo"
                 >
                     <Trash2 className="w-3.5 h-3.5" />
                 </button>
             </div>
         )}
      </div>
    </div>
  );
}
