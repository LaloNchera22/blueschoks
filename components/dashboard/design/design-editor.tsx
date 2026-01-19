'use client';

import React, { useState, useEffect } from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { saveThemeConfig } from '@/app/dashboard/actions/design-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  LayoutTemplate,
  IdCard,
  Share2,
  Save,
  Loader2,
  Palette,
  Type
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
  { id: 'socials', label: 'Redes Sociales', icon: Share2, description: 'Gestión de enlaces sociales.' },
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
        // Ensure structure exists
        if (!current[key]) current[key] = {};
        // Shallow copy for immutability at this level
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
      <div className="w-64 border-r bg-white h-full flex flex-col shadow-sm">
        <div className="p-6 border-b">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            Diseño
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Personaliza tu tienda</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <Button
                key={section.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600'}`}
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
            className="w-full gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {/* RIGHT CONTENT - SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </h1>
            <p className="text-gray-500">
              {SECTIONS.find(s => s.id === activeSection)?.description}
            </p>
          </div>

          <Card className="border-none shadow-md">
            <CardContent className="p-6 space-y-6">

              {/* === GLOBAL SECTION === */}
              {activeSection === 'global' && (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="bg-color">Color de Fondo</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border shadow-sm overflow-hidden flex-shrink-0">
                        <input
                          id="bg-color"
                          type="color"
                          className="h-[120%] w-[120%] -m-[10%] cursor-pointer"
                          value={config.colors.background}
                          onChange={(e) => updateConfig(['colors', 'background'], e.target.value)}
                        />
                      </div>
                      <Input
                        value={config.colors.background}
                        onChange={(e) => updateConfig(['colors', 'background'], e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="text-color">Color de Texto Principal</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border shadow-sm overflow-hidden flex-shrink-0">
                        <input
                          id="text-color"
                          type="color"
                          className="h-[120%] w-[120%] -m-[10%] cursor-pointer"
                          value={config.colors.text}
                          onChange={(e) => updateConfig(['colors', 'text'], e.target.value)}
                        />
                      </div>
                      <Input
                        value={config.colors.text}
                        onChange={(e) => updateConfig(['colors', 'text'], e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Tipografía Global</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50 text-sm text-gray-500">
                      <Type className="w-4 h-4" />
                      <span>{config.fonts.body}</span>
                      {/* Placeholder selector */}
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
                      placeholder="Describe tu tienda..."
                      className="resize-none"
                      rows={4}
                      value={config.profile.bio || ''}
                      onChange={(e) => updateConfig(['profile', 'bio'], e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="avatar">URL del Avatar</Label>
                    <div className="flex gap-4 items-start">
                      {config.profile.avatarUrl && (
                        <img
                          src={config.profile.avatarUrl}
                          alt="Preview"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      )}
                      <Input
                        id="avatar"
                        placeholder="https://..."
                        value={config.profile.avatarUrl || ''}
                        onChange={(e) => updateConfig(['profile', 'avatarUrl'], e.target.value)}
                      />
                    </div>
                  </div>

                   <div className="grid gap-2">
                    <Label>Tipografía de Títulos</Label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50 text-sm text-gray-500">
                      <Type className="w-4 h-4" />
                      <span>{config.fonts.heading}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* === CARDS SECTION === */}
              {activeSection === 'cards' && (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="card-bg">Fondo de Tarjeta</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border shadow-sm overflow-hidden flex-shrink-0">
                        <input
                          id="card-bg"
                          type="color"
                          className="h-[120%] w-[120%] -m-[10%] cursor-pointer"
                          value={config.colors.cardBackground}
                          onChange={(e) => updateConfig(['colors', 'cardBackground'], e.target.value)}
                        />
                      </div>
                      <Input
                        value={config.colors.cardBackground}
                        onChange={(e) => updateConfig(['colors', 'cardBackground'], e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="primary-color">Color Primario (Botones/Acentos)</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border shadow-sm overflow-hidden flex-shrink-0">
                        <input
                          id="primary-color"
                          type="color"
                          className="h-[120%] w-[120%] -m-[10%] cursor-pointer"
                          value={config.colors.primary}
                          onChange={(e) => updateConfig(['colors', 'primary'], e.target.value)}
                        />
                      </div>
                      <Input
                        value={config.colors.primary}
                        onChange={(e) => updateConfig(['colors', 'primary'], e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === SOCIALS SECTION (SAFE VIEW) === */}
              {activeSection === 'socials' && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                    Modo seguro activado: Visualización de datos crudos para prevenir errores.
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-md bg-slate-950 text-slate-50 text-xs overflow-x-auto font-mono border">
                      {JSON.stringify(config.socialLinks, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
