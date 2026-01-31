'use client';

import React from 'react';
import { Upload, Loader2, Circle, Square, Minus, UserCircle } from 'lucide-react';
import { DesignConfig } from '@/lib/types/design-system';
import { ColorCircle } from '../color-circle';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface ProfileDrawerProps {
  config: DesignConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (path: string[], value: any) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function ProfileDrawer({
  config,
  onUpdate,
  onUploadImage,
  isUploading
}: ProfileDrawerProps) {

  const hasAvatar = !!config.profile.avatarUrl;

  return (
    <div className="flex flex-col gap-3">

       {/* 1. Avatar Upload */}
       <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
           <div className="relative w-16 h-16 shrink-0">
               {hasAvatar ? (
                   <img
                     src={config.profile.avatarUrl}
                     alt="Avatar"
                     className={cn(
                        "w-full h-full object-cover shadow-sm bg-white",
                        config.profile.avatarShape === 'circle' ? "rounded-full" :
                        config.profile.avatarShape === 'square' ? "rounded-xl" : "rounded-none"
                     )}
                   />
               ) : (
                   <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                      <UserCircle className="w-10 h-10" />
                   </div>
               )}
               {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                     <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
               )}
           </div>

           <div className="flex-1 space-y-2">
               <h3 className="text-sm font-bold text-gray-900">Foto de Perfil</h3>
               <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? "Subiendo..." : "Cambiar Foto"}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onUploadImage}
                    disabled={isUploading}
                  />
               </label>
           </div>
       </div>

       {/* 2. Shape */}
       <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Forma</label>
          <div className="flex gap-2">
             <button
                onClick={() => onUpdate(['profile', 'avatarShape'], 'circle')}
                className={cn(
                  "flex-1 h-10 rounded-xl flex items-center justify-center gap-2 transition-all border",
                  config.profile.avatarShape === 'circle'
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
             >
                <Circle className="w-5 h-5 fill-current opacity-20" />
                <span className="text-sm font-medium">Círculo</span>
             </button>

             <button
                onClick={() => onUpdate(['profile', 'avatarShape'], 'square')}
                className={cn(
                  "flex-1 h-10 rounded-xl flex items-center justify-center gap-2 transition-all border",
                  (config.profile.avatarShape === 'square' || config.profile.avatarShape === 'rounded')
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
             >
                <div className="w-4 h-4 rounded-sm border-2 border-current" />
                <span className="text-sm font-medium">Cuadrado</span>
             </button>
          </div>
       </div>

       {/* 3. Border */}
       <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Borde</label>
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
             <div className="flex-1 flex gap-3 items-center">
                <ColorCircle
                  color={config.profile.avatarBorderColor || 'transparent'}
                  onChange={(c) => onUpdate(['profile', 'avatarBorderColor'], c)}
                  size="md"
                />
                <span className="text-sm text-gray-600">Color del borde</span>
             </div>

             {config.profile.avatarBorderColor && (
                 <button
                   onClick={() => onUpdate(['profile', 'avatarBorderColor'], undefined)}
                   className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 transition-colors"
                 >
                    <Minus className="w-4 h-4" />
                 </button>
             )}
          </div>
       </div>

    </div>
  );
}
