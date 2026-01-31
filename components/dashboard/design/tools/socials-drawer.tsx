'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';

import { LinkItem, SocialStyle } from '@/lib/types/design-system';
import { PLATFORMS } from '../constants';
import { ColorCircle } from '../color-circle';
import { FontPicker } from '../font-picker';
import { cn } from '@/lib/utils';

interface SocialsDrawerProps {
  links: LinkItem[];
  socialStyle?: SocialStyle;
  onUpdateLinks: (links: LinkItem[]) => void;
  onUpdateStyle: (style: SocialStyle) => void;
}

// --- Sortable Item Component ---
interface SocialItemProps {
  link: LinkItem;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SortableSocialItem({ link, onUpdate, onDelete, isExpanded, onToggleExpand }: SocialItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: isDragging ? 'relative' : undefined,
  } as React.CSSProperties;

  const platformDef = PLATFORMS.find(p => p.id === link.platform);
  const Icon = platformDef?.icon || LinkIcon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden transition-all",
        isDragging && "shadow-lg opacity-80 rotate-2",
        isExpanded && "ring-2 ring-black border-transparent"
      )}
    >
      {/* Header Row */}
      <div className="flex items-center gap-3 p-3 bg-gray-50/50">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
           <Icon className="w-4 h-4 text-gray-700" />
        </div>

        <span className="font-medium text-sm text-gray-700 flex-1">{link.label || platformDef?.label || link.platform}</span>

        <button
          onClick={onToggleExpand}
          className="p-2 text-gray-400 hover:text-black transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">

           {/* URL Input */}
           <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enlace</label>
              <input
                type="text"
                value={link.url}
                onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                placeholder={platformDef?.placeholder || "https://..."}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
           </div>

           {/* Label Input (New) */}
           <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Etiqueta</label>
              <input
                type="text"
                value={link.label}
                onChange={(e) => onUpdate(link.id, { label: e.target.value })}
                placeholder={platformDef?.label || "Nombre del enlace"}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
           </div>

           {/* Color & Actions */}
           <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Color de icono</label>
                 <ColorCircle
                   color={link.color || '#000000'}
                   onChange={(c) => onUpdate(link.id, { color: c })}
                   size="sm"
                 />
              </div>

              <button
                onClick={() => onDelete(link.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export function SocialsDrawer({ links, socialStyle, onUpdateLinks, onUpdateStyle }: SocialsDrawerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
     // Handled inline in DndContext
  };

  const addLink = (platform: string) => {
    const platformDef = PLATFORMS.find(p => p.id === platform);
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      platform: platform as any,
      url: '',
      label: platformDef?.label || platform,
      active: true,
      color: (platformDef as any)?.color || '#000000'
    };
    onUpdateLinks([...links, newLink]);
    setExpandedId(newLink.id);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    onUpdateLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLink = (id: string) => {
    onUpdateLinks(links.filter(l => l.id !== id));
  };

  // Helper to update style
  const updateStyle = (key: keyof SocialStyle, value: any) => {
    onUpdateStyle({
        ...socialStyle,
        [key]: value
    });
  };

  return (
    <div className="flex flex-col gap-6">

       {/* 0. Visual Styles (New) */}
       <div className="space-y-3 pb-6 border-b border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estilos Visuales</label>
          <div className="grid grid-cols-2 gap-4">
             {/* Button Background */}
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">Fondo Botones</label>
                <ColorCircle color={socialStyle?.buttonColor || '#f9fafb'} onChange={(c) => updateStyle('buttonColor', c)} />
             </div>
             {/* Icon Color */}
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">Iconos Global</label>
                <ColorCircle color={socialStyle?.iconColor || '#4b5563'} onChange={(c) => updateStyle('iconColor', c)} />
             </div>
              {/* Text Color */}
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">Texto</label>
                <ColorCircle color={socialStyle?.textColor || '#6b7280'} onChange={(c) => updateStyle('textColor', c)} />
             </div>
              {/* Font */}
             <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-gray-400">Tipografía</label>
                <FontPicker value={socialStyle?.font || 'Inter'} onChange={(f) => updateStyle('font', f)} className="w-full" />
             </div>
          </div>
       </div>

       {/* 1. Active List */}
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mis Redes ({links.length})</label>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => {
                const { active, over } = e;
                if (over && active.id !== over.id) {
                    const oldIndex = links.findIndex((item) => item.id === active.id);
                    const newIndex = links.findIndex((item) => item.id === over.id);
                    // Minimal arrayMove implementation manually to avoid import issues if package outdated
                    const newLinks = [...links];
                    const [movedItem] = newLinks.splice(oldIndex, 1);
                    newLinks.splice(newIndex, 0, movedItem);
                    onUpdateLinks(newLinks);
                }
            }}
          >
             <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
               {links.length > 0 ? (
                  links.map(link => (
                    <SortableSocialItem
                      key={link.id}
                      link={link}
                      onUpdate={updateLink}
                      onDelete={deleteLink}
                      isExpanded={expandedId === link.id}
                      onToggleExpand={() => setExpandedId(expandedId === link.id ? null : link.id)}
                    />
                  ))
               ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
                     No tienes redes agregadas
                  </div>
               )}
             </SortableContext>
          </DndContext>
       </div>

       {/* 2. Add New */}
       <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Agregar Nueva</label>
          <div className="grid grid-cols-4 gap-2">
             {PLATFORMS.map((platform) => {
                return (
                 <button
                   key={platform.id}
                   onClick={() => addLink(platform.id)}
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                 >
                   <platform.icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                   <span className="text-[10px] text-gray-600 font-medium truncate w-full text-center">{platform.label}</span>
                 </button>
               )
             })}
          </div>
       </div>

    </div>
  );
}
