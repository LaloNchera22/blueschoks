'use client';

import React, { useState, useEffect } from 'react';
// 1. IMPORTAMOS LinkItem PARA CORREGIR EL TIPO
import { DesignConfig, LinkItem } from '@/lib/types/design-system';
import { saveThemeConfig } from '@/app/dashboard/actions/design-actions';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  LayoutTemplate,
  IdCard,
  Share2,
  Save,
  Loader2,
  Palette,
  Type,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from 'sonner';

interface DesignEditorProps {
  initialConfig: DesignConfig;
  userId: string;
  slug: string;
}

type SectionId = 'global' | 'header' | 'cards' | 'socials';

interface Section {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const SECTIONS: Section[] = [
  { id: 'global', label: 'Global', icon: Globe, description: 'Configuración general de colores y tipografía.' },
  { id: 'header', label: 'Encabezado', icon: LayoutTemplate, description: 'Información de tu perfil y cabecera.' },
  { id: 'cards', label: 'Tarjetas', icon: IdCard, description: 'Apariencia de las tarjetas de enlace.' },
  { id: 'socials', label: 'Redes Sociales', icon: Share2, description: 'Gestiona tus enlaces sociales.' },
];

export default function DesignEditor({ initialConfig, userId, slug }: DesignEditorProps) {
  const [config, setConfig] = useState<DesignConfig>(initialConfig);
  const [activeSection, setActiveSection] = useState<SectionId>('global');
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función blindada para actualizaciones anidadas
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

  // --- LÓGICA DE REDES SOCIALES (CORREGIDA) ---
  const addSocialLink = () => {
    // CORRECCIÓN AQUÍ: Definimos explícitamente el objeto como LinkItem
    // y usamos 'as LinkItem["platform"]' para calmar a TypeScript
    const newLink: LinkItem = { 
      id: crypto.randomUUID(), 
      platform: 'instagram' as LinkItem['platform'], // Forzamos el tipo literal
      url: '', 
      label: '', 
      active: true 
    };

    const newLinks = [
      ...(config.socialLinks || []),
      newLink
    ];
    setConfig({ ...config, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...(config.socialLinks || [])];
    newLinks.splice(index, 1);
    setConfig({ ...config, socialLinks: newLinks });
  };

  const updateSocialLink = (index: number, key: string, value: any) => {
    const newLinks = [...(config.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [key]: value };
    setConfig({ ...config, socialLinks: newLinks });
  };
  // --------------------------------

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await saveThemeConfig(config as any);
      if (result.success) {
        toast.success("Diseño guardado correctamente");
      } else {
        toast.error("Error al guardar el diseño");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error inesperado al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-gray-50/50">
      {/* LEFT SIDEBAR - NAVIGATION */}
      <div className="w-64 border-r bg-white h-full flex flex-col shadow-sm flex-shrink-0">
        <div className="p-6 border-b">
          <h2 className="font-bold text-xl flex items-center gap-2 text-gray-800">
            <Palette className="w-5 h-5 text-indigo-600" />
            Diseño
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Personaliza tu tienda</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <Button
                key={section.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium border-l-4 border-indigo-600 rounded-r-md rounded-l-none pl-3' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {section.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t bg-gray-50/50">
          <Button
            className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {/* RIGHT CONTENT - SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
              {SECTIONS.find(s => s.id === activeSection)?.description}
            </p>
          </div>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 space-y-6">

              {/* === GLOBAL SECTION === */}
              {activeSection === 'global' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Colores Principales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="bg-color">Fondo de Página</Label>
                            <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg border shadow-sm overflow-hidden flex-shrink-0 relative">
                                <input
                                id="bg-color"
                                type="color"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                                value={config.colors.background}
                                onChange={(e) => updateConfig(['colors', 'background'], e.target.value)}
                                />
                            </div>
                            <Input
                                value={config.colors.background}
                                onChange={(e) => updateConfig(['colors', 'background'], e.target.value)}
                                className="font-mono uppercase"
                            />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="text-color">Texto Principal</Label>
                            <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg border shadow-sm overflow-hidden flex-shrink-0 relative">
                                <input
                                id="text-color"
                                type="color"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                                value={config.colors.text}
                                onChange={(e) => updateConfig(['colors', 'text'], e.target.value)}
                                />
                            </div>
                            <Input
                                value={config.colors.text}
                                onChange={(e) => updateConfig(['colors', 'text'], e.target.value)}
                                className="font-mono uppercase"
                            />
                            </div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Type className="w-4 h-4" /> Tipografía
                    </h3>
                    <div className="grid gap-2 max-w-md">
                        <Label>Fuente Principal</Label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={config.fonts.body}
                            onChange={(e) => updateConfig(['fonts', 'body'], e.target.value)}
                        >
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Lato">Lato</option>
                            <option value="Montserrat">Montserrat</option>
                        </select>
                        <p className="text-xs text-muted-foreground">Esta fuente se usará en textos generales.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* === HEADER SECTION === */}
              {activeSection === 'header' && (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="shop-name">Nombre de la Tienda</Label>
                    <Input
                      id="shop-name"
                      placeholder="Ej: Mi Tienda Cool"
                      value={config.profile.shopName || ''}
                      onChange={(e) => updateConfig(['profile', 'shopName'], e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biografía / Descripción</Label>
                    <Textarea
                      id="bio"
                      placeholder="Cuéntale a tus clientes de qué trata tu tienda..."
                      className="resize-none min-h-[100px]"
                      value={config.profile.bio || ''}
                      onChange={(e) => updateConfig(['profile', 'bio'], e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="avatar">URL del Avatar (Imagen de perfil)</Label>
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                         {config.profile.avatarUrl ? (
                            <img src={config.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                            <div className="text-gray-400 text-xs text-center">Sin<br/>Imagen</div>
                         )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                            id="avatar"
                            placeholder="https://ejemplo.com/mi-imagen.jpg"
                            value={config.profile.avatarUrl || ''}
                            onChange={(e) => updateConfig(['profile', 'avatarUrl'], e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Pega aquí el enlace directo a tu imagen.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="grid gap-2 max-w-md">
                        <Label>Fuente de Títulos</Label>
                        <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={config.fonts.heading}
                            onChange={(e) => updateConfig(['fonts', 'heading'], e.target.value)}
                        >
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Playfair Display">Playfair Display</option>
                        </select>
                    </div>
                  </div>
                </div>
              )}

              {/* === CARDS SECTION === */}
              {activeSection === 'cards' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="card-bg">Color de Fondo de Tarjeta</Label>
                        <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg border shadow-sm overflow-hidden flex-shrink-0 relative">
                            <input
                            id="card-bg"
                            type="color"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                            value={config.colors.cardBackground}
                            onChange={(e) => updateConfig(['colors', 'cardBackground'], e.target.value)}
                            />
                        </div>
                        <Input
                            value={config.colors.cardBackground}
                            onChange={(e) => updateConfig(['colors', 'cardBackground'], e.target.value)}
                            className="font-mono uppercase"
                        />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="primary-color">Color de Acento (Botones)</Label>
                        <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg border shadow-sm overflow-hidden flex-shrink-0 relative">
                            <input
                            id="primary-color"
                            type="color"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                            value={config.colors.primary}
                            onChange={(e) => updateConfig(['colors', 'primary'], e.target.value)}
                            />
                        </div>
                        <Input
                            value={config.colors.primary}
                            onChange={(e) => updateConfig(['colors', 'primary'], e.target.value)}
                            className="font-mono uppercase"
                        />
                        </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                      <h4 className="text-sm font-medium mb-4">Vista Previa Simple</h4>
                      <div className="p-6 rounded-lg border" style={{ backgroundColor: config.colors.background }}>
                          <div 
                            className="p-4 rounded-lg shadow-sm max-w-xs mx-auto"
                            style={{ backgroundColor: config.colors.cardBackground }}
                          >
                              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                              <div className="h-3 w-1/2 bg-gray-100 rounded mb-4"></div>
                              <div 
                                className="h-8 w-full rounded flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: config.colors.primary }}
                              >
                                  BOTÓN DE PRUEBA
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              )}

              {/* === SOCIALS SECTION (EDITABLE) === */}
              {activeSection === 'socials' && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Mis Enlaces</h3>
                      <Button onClick={addSocialLink} size="sm" className="gap-2 bg-black hover:bg-gray-800 text-white">
                          <Plus className="w-4 h-4" /> Agregar Enlace
                      </Button>
                   </div>

                   {(!config.socialLinks || config.socialLinks.length === 0) ? (
                       <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground bg-gray-50">
                           <Share2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                           <p>No tienes enlaces configurados aún.</p>
                       </div>
                   ) : (
                       <div className="space-y-4">
                           {config.socialLinks.map((link, index) => (
                               <div key={link.id || index} className="flex gap-3 items-start p-3 border rounded-md bg-white shadow-sm group">
                                   <div className="grid gap-2 flex-1">
                                       <div className="flex gap-2">
                                           <select
                                                className="flex h-9 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                                value={link.platform}
                                                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                           >
                                               <option value="instagram">Instagram</option>
                                               <option value="tiktok">TikTok</option>
                                               <option value="twitter">Twitter</option>
                                               <option value="facebook">Facebook</option>
                                               <option value="youtube">YouTube</option>
                                               <option value="website">Web</option>
                                               <option value="whatsapp">WhatsApp</option>
                                               <option value="email">Email</option>
                                           </select>
                                           <Input 
                                                placeholder="URL o Usuario..." 
                                                className="h-9"
                                                value={link.url}
                                                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                           />
                                       </div>
                                       <Input
                                            placeholder="Texto del enlace (opcional)"
                                            className="h-8 text-xs"
                                            value={link.label || ''}
                                            onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                                       />
                                   </div>
                                   <div className="flex items-center gap-2 pt-1">
                                       <div className="flex items-center gap-2 mr-2">
                                          <Switch 
                                            checked={link.active}
                                            onCheckedChange={(checked) => updateSocialLink(index, 'active', checked)}
                                          />
                                       </div>
                                       <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => removeSocialLink(index)}
                                       >
                                           <Trash2 className="w-4 h-4" />
                                       </Button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}