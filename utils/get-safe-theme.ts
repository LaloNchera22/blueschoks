import { ThemeConfig } from "@/lib/types/theme-config";
import { createClient } from "@/utils/supabase/server";

// 1. DEFINICIÓN ROBUSTA DE DEFAULTS (Cumpliendo estrictamente ThemeConfig)
// Usamos 'as const' para asegurar que los literales coincidan con los tipos union
const DEFAULT_THEME_VALUES = {
  header: {
    title: {
      fontFamily: 'Inter',
      color: '#000000',
      fontSize: '2xl',
      bold: true
    },
    subtitle: {
      fontFamily: 'Inter',
      color: '#666666',
      fontSize: 'lg',
      bold: false
    },
    bio: {
      fontFamily: 'Inter',
      color: '#666666',
      fontSize: 'sm'
    },
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
      shape: 'circle' as 'circle' | 'rounded' | 'square'
    },
    // Fallbacks para compatibilidad
    productName: { fontFamily: 'Inter', color: '#000000' },
    button: { bg: '#000000', text: '#ffffff' }
  },
  global: {
    backgroundType: 'solid' as 'solid' | 'image' | 'gradient',
    backgroundValue: '#f3f4f6'
  }
};

// Exportamos la constante tipada para uso externo si es necesario
export const DEFAULT_THEME: ThemeConfig = DEFAULT_THEME_VALUES as unknown as ThemeConfig;

/**
 * Función auxiliar para realizar un Deep Merge seguro.
 * Esto asegura que si el DB tiene un objeto parcial, no perdamos los defaults hermanos.
 */
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) {
    return source ?? target;
  }

  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (Array.isArray(sourceValue)) {
      // Para arrays, preferimos el valor de la fuente (DB) si existe, reemplazando el default
      output[key] = sourceValue;
    } else if (typeof sourceValue === 'object' && sourceValue !== null && targetValue) {
      // Recursión para objetos anidados
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Asignación directa para primitivos
      output[key] = sourceValue;
    }
  });

  return output;
}

/**
 * getSafeTheme: La función "A prueba de balas".
 * Toma cualquier basura que venga de la DB y devuelve un ThemeConfig válido.
 */
export function getSafeTheme(dbConfig: any): ThemeConfig {
  try {
    if (!dbConfig) {
      return DEFAULT_THEME;
    }

    // Estrategia de Deep Merge: Defaults + DB Data
    // Esto asegura que propiedades faltantes se rellenen con defaults.
    const merged = deepMerge(DEFAULT_THEME_VALUES, dbConfig);

    // SANITIZACIÓN FINAL Y DOUBLE CASTING
    // 1. Aseguramos que propiedades críticas tengan valores válidos si el merge falló sutilmente
    //    (Ej: shape inválido string en DB)

    // Validación de shape
    const validShapes = ['circle', 'rounded', 'square'];
    if (merged.cards?.addButton?.shape && !validShapes.includes(merged.cards.addButton.shape)) {
        merged.cards.addButton.shape = 'circle';
    }

    // Validación de backgroundType
    const validBgTypes = ['solid', 'image', 'gradient'];
    if (merged.global?.backgroundType && !validBgTypes.includes(merged.global.backgroundType)) {
        merged.global.backgroundType = 'solid';
    }

    // DOUBLE CASTING: La magia para calmar a TypeScript
    // Le decimos: "Confía en mí, esto es un ThemeConfig"
    return merged as unknown as ThemeConfig;

  } catch (error) {
    console.error("CRITICAL: Error sanitizing theme, falling back to defaults", error);
    return DEFAULT_THEME;
  }
}

/**
 * getSafeProfile: Obtiene perfil y config de forma segura.
 * Nunca lanza error, siempre devuelve una estructura válida.
 */
export async function getSafeProfile(userId: string) {
  const supabase = await createClient();

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      // Retornamos estructura dummy válida pero indicando error en consola
      return {
        profile: null,
        config: DEFAULT_THEME,
        error: error.message
      };
    }

    // Prioridad: theme_config (nuevo) > design_config (legacy) > null
    const rawConfig = profile.theme_config || profile.design_config;

    return {
      profile,
      config: getSafeTheme(rawConfig),
      error: null
    };

  } catch (e) {
    console.error("Unexpected crash in getSafeProfile:", e);
    return {
      profile: null,
      config: DEFAULT_THEME,
      error: "Unexpected error"
    };
  }
}
