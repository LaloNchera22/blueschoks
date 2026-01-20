'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  ChevronDown,
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
  Link as LinkIcon,
  MessageCircle,
  Trash2,
  MoreHorizontal,
  Globe
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DesignConfig, LinkItem } from '@/lib/types/design-system';
import { saveDesignConfig } from '@/app/dashboard/actions/design-actions';
import { Database } from '@/utils/supabase/types';
import { cn } from '@/lib/utils';
import { DEFAULT_DESIGN } from '@/utils/design-sanitizer';

// --- TYPES ---
type Product = Database['public']['Tables']['products']['Row'];

interface DesignEditorProps {
  initialConfig: DesignConfig;
  initialProducts: Product[];
  userId: string;
  slug: string;
}

// "Atom" selection key
type ToolType =
  | 'global'
  | 'header'
  | 'card-title'
  | 'card-price'
  | 'card-button'
  | `social-icon-${string}`; // social-icon-[id]

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Camiseta Básica', price: 25.00, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60' },
  { id: '2', name: 'Gorra Urbana', price: 15.00, image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Sneakers Pro', price: 120.00, image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Mochila Viaje', price: 45.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Playfair', value: 'Playfair Display' },
];

const PLATFORMS = [
  { id: 'instagram', icon: Instagram, label: 'Instagram' },
  { id: 'tiktok', icon: MessageCircle, label: 'TikTok' }, // Using MessageCircle as generic for now or custom path if needed
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { id: 'twitter', icon: Twitter, label: 'Twitter' },
  { id: 'facebook', icon: Facebook, label: 'Facebook' },
  { id: 'website', icon: Globe, label: 'Website' },
  { id: 'other', icon: LinkIcon, label: 'Otro' },
];

// --- HELPER COMPONENTS ---

const ColorCircle = ({
  color,
  onChange,
  size = "md"
}: {
  color: string;
  onChange: (c: string) => void;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <div className={cn(
      "relative group rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0",
      sizeClasses[size]
    )}>
      <input
        type="color"
        value={color || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
      />
    </div>
  );
};

// Sortable Item for Socials Manager
function SortableSocialItem({ id, link, onDelete }: { id: string, link: LinkItem, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const PlatformIcon = PLATFORMS.find(p => p.id === link.platform)?.icon || LinkIcon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 cursor-move hover:bg-gray-100 transition-colors relative group"
    >
      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
        <PlatformIcon className="w-4 h-4 text-gray-700" />
      </div>
      <span className="text-[10px] text-gray-500 font-medium truncate max-w-[60px]">{link.platform}</span>
      <button
        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag start
          onDelete(id);
        }}
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
      >
        <Trash2 className="w-2 h-2" />
      </button>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function DesignEditor({ initialConfig, initialProducts, userId, slug }: DesignEditorProps) {
  // Ensure we have valid defaults for new fields if they don't exist yet
  const safeInitialConfig = useMemo(() => {
    return {
      ...initialConfig,
      cardStyle: {
        ...DEFAULT_DESIGN.cardStyle,
        ...initialConfig.cardStyle
      }
    };
  }, [initialConfig]);

  const [config, setConfig] = useState<DesignConfig>(safeInitialConfig);
  const [activeTool, setActiveTool] = useState<ToolType>('global');
  const [isSaving, setIsSaving] = useState(false);
  const [showSocialsManager, setShowSocialsManager] = useState(false);

  // Degen state for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to update deep nested config
  const updateConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newConfig;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!current[key]) current[key] = {};
        current[key] = { ...current[key] };
        current = current[key];
      }

      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveDesignConfig(config);
      if (result.success) {
        toast.success("Diseño guardado correctamente");
      } else {
        toast.error("Error al guardar cambios");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  // Socials Management Logic
  const handleAddSocial = (platform: LinkItem['platform']) => {
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      platform,
      url: '',
      label: platform,
      active: true,
      color: '#000000'
    };
    updateConfig(['socialLinks'], [...config.socialLinks, newLink]);
  };

  const handleRemoveSocial = (id: string) => {
    updateConfig(['socialLinks'], config.socialLinks.filter(l => l.id !== id));
    if (activeTool === `social-icon-${id}`) setActiveTool('global');
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = config.socialLinks.findIndex((item) => item.id === active.id);
      const newIndex = config.socialLinks.findIndex((item) => item.id === over.id);
      updateConfig(['socialLinks'], arrayMove(config.socialLinks, oldIndex, newIndex));
    }
  };

  const updateSocialLink = (id: string, key: keyof LinkItem, value: any) => {
    const updatedLinks = config.socialLinks.map(link =>
      link.id === id ? { ...link, [key]: value } : link
    );
    updateConfig(['socialLinks'], updatedLinks);
  };

  const displayProducts = initialProducts.length > 0 ? initialProducts : DUMMY_PRODUCTS;

  // Derive current selection data
  const selectedSocialLink = useMemo(() => {
    if (activeTool && activeTool.startsWith('social-icon-')) {
      const id = activeTool.replace('social-icon-', '');
      return config.socialLinks.find(l => l.id === id);
    }
    return null;
  }, [activeTool, config.socialLinks]);

  return (
    <div className="w-full h-[calc(100vh-60px)] relative overflow-hidden flex flex-col items-center justify-center font-sans bg-gray-50">

      {/* --- ATMOSPHERIC BACKGROUND --- */}
      <div
        className="absolute inset-0 transition-colors duration-1000 ease-in-out pointer-events-none"
        style={{ backgroundColor: config.colors.background }}
      />
      {/* Blurred overlay that takes the primary color to create atmosphere */}
      <div
        className="absolute inset-0 opacity-40 backdrop-blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.colors.primary} 0%, transparent 70%)`
        }}
      />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl pointer-events-none" />


      {/* --- EDGE-TO-EDGE STORE CONTENT (Full Width/Height Scrollable) --- */}
      <div
        className={cn(
          "w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] relative z-10",
          activeTool === 'global' && "outline-none" // Removed visible ring for immersion
        )}
        style={{
          // We don't force background here to let the atmospheric background show through,
          // or we can set it to config.colors.background if opaque is desired.
          // Based on "immersive", we likely want the atmospheric background to be THE background.
          // However, to ensure text legibility, we might want the store to have its own background color.
          // The prompt says "flotando sobre el fondo atmosférico".
          // But also "La tienda debe verse como si ocupara toda la pantalla".
          // If we make this transparent, we see the atmosphere.
          // If we set bg color, we see the color.
          // I will set the background color but ensure it matches the theme.
          // The Atmospheric background is already derived from config.colors.background.
          // So setting backgroundColor here to transparent allows the "Atmosphere" (radial gradient) to show.
          // If I set it to solid config.colors.background, I lose the atmosphere.
          // I will set it to transparent here so the parent's atmospheric background acts as the store background.
          backgroundColor: 'transparent',
          color: config.colors.text,
          fontFamily: config.fonts.body
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveTool('global');
        }}
      >
        {/* 1. Header Section */}
        <div
          className={cn(
            "pt-16 pb-8 px-6 flex flex-col items-center text-center cursor-pointer transition-all",
            activeTool === 'header' && "bg-black/5 rounded-xl mx-4 mt-12"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTool('header');
          }}
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4 border-4 border-white shadow-sm relative">
            {config.profile.avatarUrl ? (
              <Image src={config.profile.avatarUrl} alt="Shop Avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Smartphone className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Shop Info */}
          <h1
            className="text-2xl font-bold leading-tight mb-2"
            style={{ fontFamily: config.fonts.heading }}
          >
            {config.profile.shopName || 'Mi Tienda'}
          </h1>
          <p className="text-sm opacity-80 max-w-[300px] leading-relaxed mx-auto">
            {config.profile.bio || 'Bienvenido a mi tienda online'}
          </p>

          {/* Social Icons (Atomic) */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {config.socialLinks.map((link) => {
              const Icon = PLATFORMS.find(p => p.id === link.platform)?.icon || LinkIcon;
              const isSelected = activeTool === `social-icon-${link.id}`;
              return (
                <button
                  key={link.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTool(`social-icon-${link.id}` as ToolType);
                  }}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 shadow-sm",
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:shadow-md"
                  )}
                  style={{
                    backgroundColor: link.color || config.colors.primary,
                    color: '#ffffff'
                  }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </button>
              )
            })}
            {config.socialLinks.length === 0 && (
              <div className="text-xs text-gray-400 border border-dashed border-gray-300 rounded-full px-3 py-1">
                Sin redes sociales
              </div>
            )}
          </div>
        </div>

        {/* 2. Products Grid (Card 2.0) */}
        {/* Added max-w-md to keep grid reasonable on desktop even if "full width" */}
        <div className="px-4 pb-32 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {displayProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-xl overflow-hidden shadow-sm flex flex-col group relative"
                style={{ backgroundColor: config.colors.cardBackground }}
              >
                {/* Image Aspect Ratio 4:5 */}
                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  {p.image_url && (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Quantity Selector Visual */}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-[10px] font-medium shadow-sm flex items-center gap-2">
                      <span>-</span> 1 <span>+</span>
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-1">
                    {/* Atomic Title */}
                    <p
                      className={cn(
                        "text-xs font-medium opacity-90 line-clamp-1 cursor-pointer hover:underline decoration-1 underline-offset-2",
                        activeTool === 'card-title' && "ring-1 ring-blue-500 bg-blue-50/50 rounded px-1 -mx-1"
                      )}
                      style={{ color: config.cardStyle?.titleColor || config.colors.text }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTool('card-title');
                      }}
                    >
                      {p.name}
                    </p>

                    {/* Atomic Price */}
                    <p
                      className={cn(
                      "text-sm font-bold mt-0.5 cursor-pointer hover:opacity-80",
                      activeTool === 'card-price' && "ring-1 ring-blue-500 bg-blue-50/50 rounded px-1 -mx-1 w-fit"
                      )}
                      style={{ color: config.cardStyle?.priceColor || config.colors.text }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTool('card-price');
                      }}
                    >
                      ${Number(p.price).toFixed(2)}
                    </p>

                    {/* Atomic Button */}
                    <button
                      className={cn(
                        "mt-2 w-full h-8 flex items-center justify-center text-xs font-medium transition-all hover:opacity-90 active:scale-95",
                        activeTool === 'card-button' && "ring-2 ring-blue-500 ring-offset-1"
                      )}
                      style={{
                        backgroundColor: config.cardStyle?.buttonColor || config.colors.primary,
                        color: config.cardStyle?.buttonTextColor || '#ffffff',
                        borderRadius: `${config.cardStyle?.borderRadius || 8}px`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTool('card-button');
                      }}
                    >
                      Agregar
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cart Button Preview (Static) */}
        <div className="fixed bottom-32 left-0 right-0 px-6 pointer-events-none z-20 flex justify-center">
            <div
              className="w-full max-w-sm h-12 rounded-full flex items-center justify-center font-bold text-white shadow-xl"
              style={{ backgroundColor: config.colors.primary }}
            >
              {config.checkout?.cartButtonText || 'Ver Carrito'}
            </div>
        </div>

      </div>

      {/* --- SMART TOOLBAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="h-16 pl-6 pr-2 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-5 transition-all duration-300 ease-out backdrop-blur-md bg-white/90 supports-[backdrop-filter]:bg-white/60">

          {/* 1. GLOBAL TOOLS (Default) */}
          {activeTool === 'global' && (
            <div className="flex items-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex flex-col items-center gap-1 group">
                <ColorCircle color={config.colors.background} onChange={(c) => updateConfig(['colors', 'background'], c)} />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Fondo</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                 <div className="relative">
                    <select
                      value={config.fonts.body}
                      onChange={(e) => {
                        updateConfig(['fonts', 'body'], e.target.value);
                        updateConfig(['fonts', 'heading'], e.target.value);
                      }}
                      className="appearance-none bg-gray-50 border border-gray-200 rounded-full h-8 pl-3 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
                 <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Fuente</span>
              </div>

              {/* Socials Manager Button */}
              <button
                onClick={() => setShowSocialsManager(!showSocialsManager)}
                className={cn(
                  "flex flex-col items-center gap-1 group",
                  showSocialsManager && "opacity-100"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all",
                  showSocialsManager ? "bg-black text-white border-black" : "bg-white text-gray-600 hover:bg-gray-50 hover:scale-105"
                )}>
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Redes</span>
              </button>
            </div>
          )}

          {/* 2. HEADER TOOLS */}
          {activeTool === 'header' && (
             <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <input
                type="text"
                value={config.profile.shopName || ''}
                onChange={(e) => updateConfig(['profile', 'shopName'], e.target.value)}
                placeholder="Nombre Tienda"
                className="h-8 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs w-36 focus:outline-none focus:ring-2 focus:ring-black/5"
              />
              <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.colors.text} onChange={(c) => updateConfig(['colors', 'text'], c)} />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Texto</span>
              </div>
             </div>
          )}

          {/* 3. ATOMIC SOCIAL ICON */}
          {activeTool?.startsWith('social-icon-') && selectedSocialLink && (
             <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col items-center gap-1">
                  <ColorCircle
                    color={selectedSocialLink.color || config.colors.primary}
                    onChange={(c) => updateSocialLink(selectedSocialLink.id, 'color', c)}
                  />
                  <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Icono</span>
                </div>

                <div className="w-px h-6 bg-gray-200" />

                <input
                  type="text"
                  value={selectedSocialLink.url}
                  onChange={(e) => updateSocialLink(selectedSocialLink.id, 'url', e.target.value)}
                  placeholder="https://..."
                  className="h-8 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-black/5"
                />

                <button
                  onClick={() => handleRemoveSocial(selectedSocialLink.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
          )}

          {/* 4. CARD BUTTON TOOLS */}
          {activeTool === 'card-button' && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex flex-col items-center gap-1">
                  <ColorCircle color={config.cardStyle?.buttonColor || '#000000'} onChange={(c) => updateConfig(['cardStyle', 'buttonColor'], c)} />
                  <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fondo</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <ColorCircle color={config.cardStyle?.buttonTextColor || '#ffffff'} onChange={(c) => updateConfig(['cardStyle', 'buttonTextColor'], c)} />
                  <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Texto</span>
               </div>

               <div className="flex flex-col items-center gap-1 w-24">
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={config.cardStyle?.borderRadius || 8}
                    onChange={(e) => updateConfig(['cardStyle', 'borderRadius'], Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Redondez</span>
               </div>
            </div>
          )}

          {/* 5. CARD TITLE/PRICE TOOLS */}
          {(activeTool === 'card-title' || activeTool === 'card-price') && (
             <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col items-center gap-1">
                  <ColorCircle
                    color={activeTool === 'card-title' ? (config.cardStyle?.titleColor || config.colors.text) : (config.cardStyle?.priceColor || config.colors.text)}
                    onChange={(c) => updateConfig(['cardStyle', activeTool === 'card-title' ? 'titleColor' : 'priceColor'], c)}
                  />
                  <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Color</span>
                </div>
             </div>
          )}

          {/* SAVE BUTTON (Always visible on right) */}
          <div className="pl-4 ml-auto border-l border-gray-200 py-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-black hover:bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- SOCIALS MANAGER POPOVER --- */}
      {showSocialsManager && (
         <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 w-[320px] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Mis Redes</h3>
              <button onClick={() => setShowSocialsManager(false)} className="text-gray-400 hover:text-black">&times;</button>
            </div>

            {/* Drag & Drop Area */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
               <div className="flex gap-2 flex-wrap mb-4 bg-gray-50/50 p-2 rounded-xl min-h-[60px]">
                  <SortableContext items={config.socialLinks.map(l => l.id)} strategy={horizontalListSortingStrategy}>
                    {config.socialLinks.map((link) => (
                      <SortableSocialItem
                        key={link.id}
                        id={link.id}
                        link={link}
                        onDelete={handleRemoveSocial}
                      />
                    ))}
                  </SortableContext>
                  {config.socialLinks.length === 0 && (
                     <p className="w-full text-center text-[10px] text-gray-400 py-2">Agrega redes abajo</p>
                  )}
               </div>
            </DndContext>

            {/* Add New Section */}
            <div className="grid grid-cols-4 gap-2">
               {PLATFORMS.filter(p => !config.socialLinks.find(l => l.platform === p.id)).map(platform => (
                 <button
                   key={platform.id}
                   onClick={() => handleAddSocial(platform.id as LinkItem['platform'])}
                   className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                 >
                   <platform.icon className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                   <span className="text-[9px] text-gray-500">{platform.label}</span>
                 </button>
               ))}
            </div>
         </div>
      )}

    </div>
  );
}
