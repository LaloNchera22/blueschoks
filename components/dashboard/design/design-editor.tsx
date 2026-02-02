'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Loader2,
  Lock,
  Star,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import { DesignConfig, ProductStyle } from '@/lib/types/design-system';
import { saveDesignConfig } from '@/app/dashboard/actions/design-actions';
import { updateProductStyle, applyStyleToAllProducts, saveProductStylesBulk } from '@/app/dashboard/products/actions';
import { Database } from '@/utils/supabase/types';
import { DEFAULT_DESIGN } from '@/utils/design-sanitizer';

// Components
import { StorePreview } from './store-preview';
import { FontLoaderListener } from '@/components/ui/font-loader-listener';
import { GOOGLE_FONTS_LIST } from '@/utils/font-loader';
import { ProductStylingToolbar } from './product-styling-toolbar';

// New Architecture Components
import { cn } from '@/lib/utils';
import { DesignDrawer } from './design-drawer';
import { BottomNav } from './bottom-nav';
import { TextEditorDrawer } from './tools/text-editor-drawer';
import { BackgroundDrawer } from './tools/background-drawer';
import { SocialsDrawer } from './tools/socials-drawer';
import { ProfileDrawer } from './tools/profile-drawer';
import { CardStylingDrawer } from './tools/card-styling-drawer';
import { TypographyDrawer } from './tools/typography-drawer';

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
  | 'global' // Closed
  | 'background'
  | 'typography'
  | 'header-avatar'
  | 'header-title'
  | 'header-bio'
  | 'card-styling'
  | 'card-title'
  | 'card-price'
  | 'card-button'
  | 'product-individual'
  | 'social-global'
  | 'profile-global'
  | `social-icon-${string}`;

type SelectionState = {
  productId: string;
  elementType: 'container' | 'title' | 'price' | 'cartButton' | 'description';
} | null;

// --- MAIN COMPONENT ---

export default function DesignEditor({ initialConfig, initialProducts, userId, slug, isPro = false }: DesignEditorProps) {
  const router = useRouter();

  // Ensure we have valid defaults
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  // null means closed, string means open drawer
  const [activeTool, setActiveTool] = useState<ToolType | string | null>(null);
  const [selection, setSelection] = useState<SelectionState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const productUpdates = products.map(p => ({
        id: p.id,
        style_config: (p.style_config as ProductStyle) || {}
      }));

      const [designResult, productsResult] = await Promise.all([
        saveDesignConfig(config),
        initialProducts.length > 0 ? saveProductStylesBulk(productUpdates) : Promise.resolve({ success: true })
      ]);

      if (designResult.error) throw new Error("Error saving design: " + JSON.stringify(designResult.error));
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

  const selectedProduct = getSelectedProduct();

  // --- RENDER DRAWER CONTENT ---
  const renderDrawerContent = () => {
     switch(activeTool) {
        case 'header-title':
           return (
              <TextEditorDrawer
                 currentStyle={config.profile.titleStyle || {}}
                 onUpdate={(key, val) => updateConfig(['profile', 'titleStyle', key], val)}
                 defaultFont={config.fonts.heading}
                 defaultColor={config.colors.text}
                 textValue={config.profile.shopName}
                 onTextChange={(val) => updateConfig(['profile', 'shopName'], val)}
                 inputType="input"
                 inputLabel="Título"
              />
           );
        case 'header-bio':
           return (
              <TextEditorDrawer
                 currentStyle={config.profile.bioStyle || {}}
                 onUpdate={(key, val) => updateConfig(['profile', 'bioStyle', key], val)}
                 defaultFont={config.fonts.body}
                 defaultColor={config.colors.text}
                 textValue={config.profile.bio}
                 onTextChange={(val) => updateConfig(['profile', 'bio'], val)}
                 inputType="textarea"
                 inputLabel="Mensaje de Bienvenida"
              />
           );
        case 'background':
           return (
              <BackgroundDrawer
                 config={config}
                 onUpdate={updateConfig}
                 onUploadImage={handleBackgroundUpload}
                 isUploading={isUploadingImage}
              />
           );
        case 'typography':
           return (
              <TypographyDrawer
                 config={config}
                 onUpdate={updateConfig}
              />
           );
        case 'card-styling':
           return (
              <CardStylingDrawer
                 config={config}
                 onUpdate={updateConfig}
              />
           );
        case 'social-global':
           return (
              <SocialsDrawer
                 links={config.socialLinks}
                 socialStyle={config.socialStyle}
                 onUpdateLinks={(links) => updateConfig(['socialLinks'], links)}
                 onUpdateStyle={(style) => updateConfig(['socialStyle'], style)}
              />
           );
        case 'profile-global':
        case 'header-avatar':
           return (
              <ProfileDrawer
                 config={config}
                 onUpdate={updateConfig}
                 onUploadImage={handleImageUpload}
                 isUploading={isUploadingImage}
              />
           );
        case 'product-individual':
           if (!selectedProduct || !selection) return null;
           return (
              <ProductStylingToolbar
                product={selectedProduct}
                activeElement={selection.elementType}
                onUpdate={updateSelectedProductStyle}
                onSave={handleSaveProduct}
                onApplyAll={handleApplyToAll}
                onClose={() => {
                  setActiveTool(null);
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
        default:
           return null;
     }
  };

  const getDrawerTitle = () => {
     switch(activeTool) {
        case 'header-title': return 'Editar Título';
        case 'header-bio': return 'Editar Bienvenida';
        case 'background': return 'Fondo de Tienda';
        case 'typography': return 'Tipografía Global';
        case 'card-styling': return 'Estilo de Tarjetas';
        case 'social-global': return 'Redes Sociales';
        case 'profile-global': return 'Perfil';
        case 'header-avatar': return 'Foto de Perfil';
        case 'product-individual': return 'Editar Producto';
        default: return undefined;
     }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col font-sans bg-gray-50">
      <FontLoaderListener config={config} products={products} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Hide Next.js Dev Tools Overlay in Preview */}
      <style>{`
        [data-nextjs-toast], [data-nextjs-toast-wrapper], .nextjs-toast-errors-parent,
        #nextjs-dev-tools-overlay, nextjs-portal, nextjs-portal-entrance {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          z-index: -9999 !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      <div
        className="absolute inset-0 transition-colors duration-1000 ease-in-out pointer-events-none z-0"
        style={{ backgroundColor: config.colors.background }}
      />
      <div
        className="absolute inset-0 opacity-40 backdrop-blur-3xl pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.colors.primary} 0%, transparent 70%)`
        }}
      />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl pointer-events-none z-0" />

      {/* --- TOP BAR (SAVE & PRO) --- */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
         {!isPro && (
            <Link href="/dashboard/pricing">
                <button className="h-9 px-4 bg-yellow-400 text-yellow-900 font-bold rounded-full text-xs shadow-lg flex items-center gap-1 hover:bg-yellow-300 transition-colors">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    PRO
                </button>
            </Link>
         )}

         <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 px-5 bg-black hover:bg-gray-800 text-white font-medium rounded-full text-xs shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
         >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isSaving ? "Guardando..." : "Guardar"}
         </button>
      </div>

      {/* --- MAIN PREVIEW AREA (Scrollable) --- */}
      <div
        id="store-preview-container"
        className="flex-1 overflow-y-auto w-full relative z-10 pb-24"
        onClick={(e) => {
          e.stopPropagation();
          if(activeTool === 'product-individual' && selection) {
              setSelection(null);
              setActiveTool(null);
          }
        }}
      >
          <StorePreview
             config={config}
             products={products}
             activeTool={typeof activeTool === 'string' ? activeTool : null}
             onSelectTool={(tool) => setActiveTool(tool)}
             selection={selection}
             onSelectElement={(pid, elemType) => {
                 setActiveTool('product-individual');
                 setSelection({ productId: pid, elementType: elemType });
             }}
          />
      </div>

      {/* --- BOTTOM NAVIGATION (Fixed at bottom via Flex) --- */}
      <BottomNav
          activeTool={typeof activeTool === 'string' && ['background', 'typography', 'card-styling', 'social-global', 'profile-global'].includes(activeTool) ? activeTool : ''}
          onSelectTool={(tool) => setActiveTool(tool)}
          className="z-[60]"
      />

      {/* --- DRAWERS --- */}
      <DesignDrawer
         isOpen={!!activeTool}
         onClose={() => setActiveTool(null)}
         title={getDrawerTitle()}
         className={cn("mb-[90px]", activeTool === 'product-individual' && "h-[70vh]")}
      >
         {renderDrawerContent()}
      </DesignDrawer>

      {/* --- PRO LOCK OVERLAY --- */}
      {!isPro && (
        <div className="absolute inset-0 z-[100] backdrop-blur-md bg-white/30 flex items-center justify-center p-4 pointer-events-none">
          {/* pointer-events-none because it's usually blocked by UI logic, but if it's an overlay it should block?
              Wait, if !isPro, we show this. It SHOULD block.
              But the original code didn't have pointer-events-none.
              It was z-[100].
              It blocks everything.
          */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-white/50 animate-in fade-in zoom-in duration-300 pointer-events-auto">
             <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
                <Lock className="w-7 h-7" />
             </div>
             <h2 className="text-2xl font-black text-slate-900 mb-2">Personalización PRO</h2>
             <p className="text-slate-500 mb-8 leading-relaxed">
               Desbloquea el editor de diseño completo.
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

    </div>
  );
}
