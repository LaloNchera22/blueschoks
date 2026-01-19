import { ThemeConfig, DEFAULT_THEME_CONFIG } from "@/lib/types/theme-config";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

// Exportamos la constante tipada para uso externo
export const DEFAULT_THEME = DEFAULT_THEME_CONFIG;

/**
 * Función auxiliar para realizar un Deep Merge seguro.
 * Tipado con genéricos para mantener la seguridad de tipos del target.
 */
function deepMerge<T extends object>(target: T, source: unknown): T {
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  // Usamos un casting intermedio controlado para manipular las propiedades
  const output = { ...target } as Record<string, unknown>;
  const sourceObj = source as Record<string, unknown>;

  Object.keys(sourceObj).forEach(key => {
    const sourceValue = sourceObj[key];
    const targetValue = output[key];

    if (Array.isArray(sourceValue)) {
      // Para arrays, preferimos el valor de la fuente (DB) si existe, reemplazando el default
      output[key] = sourceValue;
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      // Recursión para objetos anidados
      output[key] = deepMerge(targetValue as object, sourceValue);
    } else {
      // Asignación directa para primitivos
      output[key] = sourceValue;
    }
  });

  return output as T;
}

/**
 * getSafeTheme: La función "A prueba de balas".
 * Toma cualquier dato (unknown) que venga de la DB y devuelve un ThemeConfig válido.
 */
export function getSafeTheme(dbConfig: unknown): ThemeConfig {
  try {
    if (!dbConfig) {
      return DEFAULT_THEME;
    }

    // Estrategia de Deep Merge: Defaults + DB Data
    // Esto asegura que propiedades faltantes se rellenen con defaults.
    const merged = deepMerge(DEFAULT_THEME, dbConfig);

    // SANITIZACIÓN FINAL
    // Validamos propiedades críticas que podrían tener valores incorrectos desde la DB
    // (Ej: strings arbitrarios donde se espera una union type)

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

    return merged;

  } catch (error) {
    console.error("CRITICAL: Error sanitizing theme, falling back to defaults", error);
    return DEFAULT_THEME;
  }
}

interface SafeProfileResponse {
  profile: Profile | null;
  config: ThemeConfig;
  error: string | null;
}

/**
 * getSafeProfile: Obtiene perfil y config de forma segura.
 * Nunca lanza error, siempre devuelve una estructura válida y tipada.
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
      console.error("Error fetching profile:", error);
      // Retornamos estructura válida pero indicando error en consola
      return {
        profile: null,
        config: DEFAULT_THEME,
        error: error.message
      };
    }

    // Prioridad: theme_config (nuevo) > design_config (legacy) > null
    // Usamos unknown casting solo para extraer la propiedad si existe, ya que profile es tipado
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
