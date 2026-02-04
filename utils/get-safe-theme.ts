import { ThemeConfig } from "@/lib/types/theme-config";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

// 1. CLEAN SOURCE OF TRUTH (DEFAULT_THEME)
// Strict adherence to ThemeConfig interface. No ghost properties.
export const DEFAULT_THEME: ThemeConfig = {
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
      fontFamily: 'Roboto',
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
      shape: 'circle' as const // Literal strictness
    },
    // Optional/Legacy fields allowed by interface
    productName: { fontFamily: 'Inter', color: '#000000' },
    button: { bg: '#000000', text: '#ffffff' }
  },
  global: {
    backgroundType: 'solid' as const, // Literal strictness
    backgroundValue: '#f3f4f6'
  }
};

type Profile = Database['public']['Tables']['profiles']['Row'];

// 2. BULLETPROOF DUMMY PROFILE
// Used when Supabase fails or user has no profile, ensuring UI never crashes.
export const DUMMY_PROFILE: Profile = {
  id: "dummy-user-fallback",
  updated_at: new Date().toISOString(),
  shop_name: "Tienda Demo",
  username: "tienda_demo",
  whatsapp: null,
  is_pro: false,
  subscription_end_date: null,
  slug: "tienda-demo",
  email: "demo@example.com",
  avatar_url: null,
  design_bg_color: null,
  design_title_text: null,
  design_subtitle_text: null,
  design_title_color: null,
  design_font: null,
  design_card_style: null,
  design_config: null,
  theme_config: DEFAULT_THEME as any
};

// 3. DEFENSIVE MERGE UTILS
function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return target;
  }

  const output = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
}

/**
 * getSafeTheme: The Firewall Function.
 * Accepts ANYTHING and returns a valid ThemeConfig.
 */
export function getSafeTheme(dbConfig: any): ThemeConfig {
  try {
    // 1. If null or garbage, return default
    if (!dbConfig || typeof dbConfig !== 'object') {
      return DEFAULT_THEME;
    }

    // 2. Defensive Deep Merge
    const merged = deepMerge(DEFAULT_THEME, dbConfig);

    // 3. Specific Sanitization for Literals (Union Types)
    const validShapes = ['circle', 'rounded', 'square'];
    if (merged.cards?.addButton?.shape && !validShapes.includes(merged.cards.addButton.shape)) {
        merged.cards.addButton.shape = 'circle';
    }

    const validBgTypes = ['solid', 'image', 'gradient'];
    if (merged.global?.backgroundType && !validBgTypes.includes(merged.global.backgroundType)) {
        merged.global.backgroundType = 'solid';
    }

    // 4. Final Double Casting to silence TypeScript and ensure compatibility
    return merged as unknown as ThemeConfig;

  } catch (error) {
    console.error("FIREWALL: Error sanitizing theme. Fallback to default.", error);
    return DEFAULT_THEME;
  }
}

interface SafeProfileResponse {
  profile: Profile;
  config: ThemeConfig;
  error: string | null;
}

/**
 * getSafeProfile: Secure Profile + Config Fetching.
 * GUARANTEE: Never returns profile: null. If it fails, returns DUMMY_PROFILE.
 */
export async function getSafeProfile(userId: string): Promise<SafeProfileResponse> {
  const supabase = await createClient();

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.warn("getSafeProfile Warning:", error?.message || "Profile not found");
      return {
        profile: DUMMY_PROFILE,
        config: DEFAULT_THEME,
        error: error?.message || "Profile not found"
      };
    }

    // Priority: theme_config > design_config
    const rawConfig = profile.theme_config || profile.design_config;

    return {
      profile: profile,
      config: getSafeTheme(rawConfig),
      error: null
    };

  } catch (e) {
    console.error("getSafeProfile CRITICAL FAILURE:", e);
    return {
      profile: DUMMY_PROFILE,
      config: DEFAULT_THEME,
      error: "Critical failure in profile fetch"
    };
  }
}
