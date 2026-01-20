'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  List,
  Move,
  Palette,
  User,
  LayoutTemplate,
  Share2,
  Save,
  X,
  Plus,
  Trash2,
  ChevronDown,
  Smartphone,
  Loader2,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

import { DesignConfig, LinkItem } from '@/lib/types/design-system';
import { saveDesignConfig } from '@/app/dashboard/actions/design-actions';
import { Database } from '@/utils/supabase/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// --- TYPES ---

type Product = Database['public']['Tables']['products']['Row'];

interface DesignEditorProps {
  initialConfig: DesignConfig;
  initialProducts: Product[];
  userId: string;
  slug: string;
}

type ToolType = 'global' | 'header' | 'cards' | 'socials' | null;

// --- DUMMY DATA FOR PREVIEW ---
const DUMMY_PRODUCTS = [
  { id: '1', name: 'Camiseta Básica', price: 25.00, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60' },
  { id: '2', name: 'Gorra Urbana', price: 15.00, image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Sneakers Pro', price: 120.00, image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Mochila Viaje', price: 45.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter', type: 'Sans' },
  { name: 'Roboto', value: 'Roboto', type: 'Sans' },
  { name: 'Open Sans', value: 'Open Sans', type: 'Sans' },
  { name: 'Lato', value: 'Lato', type: 'Sans' },
  { name: 'Montserrat', value: 'Montserrat', type: 'Sans' },
  { name: 'Playfair Display', value: 'Playfair Display', type: 'Serif' },
];

// --- STORE PREVIEW COMPONENT ---
interface StorePreviewProps {
    config: DesignConfig;
    products: Product[];
}

const StorePreview = ({ config, products }: StorePreviewProps) => {
  const { colors, fonts, profile, checkout } = config;
  const displayProducts = products.length > 0 ? products : DUMMY_PRODUCTS;

  return (
    <div
      className="w-full h-full overflow-y-auto scrollbar-hide flex flex-col relative group/preview transition-all duration-300"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body
      }}
    >
      {/* Header Zone */}
      <div className="p-6 flex flex-col items-center text-center space-y-4 pt-12">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg relative bg-gray-200">
          {profile.avatarUrl ? (
            <Image
                src={profile.avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
                sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
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
          <p
            className="text-sm opacity-80 mt-1 max-w-[250px] mx-auto line-clamp-2"
            style={{ fontFamily: fonts.body }}
          >
            {profile.bio || 'Descripción de tu tienda...'}
          </p>
        </div>

        {/* Social Pills */}
        <div className="flex gap-2 flex-wrap justify-center pointer-events-none">
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

      {/* Grid of Products Zone */}
      <div className="flex-1 px-4 pb-20 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden shadow-sm flex flex-col transition-all"
              style={{ backgroundColor: colors.cardBackground }}
            >
              <div className="aspect-square bg-gray-100 relative">
                 {product.image_url ? (
                     <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                     />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <Smartphone className="w-8 h-8" />
                    </div>
                 )}
              </div>
              <div className="p-3 flex flex-col gap-1">
                <span className="text-xs font-medium opacity-90 line-clamp-1">
                    {product.name}
                </span>
                <span className="text-sm font-bold">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
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
      <div className="absolute bottom-6 left-0 right-0 px-6 pointer-events-none">
          <div
            className="w-full py-3 rounded-full text-center font-bold text-sm shadow-xl"
            style={{
                backgroundColor: colors.primary,
                color: '#ffffff'
            }}
          >
              {checkout?.cartButtonText || 'Ver Carrito'}
          </div>
      </div>
    </div>
  );
};


// --- MAIN EDITOR COMPONENT ---

export default function DesignEditor({ initialConfig, initialProducts, userId, slug }: DesignEditorProps) {
  const [config, setConfig] = useState<DesignConfig>(initialConfig);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fake states for visual toolbar elements
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false); // Visual only for now (unless mapped)

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

  // --- TOOLBAR RENDER ---
  // The floating top bar mimicking a text editor (Canva style)
  const TopToolbar = () => (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white rounded-full shadow-sm border border-gray-100 px-2 py-1.5 h-12 animate-in slide-in-from-top-4 duration-300">

        {/* Font Selector */}
        <div className="relative group">
            <select
                className="appearance-none bg-transparent hover:bg-gray-50 pl-3 pr-8 py-1.5 rounded-lg text-sm font-medium w-32 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                value={config.fonts.heading}
                onChange={(e) => updateConfig(['fonts', 'heading'], e.target.value)}
            >
                {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
            </select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Font Size (Visual Only) */}
        <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500">
                <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-mono w-6 text-center">{fontSize}</span>
            <button onClick={() => setFontSize(fontSize + 1)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500">
                <Plus className="w-3 h-3" />
            </button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Text Color (Visual/Mapped to Text Color) */}
        <div className="relative group cursor-pointer p-1.5 hover:bg-gray-100 rounded-lg">
            <div className="flex flex-col items-center gap-0.5">
                <span className="font-serif font-bold text-sm leading-none">A</span>
                <div
                    className="w-4 h-1 rounded-full"
                    style={{ backgroundColor: config.colors.text }}
                ></div>
            </div>
             {/* Simple color picker trigger (hidden input hack) */}
             <input
                type="color"
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={config.colors.text}
                onChange={(e) => updateConfig(['colors', 'text'], e.target.value)}
            />
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Formatting Icons */}
        <div className="flex items-center gap-1">
            <button
                onClick={() => setIsBold(!isBold)}
                className={cn("p-1.5 rounded-lg transition-colors", isBold ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100 text-gray-600")}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="Italic">
                <Italic className="w-4 h-4" />
            </button>
             <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="Underline">
                <Underline className="w-4 h-4" />
            </button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

         <div className="flex items-center gap-1">
             <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="Align">
                <AlignLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="List">
                <List className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="Spacing">
                <Move className="w-4 h-4" />
            </button>
         </div>

         <Separator orientation="vertical" className="h-6 bg-gray-200" />

         {/* Extra Actions Buttons */}
         <div className="flex items-center gap-1 ml-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs font-medium px-2 text-gray-600 hover:bg-gray-100">
                Efectos
            </Button>
             <Button variant="ghost" size="sm" className="h-7 text-xs font-medium px-2 text-gray-600 hover:bg-gray-100">
                Animar
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs font-medium px-2 text-gray-600 hover:bg-gray-100">
                Posición
            </Button>
         </div>

    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-[#e5e5e5] overflow-hidden flex flex-col items-center justify-center font-sans">

        {/* Background Grid Pattern (Subtle) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* 1. TOP TOOLBAR */}
        <TopToolbar />

        {/* 2. CANVAS (PHONE) */}
        <div className="relative z-10 transform transition-all duration-500 ease-in-out scale-90 sm:scale-100 mt-8">
             {/* Phone Bezel */}
            <div className="w-[380px] h-[750px] bg-white rounded-[45px] border-[10px] border-[#1a1a1a] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] overflow-hidden relative mx-auto ring-1 ring-black/5">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-black/5 z-20 flex justify-between px-6 items-center pointer-events-none backdrop-blur-sm">
                    <div className="text-[10px] font-semibold text-gray-800">9:41</div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-gray-800 rounded-full opacity-20"></div>
                        <div className="w-2.5 h-2.5 bg-gray-800 rounded-full opacity-20"></div>
                    </div>
                </div>

                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-full z-30 pointer-events-none flex items-center justify-end px-2">
                    <div className="w-2 h-2 rounded-full bg-blue-900/50"></div>
                </div>

                {/* Content */}
                <StorePreview
                    config={config}
                    products={initialProducts}
                />
            </div>
        </div>

        {/* 3. EDIT PANEL (FLOATING CARD ABOVE DOCK) */}
        {activeTool && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mx-4 flex flex-col max-h-[500px]">
                    {/* Panel Header */}
                    <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                             {activeTool === 'global' && <Palette className="w-4 h-4 text-indigo-500" />}
                             {activeTool === 'header' && <User className="w-4 h-4 text-indigo-500" />}
                             {activeTool === 'cards' && <LayoutTemplate className="w-4 h-4 text-indigo-500" />}
                             {activeTool === 'socials' && <Share2 className="w-4 h-4 text-indigo-500" />}
                            <span className="font-semibold text-sm text-gray-800 uppercase tracking-wide">
                                {activeTool === 'global' && 'Estilos Globales'}
                                {activeTool === 'header' && 'Perfil y Cabecera'}
                                {activeTool === 'cards' && 'Tarjetas de Producto'}
                                {activeTool === 'socials' && 'Redes Sociales'}
                            </span>
                        </div>
                        <button
                            onClick={() => setActiveTool(null)}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="p-5 overflow-y-auto scrollbar-thin">

                         {/* GLOBAL TOOLS */}
                         {activeTool === 'global' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Colores Base</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ColorPicker
                                            label="Fondo Tienda"
                                            value={config.colors.background}
                                            onChange={(v) => updateConfig(['colors', 'background'], v)}
                                        />
                                        <ColorPicker
                                            label="Color Texto"
                                            value={config.colors.text}
                                            onChange={(v) => updateConfig(['colors', 'text'], v)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Tipografía Base</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                         <div className="space-y-1">
                                            <Label className="text-xs">Fuente Cuerpo (Body)</Label>
                                            <select
                                                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={config.fonts.body}
                                                onChange={(e) => updateConfig(['fonts', 'body'], e.target.value)}
                                            >
                                                {FONTS.map(f => <option key={f.value} value={f.value}>{f.name} ({f.type})</option>)}
                                            </select>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PROFILE TOOLS */}
                        {activeTool === 'header' && (
                            <div className="space-y-5">
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Información Básica</Label>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Nombre de la Tienda</Label>
                                            <Input
                                                value={config.profile.shopName || ''}
                                                onChange={(e) => updateConfig(['profile', 'shopName'], e.target.value)}
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                                placeholder="Ej. Mi Marca"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Biografía / Slogan</Label>
                                            <Textarea
                                                value={config.profile.bio || ''}
                                                onChange={(e) => updateConfig(['profile', 'bio'], e.target.value)}
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-all min-h-[80px]"
                                                placeholder="Lo mejor en moda urbana..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Imagen de Perfil</Label>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border relative">
                                            {config.profile.avatarUrl ? (
                                                <Image src={config.profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                            )}
                                        </div>
                                        <Input
                                            value={config.profile.avatarUrl || ''}
                                            onChange={(e) => updateConfig(['profile', 'avatarUrl'], e.target.value)}
                                            placeholder="https://..."
                                            className="bg-gray-50 border-gray-200 text-xs flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CARDS TOOLS */}
                        {activeTool === 'cards' && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Apariencia Tarjeta</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ColorPicker
                                            label="Fondo Tarjeta"
                                            value={config.colors.cardBackground}
                                            onChange={(v) => updateConfig(['colors', 'cardBackground'], v)}
                                        />
                                        <ColorPicker
                                            label="Color Acento/Botón"
                                            value={config.colors.primary}
                                            onChange={(v) => updateConfig(['colors', 'primary'], v)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Comportamiento</Label>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-medium">Selector Cantidad</Label>
                                            <p className="text-[10px] text-gray-500">Mostrar (- 1 +) en la tarjeta</p>
                                        </div>
                                        <Switch
                                            checked={config.checkout?.showQuantitySelector}
                                            onCheckedChange={(c) => updateConfig(['checkout', 'showQuantitySelector'], c)}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs">Texto Botón Carrito</Label>
                                        <Input
                                            value={config.checkout?.cartButtonText || 'Ver Carrito'}
                                            onChange={(e) => updateConfig(['checkout', 'cartButtonText'], e.target.value)}
                                            className="bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                         {/* SOCIALS TOOLS */}
                         {activeTool === 'socials' && (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {config.socialLinks?.map((link, idx) => (
                                        <div key={link.id || idx} className="flex gap-2 items-start p-3 rounded-xl bg-gray-50 border border-gray-200 group relative">
                                            <div className="flex-1 space-y-2">
                                                 <select
                                                    className="w-full h-8 rounded-md border-gray-200 text-xs bg-white px-2 outline-none focus:ring-1 focus:ring-indigo-500"
                                                    value={link.platform}
                                                    onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                                                >
                                                    <option value="instagram">Instagram</option>
                                                    <option value="whatsapp">WhatsApp</option>
                                                    <option value="tiktok">TikTok</option>
                                                    <option value="facebook">Facebook</option>
                                                    <option value="website">Sitio Web</option>
                                                </select>
                                                <Input
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                                                    placeholder="URL..."
                                                    className="h-8 text-xs bg-white border-gray-200"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeSocialLink(idx)}
                                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors mt-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    {(!config.socialLinks || config.socialLinks.length === 0) && (
                                        <div className="text-center py-6 text-gray-400 text-sm">
                                            No hay enlaces configurados
                                        </div>
                                    )}
                                </div>
                                <Button onClick={addSocialLink} className="w-full gap-2 text-xs bg-black hover:bg-gray-800 text-white rounded-xl h-10 shadow-lg shadow-black/10">
                                    <Plus className="w-3.5 h-3.5" /> Agregar Nuevo Enlace
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        )}

        {/* 4. BOTTOM DOCK (MENU) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-[#1a1a1a] rounded-full p-2 pl-4 pr-2 flex items-center gap-1 shadow-2xl ring-1 ring-white/10">

                <div className="flex items-center gap-2 mr-2">
                    <DockIcon
                        icon={Palette}
                        isActive={activeTool === 'global'}
                        onClick={() => toggleTool('global')}
                        label="Estilos"
                    />
                     <DockIcon
                        icon={User}
                        isActive={activeTool === 'header'}
                        onClick={() => toggleTool('header')}
                        label="Perfil"
                    />
                     <DockIcon
                        icon={LayoutTemplate}
                        isActive={activeTool === 'cards'}
                        onClick={() => toggleTool('cards')}
                        label="Tarjetas"
                    />
                     <DockIcon
                        icon={Share2}
                        isActive={activeTool === 'socials'}
                        onClick={() => toggleTool('socials')}
                        label="Social"
                    />
                </div>

                <div className="w-px h-8 bg-white/10 mx-1"></div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                        "rounded-full h-10 px-5 ml-1 transition-all duration-300 gap-2 font-medium text-sm",
                        "bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-900/50 hover:shadow-indigo-600/50"
                    )}
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">Guardar</span>
                    )}
                </Button>
            </div>
        </div>

    </div>
  );
}

// --- HELPER COMPONENTS ---

function DockIcon({ icon: Icon, isActive, onClick, label }: { icon: any, isActive: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative w-10 h-10 flex flex-col items-center justify-center rounded-full transition-all duration-200",
                isActive ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
            title={label}
        >
            <Icon className="w-5 h-5" />
            {isActive && <span className="absolute -bottom-1 w-1 h-1 bg-indigo-500 rounded-full"></span>}
        </button>
    );
}

function ColorPicker({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-2">
            <Label className="text-xs text-gray-500">{label}</Label>
            <div className="flex gap-2 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm relative shrink-0 ring-2 ring-white hover:ring-indigo-100 transition-all cursor-pointer">
                    <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer opacity-0"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <div className="w-full h-full" style={{ backgroundColor: value }}></div>
                </div>
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-9 text-xs font-mono uppercase bg-white"
                    maxLength={7}
                />
            </div>
        </div>
    );
}
