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
      <div className="flex items-center gap-2 h-full animate-in fade-in slide-in-from-top-2 duration-300 w-full justify-around">
        {/* Selector de Fuente */}
        <div className="flex flex-col gap-0.5">
           <label className="text-[9px] font-bold text-gray-400 uppercase">Fuente</label>
           <FontPicker
             value={config.profile.titleStyle?.fontFamily || config.fonts.heading}
             onChange={(v) => onUpdateConfig(['profile', 'titleStyle', 'fontFamily'], v)}
             className="h-6 w-24"
           />
        </div>

        {/* Selector de Color */}
        <div className="flex flex-col gap-0.5 items-center">
           <label className="text-[9px] font-bold text-gray-400 uppercase">Color</label>
           <div className="scale-90">
             <ColorCircle
               color={config.profile.titleStyle?.color || config.colors.text}
               onChange={(v) => onUpdateConfig(['profile', 'titleStyle', 'color'], v)}
               size="sm"
             />
           </div>
        </div>
      </div>
    );
  }

  if (activeTool === 'header-bio') {
    return (
      <div className="flex items-center gap-2 h-full animate-in fade-in slide-in-from-top-2 duration-300 w-full justify-around">
        {/* Selector de Fuente */}
        <div className="flex flex-col gap-0.5">
           <label className="text-[9px] font-bold text-gray-400 uppercase">Fuente</label>
           <FontPicker
             value={config.profile.bioStyle?.fontFamily || config.fonts.body}
             onChange={(v) => onUpdateConfig(['profile', 'bioStyle', 'fontFamily'], v)}
             className="h-6 w-24"
           />
        </div>

        {/* Selector de Color */}
        <div className="flex flex-col gap-0.5 items-center">
           <label className="text-[9px] font-bold text-gray-400 uppercase">Color</label>
           <div className="scale-90">
             <ColorCircle
               color={config.profile.bioStyle?.color || config.colors.text}
               onChange={(v) => onUpdateConfig(['profile', 'bioStyle', 'color'], v)}
               size="sm"
             />
           </div>
        </div>
      </div>
    );
  }

  return null;
}
