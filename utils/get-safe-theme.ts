import { ThemeConfig } from "@/lib/types/theme-config";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

// 1. Definición de la Fuente de la Verdad (DEFAULT_THEME)
// Copia exacta y tipada para asegurar integridad sin depender de archivos externos
export const DEFAULT_THEME: ThemeConfig = {
  header: {
    title: { fontFamily: 'Inter', color: '#000000', fontSize: '2xl', bold: true },
    subtitle: { fontFamily: 'Inter', color: '#666666', fontSize: 'lg', bold: false },
    bio: { fontFamily: 'Roboto', color: '#666666', fontSize: 'sm' },
    socialLinks: []
  },
  cards: {
    background: '#ffffff',
    border: true,
    productTitle: {
      color: '#000000',
      fontFamily: 'Inter',
      fontWeight: 'bold'
    },
    productPrice: {
      color: '#000000',
      fontFamily: 'Inter'
    },
    quantitySelector: {
      bgColor: '#f3f4f6',
      textColor: '#111827',
      borderColor: 'transparent'
    },
    addButton: {
      bgColor: '#000000',
      iconColor: '#ffffff',
      shape: 'circle' // Literal exacto
    },
    // Legacy fallbacks requeridos por la interfaz
    productName: { fontFamily: 'Inter', color: '#000000' },
    button: { bg: '#000000', text: '#ffffff' }
  },
  global: {
    backgroundType: 'solid', // Literal exacto
    backgroundValue: '#f3f4f6'
  }
};

/**
 * Función auxiliar para realizar un Deep Merge seguro.
 */
function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (Array.isArray(sourceValue)) {
      // Para arrays (ej: socialLinks), preferimos la fuente si es válida
      output[key] = sourceValue;
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Recursión solo si ambos son objetos
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Primitivos
      output[key] = sourceValue;
    }
  });

  return output;
}

/**
 * getSafeTheme: La función Firewall.
 * Recibe CUALQUIER COSA y devuelve un ThemeConfig válido.
 */
export function getSafeTheme(dbConfig: any): ThemeConfig {
  try {
    // 1. Si es nulo o basura, devolver default
    if (!dbConfig || typeof dbConfig !== 'object') {
      return DEFAULT_THEME;
    }

    // 2. Deep Merge defensivo
    const merged = deepMerge(DEFAULT_THEME, dbConfig);

    // 3. Sanitización específica de Literales (Union Types)
    // Esto es crucial para evitar crasheos en componentes que esperan 'circle' | 'rounded' | 'square'
    const validShapes = ['circle', 'rounded', 'square'];
    if (merged.cards?.addButton?.shape && !validShapes.includes(merged.cards.addButton.shape)) {
        merged.cards.addButton.shape = 'circle';
    }

    const validBgTypes = ['solid', 'image', 'gradient'];
    if (merged.global?.backgroundType && !validBgTypes.includes(merged.global.backgroundType)) {
        merged.global.backgroundType = 'solid';
    }

    // 4. Double Casting final para silenciar TypeScript y asegurar compatibilidad
    return merged as unknown as ThemeConfig;

  } catch (error) {
    console.error("FIREWALL: Error sanitizing theme. Fallback to default.", error);
    return DEFAULT_THEME;
  }
}

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SafeProfileResponse {
  profile: Profile | null;
  config: ThemeConfig;
  error: string | null;
}

/**
 * getSafeProfile: Obtención segura de perfil + config.
 */
export async function getSafeProfile(userId: string): Promise<SafeProfileResponse> {
  const supabase = await createClient();

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("getSafeProfile Error:", error.message);
      return {
        profile: null,
        config: DEFAULT_THEME,
        error: error.message
      };
    }

    // Prioridad: theme_config > design_config
    const rawConfig = profile.theme_config || profile.design_config;

    return {
      profile: profile, // Supabase devuelve el tipo correcto
      config: getSafeTheme(rawConfig),
      error: null
    };

  } catch (e) {
    console.error("getSafeProfile CRITICAL FAILURE:", e);
    return {
      profile: null,
      config: DEFAULT_THEME,
      error: "Critical failure in profile fetch"
    };
  }
}
