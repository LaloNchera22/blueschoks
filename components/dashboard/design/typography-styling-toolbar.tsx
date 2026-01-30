import React from 'react';
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
    <div className="flex items-center justify-center w-full h-full animate-in fade-in slide-in-from-top-2 duration-300">
       <FontPicker
          value={config.fonts.body}
          onChange={(val) => {
            onUpdate(['fonts', 'body'], val);
            onUpdate(['fonts', 'heading'], val);
          }}
          className="w-48"
       />
    </div>
  );
}
