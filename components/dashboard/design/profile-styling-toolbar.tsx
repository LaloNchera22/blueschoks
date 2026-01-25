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
      <div className="p-4 w-72 bg-white rounded-xl shadow-xl border flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="border-b pb-2 font-bold text-xs uppercase text-gray-500">Editar Nombre</div>

        {/* Input de Texto Real */}
        <div>
          <label className="text-xs font-semibold mb-1 block">Texto</label>
          <input
            type="text"
            value={config.profile.shopName || ''}
            onChange={(e) => onUpdateConfig(['profile', 'shopName'], e.target.value)}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            placeholder="Escribe el nombre..."
          />
        </div>

        {/* Selector de Fuente */}
        <div>
           <label className="text-xs font-semibold mb-1 block">Fuente</label>
           <FontPicker
             value={config.profile.titleStyle?.fontFamily || config.fonts.heading}
             onChange={(v) => onUpdateConfig(['profile', 'titleStyle', 'fontFamily'], v)}
             className="w-full"
           />
        </div>

        {/* Selector de Color */}
        <div>
            <label className="text-xs font-semibold mb-1 block">Color</label>
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50/50">
               <ColorCircle
                 color={config.profile.titleStyle?.color || config.colors.text}
                 onChange={(v) => onUpdateConfig(['profile', 'titleStyle', 'color'], v)}
                 size="md"
               />
               <span className="text-xs text-gray-500">{config.profile.titleStyle?.color || config.colors.text}</span>
            </div>
        </div>
      </div>
    );
  }

  if (activeTool === 'header-bio') {
    return (
      <div className="p-4 w-72 bg-white rounded-xl shadow-xl border flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="border-b pb-2 font-bold text-xs uppercase text-gray-500">Editar Descripción</div>

        {/* Textarea para la Bio */}
        <div>
          <label className="text-xs font-semibold mb-1 block">Texto (Borrar para ocultar)</label>
          <textarea
            rows={3}
            value={config.profile.bio || ''}
            onChange={(e) => onUpdateConfig(['profile', 'bio'], e.target.value)}
            className="w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
            placeholder="Escribe una bienvenida..."
          />
        </div>

        {/* Selector de Fuente */}
        <div>
           <label className="text-xs font-semibold mb-1 block">Fuente</label>
           <FontPicker
             value={config.profile.bioStyle?.fontFamily || config.fonts.body}
             onChange={(v) => onUpdateConfig(['profile', 'bioStyle', 'fontFamily'], v)}
             className="w-full"
           />
        </div>

        {/* Selector de Color */}
         <div>
            <label className="text-xs font-semibold mb-1 block">Color</label>
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50/50">
               <ColorCircle
                 color={config.profile.bioStyle?.color || config.colors.text}
                 onChange={(v) => onUpdateConfig(['profile', 'bioStyle', 'color'], v)}
                 size="md"
               />
               <span className="text-xs text-gray-500">{config.profile.bioStyle?.color || config.colors.text}</span>
            </div>
        </div>
      </div>
    );
  }

  return null;
}
