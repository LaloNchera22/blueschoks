import { createClient } from "@/utils/supabase/server"
import { ThemeConfig } from "@/lib/types/theme-config"

// ---------------------------------------------------------
// 1. CONFIGURACIÓN "PARACAÍDAS" (FUERTEMENTE TIPADA)
// ---------------------------------------------------------
export const DEFAULT_THEME: ThemeConfig = {
  global: {
    // SOLUCIÓN ERROR 1: Forzamos a que sea uno de los valores permitidos
    backgroundType: 'solid' as 'solid' | 'image' | 'gradient', 
    backgroundValue: '#f8fafc'
  },
  header: {
    title: { 
      fontFamily: 'Inter', 
      color: '#1e293b',
      fontSize: '3xl',
      bold: true
    },
    subtitle: { 
      fontFamily: 'Inter', 
      color: '#64748b',
      fontSize: 'lg',
      bold: false
    },
    bio: { 
      fontFamily: 'Inter', 
      color: '#64748b', 
      fontSize: 'sm'
    },
    // SOLUCIÓN ERROR 4: Le decimos que es un array de objetos, no un "never"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socialLinks: [] as any[] 
  },
  cards: {
    style: 'minimal',
    background: '#ffffff',
    border: false,
    productTitle: { 
      color: '#1e293b', 
      fontFamily: 'Inter',
      fontWeight: '600',
      fontSize: 'lg'
    },
    productPrice: { 
      color: '#0f172a', 
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 'xl'
    },
    addButton: {
      bgColor: '#0f172a',
      iconColor: '#ffffff',
      // Forzamos el tipo shape también
      shape: 'rounded' as 'rounded' | 'circle' | 'square'
    },
    quantitySelector: {
      bgColor: '#f8fafc',
      textColor: '#1e293b',
      borderColor: '#e2e8f0'
    }
  }
};

// ---------------------------------------------------------
// 2. UTILIDAD DE FUSIÓN
// ---------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (typeof target !== 'object' || target === null) return source !== undefined ? source : target;

  const result = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = result[key];
    const sourceValue = source[key];

    if (Array.isArray(sourceValue)) {
      result[key] = sourceValue; 
    } else if (typeof targetValue === 'object' && targetValue && typeof sourceValue === 'object' && sourceValue) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }
  return result;
}

// ---------------------------------------------------------
// 3. FUNCIONES EXPORTADAS
// ---------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSafeTheme(dbConfig: any): ThemeConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeConfig = deepMerge(DEFAULT_THEME, dbConfig || {});

  // Asegurar array de socialLinks
  if (safeConfig.header && !Array.isArray(safeConfig.header.socialLinks)) {
    safeConfig.header.socialLinks = [];
  }

  // Casting final para forzar la compatibilidad
  return safeConfig as unknown as ThemeConfig;
}

export const mergeTheme = getSafeTheme;

export async function getSafeProfile(identifier: string) {
  const supabase = await createClient(); 
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', identifier)
    .single();

  if (!profile) {
    return {
      config: DEFAULT_THEME as unknown as ThemeConfig,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile: null as any 
    };
  }

  const config = getSafeTheme(profile.theme_config);

  return { config, profile };
}