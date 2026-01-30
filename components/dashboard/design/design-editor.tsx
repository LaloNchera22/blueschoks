'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Loader2,
  Lock,
  Star,
  ChevronDown,
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
  Link2 as LinkIcon,
  MessageCircle,
  Trash2,
  MoreHorizontal,
  Globe,
  Circle,
  Square,
  Minus,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ShoppingBag,
  Plus,
  Check,
  Mail,
  ExternalLink,
  Upload,
  Copy,
  Store,
  Mountain,
  ALargeSmall
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
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

import { DesignConfig, LinkItem, ProductStyle } from '@/lib/types/design-system';
import { saveDesignConfig } from '@/app/dashboard/actions/design-actions';
import { updateProductStyle, applyStyleToAllProducts, saveProductStylesBulk } from '@/app/dashboard/products/actions';
import { Database } from '@/utils/supabase/types';
import { cn } from '@/lib/utils';
import { DEFAULT_DESIGN } from '@/utils/design-sanitizer';
import { ProductStylingToolbar } from './product-styling-toolbar';
import { ProfileStylingToolbar } from './profile-styling-toolbar';
import { BackgroundStylingToolbar } from './background-styling-toolbar';
import { TypographyStylingToolbar } from './typography-styling-toolbar';
import { ColorCircle } from './color-circle';
import { ProductCard } from '@/components/store/product-card';
import { FontLoaderListener } from '@/components/ui/font-loader-listener';
import { GOOGLE_FONTS_LIST } from '@/utils/font-loader';
import { FontPicker } from './font-picker';

// --- TYPES ---
type Product = Database['public']['Tables']['products']['Row'];

interface DesignEditorProps {
  initialConfig: DesignConfig;
  initialProducts: Product[];
  userId: string;
  slug: string;
  isPro?: boolean;
}

// "Atom" selection key
type ToolType =
  | 'global'
  | 'background'
  | 'typography'
  | 'header-avatar'
  | 'header-title'
  | 'header-bio'
  | 'card-title'
  | 'card-price'
  | 'card-button'
  | 'product-individual'
  | 'social-global'
  | `social-icon-${string}`; // social-icon-[id]

type SelectionState = {
  productId: string;
  elementType: 'container' | 'title' | 'price' | 'cartButton' | 'description';
} | null;

const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Playfair', value: 'Playfair Display' },
];

const PLATFORMS = [
  { id: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/usuario' },
  { id: 'tiktok', icon: LinkIcon, label: 'TikTok', placeholder: 'https://tiktok.com/@usuario' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', placeholder: 'https://wa.me/...' },
  { id: 'telegram', label: 'Telegram', icon: LinkIcon, placeholder: 'https://t.me/tu_usuario', prefix: 'https://t.me/' },
  { id: 'onlyfans', label: 'OnlyFans', icon: LinkIcon, placeholder: 'https://onlyfans.com/tu_usuario', prefix: 'https://onlyfans.com/', color: '#00AFF0' },
  { id: 'twitter', icon: Twitter, label: 'Twitter', placeholder: 'https://twitter.com/usuario' },
  { id: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/usuario' },
  { id: 'website', icon: Store, label: 'Mi Tienda Web', placeholder: 'https://...' },
  { id: 'email', icon: Mail, label: 'Email', placeholder: 'mailto:...' },
  { id: 'other', icon: LinkIcon, label: 'Otro', placeholder: 'https://...' },
];

// --- HELPER FUNCTIONS ---

const getContrastColor = (hexcolor: string) => {
  // If no color or invalid, default to black
  if (!hexcolor || !hexcolor.startsWith('#')) return '#000000';

  // Convert to RGB
  const r = parseInt(hexcolor.substring(1,3), 16);
  const g = parseInt(hexcolor.substring(3,5), 16);
  const b = parseInt(hexcolor.substring(5,7), 16);

  // Calculate luminance (YIQ)
  const yiq = ((r*299)+(g*587)+(b*114))/1000;

  // Return black or white based on luminance
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

// --- HELPER COMPONENTS ---

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

export default function DesignEditor({ initialConfig, initialProducts, userId, slug, isPro = false }: DesignEditorProps) {
  const router = useRouter();
  // Ensure we have valid defaults for new fields if they don't exist yet
  const safeInitialConfig = useMemo(() => {
    return {
      ...initialConfig,
      cardStyle: {
        ...DEFAULT_DESIGN.cardStyle,
        ...initialConfig.cardStyle
      },
      profile: {
        ...DEFAULT_DESIGN.profile,
        ...initialConfig.profile,
        titleStyle: initialConfig.profile?.titleStyle || {},
        bioStyle: initialConfig.profile?.bioStyle || {}
      }
    };
  }, [initialConfig]);

  const [config, setConfig] = useState<DesignConfig>(safeInitialConfig);
  // Initialize products with local state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTool, setActiveTool] = useState<ToolType>('global');
  const [selection, setSelection] = useState<SelectionState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [showSocialsManager, setShowSocialsManager] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 1. Preparar datos
      const productUpdates = products.map(p => ({
        id: p.id,
        style_config: (p.style_config as ProductStyle) || {}
      }));

      // 2. Ejecutar Acciones en Paralelo
      const [designResult, productsResult] = await Promise.all([
        saveDesignConfig(config),
        // Only send updates if we have initial products to avoid sending dummy data
        initialProducts.length > 0 ? saveProductStylesBulk(productUpdates) : Promise.resolve({ success: true })
      ]);

      if (designResult.error) throw new Error("Error saving design: " + JSON.stringify(designResult.error));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((productsResult as any)?.error) throw new Error((productsResult as any).error);

      toast.success("¡Todo guardado correctamente!");
      router.refresh();
    } catch (error: any) {
      console.error("❌ ERROR AL GUARDAR:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- PRODUCT STYLING LOGIC ---
  const getSelectedProduct = () => products.find(p => p.id === selection?.productId);

  const updateSelectedProductStyle = (key: keyof ProductStyle, value: string | undefined) => {
    if (!selection?.productId) return;

    setProducts(prev => prev.map(p => {
        if (p.id === selection.productId) {
            return {
                ...p,
                style_config: {
                    ...p.style_config,
                    [key]: value
                }
            };
        }
        return p;
    }));
  };

  const handleSaveProduct = async () => {
    if (!selection?.productId) return;
    const product = getSelectedProduct();
    if (!product) return;

    setIsSavingProduct(true);
    try {
        await updateProductStyle(product.id, product.style_config || {});
        toast.success("Estilo de producto guardado");
        router.refresh();
    } catch (e) {
        toast.error("Error al guardar producto");
    } finally {
        setIsSavingProduct(false);
    }
  };

  const handleApplyToAll = async () => {
      if (!selection?.productId) return;
      const product = getSelectedProduct();
      if (!product?.style_config) return;

      if (!confirm("¿Aplicar este estilo a TODOS los productos?")) return;

      setIsSavingProduct(true);
      try {
          await applyStyleToAllProducts(product.style_config);

          // Update local state
          setProducts(prev => prev.map(p => ({
              ...p,
              style_config: product.style_config
          })));

          toast.success("Estilo aplicado a todos");
          router.refresh();
      } catch (e) {
          toast.error("Error al aplicar estilos");
      } finally {
          setIsSavingProduct(false);
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setIsUploadingImage(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      toast.error("Error al subir imagen");
      setIsUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    updateConfig(['profile', 'avatarUrl'], publicUrl);
    setIsUploadingImage(false);
    toast.success("Avatar actualizado");
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setIsUploadingImage(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `bg-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      toast.error("Error al subir imagen");
      setIsUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    updateConfig(['backgroundImage'], publicUrl);
    setIsUploadingImage(false);
    toast.success("Fondo actualizado");
  };

  // Socials Management Logic
  const handleAddSocial = (platform: LinkItem['platform']) => {
    const platformDef = PLATFORMS.find(p => p.id === platform);
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      platform,
      url: '',
      label: platform,
      active: true,
      color: (platformDef as any)?.color || '#000000'
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

  // Derive current selection data
  const selectedSocialLink = useMemo(() => {
    if (activeTool && activeTool.startsWith('social-icon-')) {
      const id = activeTool.replace('social-icon-', '');
      return config.socialLinks.find(l => l.id === id);
    }
    return null;
  }, [activeTool, config.socialLinks]);

  // Derive Avatar Shape Styles
  const avatarClasses = useMemo(() => {
    switch(config.profile.avatarShape) {
      case 'none': return 'rounded-none';
      case 'square': return 'rounded-2xl';
      case 'rounded': return 'rounded-2xl';
      case 'circle':
      default: return 'rounded-full';
    }
  }, [config.profile.avatarShape]);

  // Helper for Text Styles
  const getTextStyle = (type: 'title' | 'bio') => {
    const styleConfig = type === 'title' ? config.profile.titleStyle : config.profile.bioStyle;
    return {
      fontFamily: styleConfig?.fontFamily || (type === 'title' ? config.fonts.heading : config.fonts.body),
      fontWeight: styleConfig?.bold ? 'bold' : 'normal',
      fontStyle: styleConfig?.italic ? 'italic' : 'normal',
      textAlign: styleConfig?.align || 'center',
      color: styleConfig?.color || config.colors.text,
      fontSize: styleConfig?.size ? `${styleConfig.size}px` : undefined,
    };
  };

  const selectedProduct = getSelectedProduct();

  // --- RENDER TOOLBAR CONTENT EXCLUSIVELY ---
  const renderToolbarContent = () => {
    switch (activeTool) {
      case 'header-title':
      case 'header-bio':
        return (
          <ProfileStylingToolbar
            activeTool={activeTool}
            config={config}
            onUpdateConfig={updateConfig}
          />
        );
      case 'background':
        return (
          <BackgroundStylingToolbar
            config={config}
            onUpdate={updateConfig}
            onUploadImage={handleBackgroundUpload}
            onClose={() => setActiveTool('global')}
            isUploading={isUploadingImage}
          />
        );
      case 'typography':
        return (
          <TypographyStylingToolbar
            config={config}
            onUpdate={updateConfig}
            onClose={() => setActiveTool('global')}
          />
        );
      case 'social-global':
        return (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.socialStyle?.buttonColor || '#f9fafb'} onChange={(c) => updateConfig(['socialStyle', 'buttonColor'], c)} size="sm" />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fondo</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.socialStyle?.iconColor || '#4b5563'} onChange={(c) => updateConfig(['socialStyle', 'iconColor'], c)} size="sm" />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Icono</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.socialStyle?.textColor || '#6b7280'} onChange={(c) => updateConfig(['socialStyle', 'textColor'], c)} size="sm" />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Texto</span>
             </div>

             <div className="flex flex-col items-center gap-1">
                <FontPicker value={config.socialStyle?.font || config.fonts.body} onChange={(f) => updateConfig(['socialStyle', 'font'], f)} className="h-7 w-28" />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fuente</span>
             </div>

             <div className="w-px h-6 bg-gray-200 mx-1" />

             <button
                onClick={() => setShowSocialsManager(!showSocialsManager)}
                className={cn(
                  "flex flex-col items-center gap-1 group",
                  showSocialsManager && "opacity-100"
                )}
             >
                <div className={cn(
                  "w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-all",
                  showSocialsManager ? "bg-black text-white border-black" : "bg-white text-gray-600 hover:bg-gray-50"
                )}>
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Gestionar</span>
             </button>
          </div>
        );
      case 'global':
        return (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
             <button
                onClick={() => setActiveTool('background')}
                className="flex flex-col items-center gap-1 group cursor-pointer"
             >
              <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all group-hover:bg-gray-50">
                 <Mountain className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Fondo</span>
            </button>

             <button
                onClick={() => setActiveTool('typography')}
                className="flex flex-col items-center gap-1 group cursor-pointer"
             >
              <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all group-hover:bg-gray-50">
                 <ALargeSmall className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </div>
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Fuente</span>
            </button>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300" />

            {/* Socials Manager Button */}
            <button
              onClick={() => setActiveTool('social-global')}
              className="flex flex-col items-center gap-1 group"
              title="Redes"
            >
              <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-all bg-white text-gray-600 hover:bg-gray-50 hover:scale-105">
                <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-black transition-colors">Redes</span>
            </button>
          </div>
        );
      case 'header-avatar':
        return (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Image Input (Replaced) */}
            <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
                <div className="flex items-center gap-2 h-7 rounded-full border border-gray-200 bg-gray-50 px-3 hover:bg-gray-100 transition-colors cursor-pointer">
                   {isUploadingImage ? (
                      <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                   ) : (
                      <Upload className="w-3 h-3 text-gray-500" />
                   )}
                   <span className="text-xs font-medium text-gray-600">
                      {isUploadingImage ? 'Subiendo...' : 'Subir Foto'}
                   </span>
                </div>
            </label>

            {/* Shape Selector */}
            <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
              <button
                onClick={() => updateConfig(['profile', 'avatarShape'], 'circle')}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                  config.profile.avatarShape === 'circle' ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                )}
                title="Círculo"
              >
                <Circle className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => updateConfig(['profile', 'avatarShape'], 'square')}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                  (config.profile.avatarShape === 'square' || config.profile.avatarShape === 'rounded') ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                )}
                title="Cuadrado Redondeado"
              >
                <div className="w-2.5 h-2.5 border-2 border-current rounded-sm" />
              </button>
              <button
                onClick={() => updateConfig(['profile', 'avatarShape'], 'none')}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                  config.profile.avatarShape === 'none' ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                )}
                title="Cuadrado Recto (Sin Borde)"
              >
                <Square className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Border Toggle/Color */}
            <div className="flex flex-col items-center gap-1">
               <div className="flex items-center gap-1 relative">
                  <ColorCircle
                      color={config.profile.avatarBorderColor || 'transparent'}
                      onChange={(c) => updateConfig(['profile', 'avatarBorderColor'], c)}
                      size="sm"
                  />
                  {config.profile.avatarBorderColor && (
                      <button
                          onClick={(e) => {
                              e.stopPropagation();
                              updateConfig(['profile', 'avatarBorderColor'], undefined);
                          }}
                          className="absolute -top-1 -right-1 bg-gray-100 border border-gray-300 rounded-full p-0.5 hover:bg-gray-200 transition-colors shadow-sm z-10"
                          title="Quitar borde"
                      >
                          <Minus size={10} className="text-gray-600" />
                      </button>
                  )}
               </div>
               <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Borde</span>
            </div>
          </div>
        );
      case 'card-button':
        return (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.cardStyle?.buttonColor || '#000000'} onChange={(c) => updateConfig(['cardStyle', 'buttonColor'], c)} size="sm" />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Fondo</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <ColorCircle color={config.cardStyle?.buttonTextColor || '#ffffff'} onChange={(c) => updateConfig(['cardStyle', 'buttonTextColor'], c)} size="sm" />
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
        );
      case 'card-title':
      case 'card-price':
        return (
           <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col items-center gap-1">
                <ColorCircle
                  color={activeTool === 'card-title' ? (config.cardStyle?.titleColor || config.colors.text) : (config.cardStyle?.priceColor || config.colors.text)}
                  onChange={(c) => updateConfig(['cardStyle', activeTool === 'card-title' ? 'titleColor' : 'priceColor'], c)}
                  size="sm"
                />
                <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Color</span>
              </div>
           </div>
        );
      case 'product-individual':
        if (selectedProduct && selection) {
           return (
              <ProductStylingToolbar
                product={selectedProduct}
                activeElement={selection.elementType}
                onUpdate={updateSelectedProductStyle}
                onSave={handleSaveProduct}
                onApplyAll={handleApplyToAll}
                onClose={() => {
                  setActiveTool('global');
                  setSelection(null);
                }}
                isSaving={isSavingProduct}
                fonts={GOOGLE_FONTS_LIST.map(f => ({ name: f, value: f }))}
                defaultColors={{
                  title: config.cardStyle?.titleColor || config.colors.text,
                  price: config.cardStyle?.priceColor || config.colors.primary,
                  button: config.cardStyle?.buttonColor || '#000000',
                  buttonText: config.cardStyle?.buttonTextColor || '#ffffff'
                }}
              />
           );
        }
        return null;
      default:
        // Handle dynamic social-icon-* cases
        if (activeTool && activeTool.startsWith('social-icon-') && selectedSocialLink) {
           return (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="flex flex-col items-center gap-1">
                   <ColorCircle
                     color={selectedSocialLink.color || config.colors.primary}
                     onChange={(c) => updateSocialLink(selectedSocialLink.id, 'color', c)}
                     size="sm"
                   />
                   <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Icono</span>
                 </div>

                 <div className="w-px h-6 bg-gray-200" />

                 <input
                   type="text"
                   value={selectedSocialLink.url}
                   onChange={(e) => updateSocialLink(selectedSocialLink.id, 'url', e.target.value)}
                   placeholder={PLATFORMS.find(p => p.id === selectedSocialLink.platform)?.placeholder || "https://..."}
                   className="h-7 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-black/5"
                 />

                 <button
                   onClick={() => handleRemoveSocial(selectedSocialLink.id)}
                   className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                 >
                   <Trash2 className="w-3.5 h-3.5" />
                 </button>
              </div>
           );
        }
        return null;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center font-sans bg-gray-50">
      <FontLoaderListener config={config} products={products} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <style>{`
        /* Hide Next.js Dev Tools and Toasts in Editor Preview */
        [data-nextjs-toast],
        [data-nextjs-toast-wrapper],
        .nextjs-toast-errors-parent,
        #nextjs-dev-tools-overlay,
        nextjs-portal,
        nextjs-portal-entrance {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          z-index: -9999 !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Attempt to target shadow roots if possible via simple selectors, though tricky in CSS */
        /* Note: Shadow DOM blocking requires JS usually, but some tools expose a wrapper. */
      `}</style>

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

      {/* --- PRO LOCK OVERLAY --- */}
      {!isPro && (
        <div className="absolute inset-0 z-[100] backdrop-blur-md bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-white/50 animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
                <Lock className="w-7 h-7" />
             </div>
             <h2 className="text-2xl font-black text-slate-900 mb-2">Personalización PRO</h2>
             <p className="text-slate-500 mb-8 leading-relaxed">
               Desbloquea el editor de diseño completo. Personaliza colores, fuentes, botones y más para que tu tienda sea única.
             </p>
             <Link href="/dashboard/pricing" className="block w-full">
                <button className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                   <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                   Desbloquear PRO
                </button>
             </Link>
          </div>
        </div>
      )}

      {/* --- SMART TOOLBAR (FIX: MOVED OUTSIDE SCROLL FLOW & ABSOLUTE POSITIONED) --- */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-[350px] px-4 mb-4 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-11 px-2 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-between gap-1 transition-all duration-300 ease-out backdrop-blur-md overflow-hidden">

          {renderToolbarContent()}

          {/* SAVE BUTTON (Always visible on right) */}
          {activeTool !== 'product-individual' && (
            <div className="pl-2 ml-auto border-l border-gray-200 py-1">
                <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black hover:bg-gray-800 text-white rounded-full w-7 h-7 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </button>
            </div>
          )}
        </div>
      </div>

      {/* --- EDGE-TO-EDGE STORE CONTENT (Full Width/Height Scrollable) --- */}
      <div
        className={cn(
          "w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] relative z-10",
          activeTool === 'global' && "outline-none"
        )}
        style={{
          color: config.colors.text,
          fontFamily: config.fonts.body
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveTool('global');
          setSelection(null);
        }}
      >
        {/* --- PREVIEW AREA (NEW STORE CLIENT STRUCTURE) --- */}
        <div className="flex justify-center pb-32 px-4 pt-40"> {/* Added pt-40 to account for floating toolbar */}
          <div className="w-full max-w-[420px] origin-top scale-[0.9] 2xl:scale-100 transition-transform bg-transparent">
             <div
               className="h-full min-h-[800px] pb-40 relative rounded-[32px] overflow-hidden"
               style={{ backgroundColor: config.colors.background || '#ffffff' }}
             >
                {/* Background Image Layer */}
                {config.backgroundImage && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                       <img
                          src={config.backgroundImage}
                          alt="Background"
                          className="w-full h-full object-cover"
                          style={{ opacity: config.backgroundOpacity ?? 0.5 }}
                       />
                    </div>
                )}

                <div className="relative z-10">
                {/* FIX: REMOVED STICKY HEADER VISUAL TO REMOVE FAKE HEADER BAR */}

                {/* --- 2. HERO SECTION --- */}
                <div className="flex flex-col items-center text-center pt-16 pb-10 px-6"> {/* Increased pt-8 to pt-16 for visual balance without header */}
                   {/* AVATAR */}
                   <div
                     className="relative mb-6 group cursor-pointer hover:opacity-80 transition-opacity"
                     onClick={(e) => {
                       e.stopPropagation();
                       setActiveTool('header-avatar');
                       fileInputRef.current?.click();
                     }}
                   >
                       <div
                          className={cn(
                            "relative h-32 w-32 overflow-hidden ring-2 ring-offset-2 ring-neutral-900/10 transition-all",
                             avatarClasses,
                             activeTool === 'header-avatar' && "ring-4 ring-blue-500 ring-offset-2"
                          )}
                       >
                           {config.profile.avatarUrl ? (
                               <Image src={config.profile.avatarUrl} alt="Avatar" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                   <Smartphone className="w-10 h-10" />
                               </div>
                           )}
                           {/* Hover Overlay */}
                           <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold">Editar</span>
                           </div>
                       </div>
                   </div>

                   {/* SHOP NAME */}
                   <input
                     type="text"
                     value={config.profile.shopName || ''}
                     placeholder="Mi Tienda"
                     className={cn(
                       "bg-transparent border-none outline-none text-center w-full text-2xl font-bold tracking-tight mb-3 placeholder:text-neutral-400",
                        activeTool === 'header-title' && "underline decoration-blue-500 decoration-2 underline-offset-4"
                     )}
                     style={getTextStyle('title')}
                     onChange={(e) => updateConfig(['profile', 'shopName'], e.target.value)}
                     onClick={(e) => { e.stopPropagation(); setActiveTool('header-title'); }}
                   />

                   {/* SOCIALS */}
                   <div className="flex flex-wrap justify-center gap-3 mb-4">
                       {config.socialLinks.map((link) => {
                           const platformDef = PLATFORMS.find(p => p.id === link.platform);
                           const Icon = platformDef?.icon || LinkIcon;

                           const isSelected = activeTool === `social-icon-${link.id}`;
                           return (
                               <button
                                  key={link.id}
                                  onClick={(e) => { e.stopPropagation(); setActiveTool(`social-icon-${link.id}` as ToolType); }}
                                  className="group flex flex-col items-center gap-1 min-w-[60px]"
                               >
                                   <div
                                      className={cn(
                                          "p-3 rounded-full transition-all duration-300 border border-gray-100 shadow-sm hover:scale-105",
                                          isSelected && "ring-2 ring-blue-500 ring-offset-2 scale-110"
                                      )}
                                      style={{
                                          backgroundColor: config.socialStyle?.buttonColor || '#f9fafb',
                                          color: link.color ? link.color : (config.socialStyle?.iconColor || '#4b5563')
                                      }}
                                   >
                                       <Icon size={20} strokeWidth={1.5} />
                                   </div>
                                   <span
                                      className="text-[10px] font-medium transition-colors"
                                      style={{
                                          color: config.socialStyle?.textColor || '#6b7280',
                                          fontFamily: config.socialStyle?.font || config.fonts.body
                                      }}
                                   >
                                      {platformDef?.label || link.platform}
                                   </span>
                               </button>
                           )
                       })}
                       {config.socialLinks.length === 0 && (
                          <div className="text-xs text-gray-400 border border-dashed border-gray-300 rounded-full px-4 py-2">
                             Sin redes sociales
                          </div>
                       )}
                   </div>

                   {/* BIO */}
                   <textarea
                     value={config.profile.bio || ''}
                     placeholder="Haz clic para agregar un mensaje de bienvenida..."
                     rows={3}
                     className={cn(
                       "bg-transparent border-none outline-none text-center w-full resize-none max-w-xl text-sm leading-relaxed mb-6 placeholder:italic placeholder:opacity-50 placeholder:text-gray-400 rounded px-2 -mx-2",
                       activeTool === 'header-bio' && "ring-2 ring-blue-500 bg-blue-50/50"
                     )}
                     style={getTextStyle('bio')}
                     onChange={(e) => updateConfig(['profile', 'bio'], e.target.value)}
                     onClick={(e) => { e.stopPropagation(); setActiveTool('header-bio'); }}
                   />
                </div>

                {/* --- 3. PRODUCT GRID --- */}
                <div className="px-4 pb-12">
                   {products.length > 0 ? (
                       <div className="grid grid-cols-2 gap-4">
                          {products.map((p) => {
                              const isProductSelected = activeTool === 'product-individual' && selection?.productId === p.id;

                              return (
                              <div
                                key={p.id}
                                className={cn(
                                    "relative transition-all duration-300",
                                    isProductSelected && "ring-2 ring-blue-500 bg-blue-50/50 rounded-2xl"
                                )}
                              >
                                 <ProductCard
                                    product={p}
                                    config={config}
                                    onSelectElement={(elementType) => {
                                        setActiveTool('product-individual');
                                        setSelection({ productId: p.id, elementType });
                                    }}
                                 />
                                 {/* Overlay for selection visualization if needed, but the ring above handles container selection. */}
                              </div>
                          )})}
                       </div>
                   ) : (
                       <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                            <ShoppingBag className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm font-medium text-gray-500">Tu tienda está vacía</p>
                       </div>
                   )}
                </div>
                </div>

             </div>
          </div>
        </div>

      </div>

      {/* --- SOCIALS MANAGER POPOVER --- */}
      {showSocialsManager && (
         <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 w-[320px] max-w-[90vw] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
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
