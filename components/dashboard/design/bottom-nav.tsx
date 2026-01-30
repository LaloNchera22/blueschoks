'use client';

import React from 'react';
import { Mountain, Type, Square, Share2, User, Palette, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type needs to match the ToolType in parent, but I can make it string for flexibility
export type BottomNavTool = 'background' | 'typography' | 'card-styling' | 'social-global' | 'profile-global';

interface BottomNavProps {
  activeTool: string;
  onSelectTool: (tool: string) => void;
}

export function BottomNav({ activeTool, onSelectTool }: BottomNavProps) {

  const navItems = [
    { id: 'background', label: 'Fondo', icon: Mountain },
    { id: 'typography', label: 'Fuentes', icon: Type },
    { id: 'card-styling', label: 'Tarjetas', icon: Square },
    { id: 'social-global', label: 'Redes', icon: LinkIcon },
    { id: 'profile-global', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
       <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTool(item.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all min-w-[64px]",
                activeTool === item.id
                  ? "text-black bg-gray-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
              )}
            >
               <item.icon
                 className={cn("w-6 h-6", activeTool === item.id && "fill-current opacity-10")}
                 strokeWidth={activeTool === item.id ? 2 : 1.5}
               />
               <span className={cn(
                 "text-[10px] font-medium tracking-wide",
                 activeTool === item.id ? "text-black" : "text-gray-500"
               )}>
                 {item.label}
               </span>
            </button>
          ))}
       </div>
    </div>
  );
}
