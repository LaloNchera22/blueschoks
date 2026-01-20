'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Palette,
  User,
  LayoutTemplate,
  Share2,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  Smartphone,
  Loader2,
  Type
} from 'lucide-react';
import { toast } from 'sonner';

import { DesignConfig, LinkItem } from '@/lib/types/design-system';
import { saveDesignConfig } from '@/app/dashboard/actions/design-actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// --- TYPES ---

interface DesignEditorProps {
  initialConfig: DesignConfig;
  userId: string;
  slug: string;
}

type ToolType = 'global' | 'profile' | 'cards' | 'socials' | null;

// --- DUMMY DATA FOR PREVIEW ---
const DUMMY_PRODUCTS = [
  { id: 1, title: 'Camiseta Básica', price: '$25.00', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60' },
  { id: 2, title: 'Gorra Urbana', price: '$15.00', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60' },
  { id: 3, title: 'Sneakers Pro', price: '$120.00', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60' },
  { id: 4, title: 'Mochila Viaje', price: '$45.00', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
];

// --- STORE PREVIEW COMPONENT ---
// This component renders inside the "Phone"
const StorePreview = ({ config }: { config: DesignConfig }) => {
  const { colors, fonts, profile, checkout } = config;

  return (
    <div
      className="w-full h-full overflow-y-auto scrollbar-hide flex flex-col"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body
      }}
    >
      {/* Header */}
      <div className="p-6 flex flex-col items-center text-center space-y-4 pt-12">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>
        <div>
          <h1
            className="text-xl font-bold leading-tight"
            style={{ fontFamily: fonts.heading }}
          >
            {profile.shopName || 'Mi Tienda'}
          </h1>
          <p className="text-sm opacity-80 mt-1 max-w-[250px] mx-auto line-clamp-2">
            {profile.bio || 'Descripción de tu tienda...'}
          </p>
        </div>

        {/* Social Pills */}
        <div className="flex gap-2 flex-wrap justify-center">
            {config.socialLinks?.filter(l => l.active).map((link, i) => (
                <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5"
                >
                    <Share2 className="w-3 h-3 opacity-60" />
                </div>
            ))}
        </div>
      </div>

      {/* Grid of Products */}
      <div className="flex-1 px-4 pb-20">
        <div className="grid grid-cols-2 gap-3">
          {DUMMY_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden shadow-sm flex flex-col"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="aspect-square bg-gray-100 relative">
                 <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col gap-1">
                <span className="text-xs font-medium opacity-90 line-clamp-1">{product.title}</span>
                <span className="text-sm font-bold">{product.price}</span>
                {checkout?.showQuantitySelector && (
                    <div className="flex items-center gap-2 mt-1 text-xs opacity-50">
                        <span>-</span> 1 <span>+</span>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Cart Button Preview */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
          <div
            className="w-full py-3 rounded-full text-center font-bold text-sm shadow-xl"
            style={{
                backgroundColor: colors.primary,
                color: '#ffffff' // Assuming white text on primary for now, could be calculated
            }}
          >
              {checkout?.cartButtonText || 'Ver Carrito'}
          </div>
      </div>
    </div>
  );
};


// --- MAIN EDITOR COMPONENT ---

export default function DesignEditor({ initialConfig, userId, slug }: DesignEditorProps) {
  const [config, setConfig] = useState<DesignConfig>(initialConfig);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Update helper
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
        toast.error("Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
        setIsSaving(false);
    }
  };

  // Social Links Helpers
  const addSocialLink = () => {
    const newLink: LinkItem = {
        id: crypto.randomUUID(),
        platform: 'instagram',
        url: '',
        label: '',
        active: true
    };
    setConfig({ ...config, socialLinks: [...(config.socialLinks || []), newLink] });
  };

  const updateSocialLink = (index: number, key: string, value: any) => {
    const newLinks = [...(config.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [key]: value };
    setConfig({ ...config, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...(config.socialLinks || [])];
    newLinks.splice(index, 1);
    setConfig({ ...config, socialLinks: newLinks });
  };

  const toggleTool = (tool: ToolType) => {
      if (activeTool === tool) setActiveTool(null);
      else setActiveTool(tool);
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-[#f3f4f6] overflow-hidden flex flex-col items-center justify-center">

        {/* --- 1. CANVAS (PHONE) --- */}
        <div className="relative z-0 transform transition-all duration-500 ease-in-out">
            <div className="w-[380px] h-[750px] bg-white rounded-[40px] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative mx-auto">
                {/* Status Bar Fake */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 z-10 flex justify-between px-6 items-center">
                    <div className="text-[10px] text-white font-medium">9:41</div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                    </div>
                </div>

                {/* Island / Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>

                {/* Content */}
                <StorePreview config={config} />
            </div>
        </div>

        {/* --- 2. FLOATING PANELS (TOOLTIPS) --- */}
        {activeTool && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-4 mx-4">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-semibold text-gray-800 capitalize">
                            {activeTool === 'global' && 'Estilos Globales'}
                            {activeTool === 'profile' && 'Perfil de Tienda'}
                            {activeTool === 'cards' && 'Tarjetas de Producto'}
                            {activeTool === 'socials' && 'Enlaces Sociales'}
                        </h3>
                        <Button variant="ghost" size="icon-sm" onClick={() => setActiveTool(null)} className="h-6 w-6 rounded-full hover:bg-black/5">
                            <X className="w-3 h-3" />
                        </Button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin pr-2 space-y-4">

                        {/* GLOBAL TOOLS */}
                        {activeTool === 'global' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500">Fondo</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border shadow-sm relative shrink-0">
                                                <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer"
                                                    value={config.colors.background}
                                                    onChange={(e) => updateConfig(['colors', 'background'], e.target.value)}
                                                />
                                            </div>
                                            <Input value={config.colors.background} onChange={(e) => updateConfig(['colors', 'background'], e.target.value)} className="h-8 text-xs font-mono" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500">Texto</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border shadow-sm relative shrink-0">
                                                <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer"
                                                    value={config.colors.text}
                                                    onChange={(e) => updateConfig(['colors', 'text'], e.target.value)}
                                                />
                                            </div>
                                            <Input value={config.colors.text} onChange={(e) => updateConfig(['colors', 'text'], e.target.value)} className="h-8 text-xs font-mono" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Tipografía</Label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                        value={config.fonts.body}
                                        onChange={(e) => updateConfig(['fonts', 'body'], e.target.value)}
                                    >
                                        <option value="Inter">Inter (Moderna)</option>
                                        <option value="Roboto">Roboto (Geométrica)</option>
                                        <option value="Open Sans">Open Sans (Neutra)</option>
                                        <option value="Lato">Lato (Amigable)</option>
                                        <option value="Montserrat">Montserrat (Urbana)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* PROFILE TOOLS */}
                        {activeTool === 'profile' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Nombre de la Tienda</Label>
                                    <Input
                                        value={config.profile.shopName || ''}
                                        onChange={(e) => updateConfig(['profile', 'shopName'], e.target.value)}
                                        placeholder="Mi Tienda"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Biografía</Label>
                                    <Textarea
                                        value={config.profile.bio || ''}
                                        onChange={(e) => updateConfig(['profile', 'bio'], e.target.value)}
                                        placeholder="Descripción corta..."
                                        className="min-h-[60px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Avatar URL</Label>
                                    <Input
                                        value={config.profile.avatarUrl || ''}
                                        onChange={(e) => updateConfig(['profile', 'avatarUrl'], e.target.value)}
                                        placeholder="https://..."
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {/* CARDS TOOLS */}
                        {activeTool === 'cards' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500">Fondo Tarjeta</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border shadow-sm relative shrink-0">
                                                <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer"
                                                    value={config.colors.cardBackground}
                                                    onChange={(e) => updateConfig(['colors', 'cardBackground'], e.target.value)}
                                                />
                                            </div>
                                            <Input value={config.colors.cardBackground} onChange={(e) => updateConfig(['colors', 'cardBackground'], e.target.value)} className="h-8 text-xs font-mono" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-500">Color Botón</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border shadow-sm relative shrink-0">
                                                <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer"
                                                    value={config.colors.primary}
                                                    onChange={(e) => updateConfig(['colors', 'primary'], e.target.value)}
                                                />
                                            </div>
                                            <Input value={config.colors.primary} onChange={(e) => updateConfig(['colors', 'primary'], e.target.value)} className="h-8 text-xs font-mono" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs">Selector de Cantidad</Label>
                                        <Switch
                                            checked={config.checkout?.showQuantitySelector}
                                            onCheckedChange={(c) => updateConfig(['checkout', 'showQuantitySelector'], c)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Texto del Botón</Label>
                                        <Input
                                            value={config.checkout?.cartButtonText || 'Ver Carrito'}
                                            onChange={(e) => updateConfig(['checkout', 'cartButtonText'], e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SOCIALS TOOLS */}
                        {activeTool === 'socials' && (
                            <div className="space-y-3">
                                {config.socialLinks?.map((link, idx) => (
                                    <div key={link.id || idx} className="flex gap-2 items-center p-2 rounded-lg bg-gray-50 border">
                                        <select
                                            className="h-8 rounded-md border text-xs bg-white w-24 px-1"
                                            value={link.platform}
                                            onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                                        >
                                            <option value="instagram">Instagram</option>
                                            <option value="whatsapp">WhatsApp</option>
                                            <option value="website">Web</option>
                                        </select>
                                        <Input
                                            value={link.url}
                                            onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                                            placeholder="URL..."
                                            className="h-8 text-xs"
                                        />
                                        <Button variant="ghost" size="icon-sm" onClick={() => removeSocialLink(idx)} className="text-red-500 h-8 w-8 hover:bg-red-50">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addSocialLink} variant="outline" size="sm" className="w-full gap-2 text-xs">
                                    <Plus className="w-3 h-3" /> Agregar Enlace
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45 border-r border-b border-white/20"></div>
            </div>
        )}

        {/* --- 3. DOCK (BOTTOM MENU) --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl rounded-full p-2 flex items-center gap-1 shadow-2xl z-40 border border-white/10 text-white">
            <DockButton
                icon={Palette}
                label="Global"
                isActive={activeTool === 'global'}
                onClick={() => toggleTool('global')}
            />
            <div className="w-px h-6 bg-white/10 mx-1"></div>

            <DockButton
                icon={User}
                label="Perfil"
                isActive={activeTool === 'profile'}
                onClick={() => toggleTool('profile')}
            />
            <DockButton
                icon={LayoutTemplate}
                label="Cards"
                isActive={activeTool === 'cards'}
                onClick={() => toggleTool('cards')}
            />
            <DockButton
                icon={Share2}
                label="Links"
                isActive={activeTool === 'socials'}
                onClick={() => toggleTool('socials')}
            />

            <div className="w-px h-6 bg-white/10 mx-1"></div>

            <Button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                    "rounded-full h-12 px-6 ml-1 transition-all duration-300 gap-2 font-medium shadow-[0_0_20px_rgba(79,70,229,0.5)]",
                    isSaving ? "bg-indigo-600/80" : "bg-indigo-600 hover:bg-indigo-500"
                )}
            >
                {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">{isSaving ? '...' : 'Guardar'}</span>
            </Button>
        </div>

    </div>
  );
}

// --- DOCK BUTTON COMPONENT ---
function DockButton({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative group flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300",
                isActive ? "bg-white/20 text-white translate-y-[-4px]" : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
        >
            <Icon className={cn("w-6 h-6 transition-all", isActive ? "scale-110" : "scale-100")} />
            <span className={cn(
                "absolute -top-8 bg-black/80 px-2 py-1 rounded text-[10px] text-white opacity-0 transition-opacity pointer-events-none",
                "group-hover:opacity-100"
            )}>
                {label}
            </span>
            {isActive && <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>}
        </button>
    );
}
