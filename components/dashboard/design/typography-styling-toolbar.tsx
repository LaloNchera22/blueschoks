import React from 'react';
import { Type, X } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { FontPicker } from './font-picker';

interface TypographyStylingToolbarProps {
  config: DesignConfig;
  onUpdate: (path: string[], value: any) => void;
  onClose: () => void;
}

export function TypographyStylingToolbar({
  config,
  onUpdate,
  onClose
}: TypographyStylingToolbarProps) {
  return (
    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 relative">
      {/* Label/Title */}
      <div className="flex flex-col items-center gap-1">
         <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
             <Type className="w-4 h-4" />
         </div>
         <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fuente</span>
      </div>

      {/* Floating Panel */}
      <div
        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-[280px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Personalizar Tipografía</span>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>

        {/* Font Selector */}
        <div>
           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Fuente Global</label>
           <FontPicker
              value={config.fonts.body}
              onChange={(val) => {
                onUpdate(['fonts', 'body'], val);
                onUpdate(['fonts', 'heading'], val);
              }}
              className="w-full"
           />
           <p className="text-[10px] text-gray-400 mt-2">
             Se aplicará a todos los textos de la tienda.
           </p>
        </div>
      </div>
    </div>
  );
}
