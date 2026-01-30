'use client';

import React from 'react';
import { Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from '../color-circle';
import { Slider } from '@/components/ui/slider';

interface BackgroundDrawerProps {
  config: DesignConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (path: string[], value: any) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function BackgroundDrawer({
  config,
  onUpdate,
  onUploadImage,
  isUploading
}: BackgroundDrawerProps) {

  const hasImage = !!config.backgroundImage;
  const opacity = config.backgroundOpacity ?? 0.5;

  return (
    <div className="flex flex-col gap-6">

       {/* 1. Solid Color */}
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color Sólido</label>
          <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
             <ColorCircle
               color={config.colors.background}
               onChange={(c) => onUpdate(['colors', 'background'], c)}
               size="lg"
             />
             <span className="text-sm text-gray-600 font-medium">
               Selecciona un color base
             </span>
          </div>
       </div>

       {/* 2. Background Image */}
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen de Fondo</label>

          {!hasImage ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all group bg-white">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
                    ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors">
                           <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                    )}
                    <p className="text-sm text-gray-600 font-medium">
                        {isUploading ? "Subiendo..." : "Subir imagen de galería"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Recomendado: 1080x1920px</p>
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
            <div className="space-y-4">
                {/* Preview Card */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                    <div className="absolute inset-0" style={{ backgroundColor: config.colors.background }} />
                    <img
                       src={config.backgroundImage}
                       alt="Background Preview"
                       className="absolute inset-0 w-full h-full object-cover"
                       style={{ opacity: opacity }}
                    />

                    {/* Controls Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex justify-end">
                        <button
                           onClick={() => onUpdate(['backgroundImage'], undefined)}
                           className="bg-white/90 backdrop-blur text-red-500 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-white shadow-lg transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                        </button>
                    </div>
                </div>

                {/* Opacity Control */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        <span>Opacidad de imagen</span>
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

    </div>
  );
}
