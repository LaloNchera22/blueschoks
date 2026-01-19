import { createClient } from "@supabase/supabase-js"
import { ThemeConfig } from "@/lib/types/theme-config"
import { DEFAULT_THEME } from "@/lib/theme-defaults"

// Initialize a public client for reading data safely anywhere
// We use the anon key because fetching public profile data (theme) should be accessible.
// For RLS policies that require authenticated user (like dashboard), this works if the policy allows "select" for own user or public.
// However, since we might use this in server components where we can't easily pass the session client without prop drilling,
// using the admin/public client here is a trade-off.
// Ideally, we pass the client, but to keep the signature simple as requested:
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Deep Merge Utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T>(target: T, source: any): T {
  // If target is not an object (primitive), return source if available, else target
  if (typeof target !== 'object' || target === null) {
    return source !== undefined ? source : target;
  }

  // If source is not an object, keep target (safe default)
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  // Clone target to avoid mutation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = result[key];
    const sourceValue = source[key];

    // Handling Arrays: usually we overwrite arrays instead of merging indices
    if (Array.isArray(sourceValue)) {
        result[key] = sourceValue;
    }
    // Recursive merge for objects
    else if (typeof targetValue === 'object' && targetValue !== null && typeof sourceValue === 'object' && sourceValue !== null) {
      result[key] = deepMerge(targetValue, sourceValue);
    }
    // Overwrite primitives
    else {
      result[key] = sourceValue;
    }
  }

  // Second pass: Ensure keys present in target (defaults) but missing in source are preserved (already done by cloning target)
  // But we also need to ensure we didn't lose anything from Default if source had a partial object.
  // The loop above only iterates source keys.
  // Since we started with `result = { ...target }`, we already have the defaults for missing keys.
  // The deep merge logic handles the nested ones.

  return result as T;
}

/**
 * Retrieves a safe, fully populated ThemeConfig for a user.
 * guaranteed to match the ThemeConfig interface and never crash.
 */
export async function getSafeTheme(identifier: string, type: 'id' | 'slug' = 'id') {
  let query = supabase.from('profiles').select('*');

  if (type === 'id') {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('slug', identifier);
  }

  const { data: profile, error } = await query.single();

  if (error || !profile) {
     console.error(`[getSafeTheme] Error fetching profile for ${type}:${identifier}`, error);
     // Fallback: return defaults and null profile
     return { config: DEFAULT_THEME, profile: null };
  }

  // 1. Get raw config
  let rawConfig = profile.theme_config || {};

  // 2. Legacy Migration Support
  // If rawConfig is empty, attempt to populate it from legacy columns
  if (Object.keys(rawConfig).length === 0) {
      const legacyFont = (profile.design_font || 'Inter').split(',')[0].replace(/['"]/g, '').trim();

      rawConfig = {
          global: {
              backgroundValue: profile.design_bg_color
          },
          header: {
              title: {
                  color: profile.design_title_color,
                  fontFamily: legacyFont
              },
              subtitle: {
                  fontFamily: legacyFont
              }
          }
      };
  }

  // 3. Fail-Safe Deep Merge
  // Merges the raw (potentially partial) config ON TOP of the robust DEFAULT_THEME
  const safeConfig = deepMerge<ThemeConfig>(DEFAULT_THEME, rawConfig);

  // Extra Safety: Explicitly ensure arrays are arrays
  if (!Array.isArray(safeConfig.header?.socialLinks)) {
      safeConfig.header.socialLinks = DEFAULT_THEME.header.socialLinks;
  }

  return { config: safeConfig, profile };
}
