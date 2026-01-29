import React from 'react';
import { Type, X } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { FontPicker } from './font-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    <div className="flex items-center justify-center w-full h-full animate-in fade-in slide-in-from-top-2 duration-300">
      <Popover open={true} onOpenChange={(open) => !open && onClose()}>
        <PopoverTrigger asChild>
           <button className="flex flex-col items-center gap-0.5 outline-none">
             <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                 <Type className="w-3.5 h-3.5" />
             </div>
             <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fuente</span>
           </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[280px] max-w-[90vw] p-4 flex flex-col gap-4 bg-white"
          side="bottom"
          sideOffset={16}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
