import { ThemeConfig, DEFAULT_THEME_CONFIG, SocialLink } from "@/lib/types/theme-config";
import { Database } from "@/utils/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * HELPER: Safe String
 * Returns the value if it's a non-empty string, otherwise returns fallback.
 */
const safeString = (val: unknown, fallback: string): string => {
  if (typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  return fallback;
};

/**
 * HELPER: Safe Boolean
 * Returns the value if it's a boolean, otherwise returns fallback.
 */
const safeBool = (val: unknown, fallback: boolean): boolean => {
  if (typeof val === 'boolean') {
    return val;
  }
  return fallback;
};

/**
 * ADAPTER: normalizeTheme
 *
 * Transforms any raw input (Supabase JSON, Legacy Config, null) into a strict ThemeConfig object.
 * This acts as a firewall for the frontend.
 */
export function normalizeTheme(raw: any): ThemeConfig {
  // 1. Fallback to Default if null
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_THEME_CONFIG;
  }

  // 2. Strict Construction - Property by Property
  // We do NOT use spread operators (...) to avoid polluting the object with ghost keys.

  const header = raw.header || {};
  const cards = raw.cards || {};
  const global = raw.global || {};

  // Legacy Mapping Check
  // If 'btn_shape' exists at root or inside cards, we map it to addButton.shape
  let legacyBtnShape = raw.btn_shape || cards.btn_shape;
  if (legacyBtnShape && !['circle', 'rounded', 'square'].includes(legacyBtnShape)) {
    legacyBtnShape = 'circle'; // Fallback for invalid legacy value
  }

  return {
    header: {
      title: {
        fontFamily: safeString(header.title?.fontFamily, DEFAULT_THEME_CONFIG.header.title.fontFamily),
        color: safeString(header.title?.color, DEFAULT_THEME_CONFIG.header.title.color),
        fontSize: safeString(header.title?.fontSize, DEFAULT_THEME_CONFIG.header.title.fontSize),
        bold: safeBool(header.title?.bold, DEFAULT_THEME_CONFIG.header.title.bold),
      },
      subtitle: {
        fontFamily: safeString(header.subtitle?.fontFamily, DEFAULT_THEME_CONFIG.header.subtitle.fontFamily),
        color: safeString(header.subtitle?.color, DEFAULT_THEME_CONFIG.header.subtitle.color),
        fontSize: safeString(header.subtitle?.fontSize, DEFAULT_THEME_CONFIG.header.subtitle.fontSize),
        bold: safeBool(header.subtitle?.bold, DEFAULT_THEME_CONFIG.header.subtitle.bold),
      },
      bio: {
        fontFamily: safeString(header.bio?.fontFamily, DEFAULT_THEME_CONFIG.header.bio.fontFamily),
        color: safeString(header.bio?.color, DEFAULT_THEME_CONFIG.header.bio.color),
        fontSize: safeString(header.bio?.fontSize, DEFAULT_THEME_CONFIG.header.bio.fontSize),
      },
      socialLinks: Array.isArray(header.socialLinks)
        ? header.socialLinks.map((link: any) => ({
            id: safeString(link.id, Math.random().toString(36).substr(2, 9)),
            platform: safeString(link.platform, 'website'),
            url: safeString(link.url, '#'),
            style: {
              backgroundColor: safeString(link.style?.backgroundColor, '#000000'),
              iconColor: safeString(link.style?.iconColor, '#ffffff'),
              borderRadius: safeString(link.style?.borderRadius, 'full')
            }
          } as SocialLink))
        : []
    },
    cards: {
      background: safeString(cards.background, DEFAULT_THEME_CONFIG.cards.background),
      border: safeBool(cards.border, DEFAULT_THEME_CONFIG.cards.border),
      productTitle: {
        color: safeString(cards.productTitle?.color, DEFAULT_THEME_CONFIG.cards.productTitle.color),
        fontFamily: safeString(cards.productTitle?.fontFamily, DEFAULT_THEME_CONFIG.cards.productTitle.fontFamily),
        fontWeight: safeString(cards.productTitle?.fontWeight, DEFAULT_THEME_CONFIG.cards.productTitle.fontWeight),
      },
      productPrice: {
        color: safeString(cards.productPrice?.color, DEFAULT_THEME_CONFIG.cards.productPrice.color),
        fontFamily: safeString(cards.productPrice?.fontFamily, DEFAULT_THEME_CONFIG.cards.productPrice.fontFamily),
      },
      quantitySelector: {
        bgColor: safeString(cards.quantitySelector?.bgColor, DEFAULT_THEME_CONFIG.cards.quantitySelector.bgColor),
        textColor: safeString(cards.quantitySelector?.textColor, DEFAULT_THEME_CONFIG.cards.quantitySelector.textColor),
        borderColor: safeString(cards.quantitySelector?.borderColor, DEFAULT_THEME_CONFIG.cards.quantitySelector.borderColor),
      },
      addButton: {
        bgColor: safeString(cards.addButton?.bgColor, DEFAULT_THEME_CONFIG.cards.addButton.bgColor),
        iconColor: safeString(cards.addButton?.iconColor, DEFAULT_THEME_CONFIG.cards.addButton.iconColor),
        shape: (['circle', 'rounded', 'square'].includes(cards.addButton?.shape)
          ? cards.addButton.shape
          : (legacyBtnShape || DEFAULT_THEME_CONFIG.cards.addButton.shape)) as 'circle' | 'rounded' | 'square',
      },
      // Optional/Legacy preservation
      productName: cards.productName ? {
        fontFamily: safeString(cards.productName.fontFamily, 'Inter'),
        color: safeString(cards.productName.color, '#000000')
      } : undefined,
      button: cards.button ? {
        bg: safeString(cards.button.bg, '#000000'),
        text: safeString(cards.button.text, '#ffffff')
      } : undefined
    },
    global: {
      backgroundType: (['solid', 'image', 'gradient'].includes(global.backgroundType)
        ? global.backgroundType
        : DEFAULT_THEME_CONFIG.global.backgroundType) as 'solid' | 'image' | 'gradient',
      backgroundValue: safeString(global.backgroundValue, DEFAULT_THEME_CONFIG.global.backgroundValue),
    }
  };
}

/**
 * ADAPTER: normalizeProfile
 *
 * Ensures the profile object is safe for the client, generating slugs if missing.
 */
export function normalizeProfile(raw: any): Profile {
  const dummyId = 'unknown-user';

  // 1. Base Construction
  const profile: Profile = {
    id: safeString(raw?.id, dummyId),
    updated_at: raw?.updated_at || new Date().toISOString(),
    shop_name: safeString(raw?.shop_name, 'Mi Tienda'),
    username: safeString(raw?.username, 'usuario'),
    whatsapp: raw?.whatsapp || null,
    is_pro: !!raw?.is_pro,
    slug: raw?.slug || null, // Will attempt to fix below
    email: raw?.email || null,
    avatar_url: raw?.avatar_url || null,
    // Legacy/Design fields - pass through nulls is fine, but we can default if needed
    design_bg_color: raw?.design_bg_color || null,
    design_title_text: raw?.design_title_text || null,
    design_subtitle_text: raw?.design_subtitle_text || null,
    design_title_color: raw?.design_title_color || null,
    design_font: raw?.design_font || null,
    design_card_style: raw?.design_card_style || null,
    design_config: raw?.design_config || null,
    // IMPORTANT: Normalizing the nested theme config
    theme_config: normalizeTheme(raw?.theme_config || raw?.design_config)
  };

  // 2. Critical Field Repair: Slug
  if (!profile.slug) {
    if (profile.username && profile.username !== 'usuario') {
      profile.slug = profile.username;
    } else if (profile.email) {
      profile.slug = profile.email.split('@')[0];
    } else {
      profile.slug = profile.id;
    }
  }

  // 3. Critical Field Repair: Shop Name
  if (profile.shop_name === 'Mi Tienda' && profile.slug) {
    // Attempt to make a better name from slug
    profile.shop_name = profile.slug.charAt(0).toUpperCase() + profile.slug.slice(1).replace(/-/g, ' ');
  }

  return profile;
}
