import { ThemeConfig } from "@/lib/types/theme-config";
import { DEFAULT_THEME } from "@/lib/theme-defaults";
import { createAdminClient } from "@/utils/supabase/server";

/**
 * Deep merges the source object into the target object (defensively).
 * Ensure that if a property exists in target (default) but is missing/undefined in source,
 * the target value is kept.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T>(target: T, source: any): T {
  // If source is null or undefined, return target (defaults)
  if (source === null || source === undefined) {
    return target;
  }

  // If target is primitive, return source if available (and valid type), else target
  if (typeof target !== 'object' || target === null) {
    return source !== undefined ? source : target;
  }

  // If source is not an object (and target is), we can't merge, so keep target to be safe?
  if (typeof source !== 'object') {
    return target;
  }

  // Clone target
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = result[key];
    const sourceValue = source[key];

    // Arrays: overwrite or merge? Typically overwrite configuration arrays (like social links).
    if (Array.isArray(sourceValue)) {
      result[key] = sourceValue;
    }
    // Objects: recursive merge
    else if (
      typeof targetValue === 'object' && targetValue !== null &&
      typeof sourceValue === 'object' && sourceValue !== null
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    }
    // Primitives: overwrite
    else {
      if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result as T;
}

/**
 * Merges a raw database configuration with the DEFAULT_THEME.
 * Handles nulls, partial objects, and legacy fields if needed.
 * This is the "Bulletproof" utility requested.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSafeTheme(dbConfig: any, legacyProfileData?: any): ThemeConfig {
  let rawConfig = dbConfig || {};

  // Legacy Migration: If config is empty but we have legacy profile data
  if (Object.keys(rawConfig).length === 0 && legacyProfileData) {
     const legacyFont = (legacyProfileData.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim();
     rawConfig = {
         global: {
             backgroundValue: legacyProfileData.design_bg_color
         },
         header: {
             title: {
                 color: legacyProfileData.design_title_color,
                 fontFamily: legacyFont
             },
             subtitle: {
                 fontFamily: legacyFont
             }
         }
     };
  }

  // Deep merge on top of defaults
  const safeConfig = deepMerge<ThemeConfig>(DEFAULT_THEME, rawConfig);

  // Extra safeguards for arrays
  if (!Array.isArray(safeConfig.header?.socialLinks)) {
    safeConfig.header.socialLinks = [];
  }

  return safeConfig;
}

// Alias for compatibility if needed, but we prefer getSafeTheme
export const mergeTheme = getSafeTheme;

/**
 * Helper to get the profile and a safe theme config.
 */
export async function getSafeProfile(identifier: string, type: 'id' | 'slug' = 'id') {
  const supabase = await createAdminClient();
  let query = supabase.from('profiles').select('*');

  if (type === 'id') {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('slug', identifier);
  }

  const { data: profile, error } = await query.single();

  if (error || !profile) {
    console.error(`[getSafeProfile] Error fetching profile for ${type}:${identifier}`, error);
    return {
      config: DEFAULT_THEME,
      profile: null
    };
  }

  const config = getSafeTheme(profile.theme_config, profile);

  return { config, profile };
}
