import React from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { FontPicker } from './font-picker';
import { ColorCircle } from './color-circle';

interface ProfileStylingToolbarProps {
  activeTool: 'header-title' | 'header-bio';
  config: DesignConfig;
  onUpdateConfig: (path: string[], value: any) => void;
}

export function ProfileStylingToolbar({
  activeTool,
  config,
  onUpdateConfig,
}: ProfileStylingToolbarProps) {

  if (activeTool === 'header-title') {
    return (
      <div className="flex items-center gap-4 h-full animate-in fade-in slide-in-from-top-2 duration-300">

        {/* Input de Texto */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Texto</label>
          <input
            type="text"
            value={config.profile.shopName || ''}
            onChange={(e) => onUpdateConfig(['profile', 'shopName'], e.target.value)}
            className="border-none bg-gray-100 rounded px-2 py-0.5 text-xs w-40 focus:ring-1 focus:ring-black focus:outline-none"
            placeholder="Nombre..."
          />
        </div>

        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        {/* Selector de Fuente */}
        <div className="flex flex-col">
           <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Fuente</label>
           <FontPicker
             value={config.profile.titleStyle?.fontFamily || config.fonts.heading}
             onChange={(v) => onUpdateConfig(['profile', 'titleStyle', 'fontFamily'], v)}
           />
        </div>

        {/* Selector de Color */}
        <div className="flex flex-col">
           <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Color</label>
           <ColorCircle
             color={config.profile.titleStyle?.color || config.colors.text}
             onChange={(v) => onUpdateConfig(['profile', 'titleStyle', 'color'], v)}
             size="sm"
           />
        </div>
      </div>
    );
  }

  if (activeTool === 'header-bio') {
    return (
      <div className="flex items-center gap-4 h-full animate-in fade-in slide-in-from-top-2 duration-300">

        {/* Input de Texto */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Biografía</label>
          <input
            type="text"
            value={config.profile.bio || ''}
            onChange={(e) => onUpdateConfig(['profile', 'bio'], e.target.value)}
            className="border-none bg-gray-100 rounded px-2 py-0.5 text-xs w-64 focus:ring-1 focus:ring-black truncate focus:outline-none"
            placeholder="Bienvenida..."
          />
        </div>

        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        {/* Selector de Fuente */}
        <div className="flex flex-col">
           <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Fuente</label>
           <FontPicker
             value={config.profile.bioStyle?.fontFamily || config.fonts.body}
             onChange={(v) => onUpdateConfig(['profile', 'bioStyle', 'fontFamily'], v)}
           />
        </div>

        {/* Selector de Color */}
        <div className="flex flex-col">
           <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Color</label>
           <ColorCircle
             color={config.profile.bioStyle?.color || config.colors.text}
             onChange={(v) => onUpdateConfig(['profile', 'bioStyle', 'color'], v)}
             size="sm"
           />
        </div>
      </div>
    );
  }

  return null;
}
