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
  onClose,
  isUploading
}: BackgroundStylingToolbarProps) {

  const hasImage = !!config.backgroundImage;
  const opacity = config.backgroundOpacity ?? 0.5;

  return (
    <div className="flex items-center w-full h-full gap-3 animate-in fade-in slide-in-from-top-2 duration-300">

      {/* 1. Solid Color */}
      <ColorCircle
          color={config.colors.background}
          onChange={(c) => {
            onUpdate(['colors', 'background'], c);
          }}
          size="sm"
      />

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* 2. Image Controls */}
      {!hasImage ? (
          <label
            className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            title="Subir imagen de fondo"
          >
              {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />
              ) : (
                  <Upload className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
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
          <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => onUpdate(['backgroundImage'], undefined)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                title="Quitar imagen"
              >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>

              <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                  <Slider
                      value={opacity * 100}
                      max={100}
                      min={0}
                      step={1}
                      onValueChange={(val) => onUpdate(['backgroundOpacity'], val / 100)}
                      className="w-full"
                      title={`Opacidad ${Math.round(opacity * 100)}%`}
                  />
              </div>
          </div>
      )}
    </div>
  );
}
