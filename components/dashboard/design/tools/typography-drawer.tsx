'use client';
import React from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { FontPicker } from '../font-picker';

interface TypographyDrawerProps {
  config: DesignConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (path: string[], value: any) => void;
}

export function TypographyDrawer({ config, onUpdate }: TypographyDrawerProps) {
  return (
    <div className="space-y-6">
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fuente Global</label>
          <FontPicker
            value={config.fonts.body}
            onChange={(val) => {
               onUpdate(['fonts', 'body'], val);
               onUpdate(['fonts', 'heading'], val);
            }}
            className="w-full h-12 px-4 justify-between text-base"
          />
          <p className="text-xs text-gray-400">Esta fuente se aplicará a toda la tienda.</p>
       </div>
    </div>
  )
}
