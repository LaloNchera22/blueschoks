
import { ThemeConfig, DEFAULT_THEME_CONFIG, SocialLink } from '@/lib/types/theme-config';

/**
 * HELPER: Safe String
 */
const safeString = (val: unknown, fallback: string): string => {
  if (typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  return fallback;
};

/**
 * HELPER: Safe Boolean
 */
const safeBool = (val: unknown, fallback: boolean): boolean => {
  if (typeof val === 'boolean') {
    return val;
  }
  return fallback;
};

/**
 * HELPER: Sanitize Social Links
 * Enforces the Array<{ id, platform, url, active }> structure.
 */
const sanitizeSocialLinks = (rawLinks: any): SocialLink[] => {
  if (!Array.isArray(rawLinks)) {
    return [];
  }

  return rawLinks
    .filter(link => link && typeof link === 'object') // Filter nulls/primitives
    .map(link => ({
      id: safeString(link.id, crypto.randomUUID()),
      platform: safeString(link.platform, 'website'),
      url: safeString(link.url, '#'),
      active: safeBool(link.active, true),
      style: {
        backgroundColor: safeString(link.style?.backgroundColor, '#000000'),
        iconColor: safeString(link.style?.iconColor, '#ffffff'),
        borderRadius: (['full', 'lg', 'md', 'none'].includes(link.style?.borderRadius)
            ? link.style.borderRadius
            : 'full') as 'full' | 'lg' | 'md' | 'none'
      }
    }));
};

/**
 * FACTORY/SANITIZER: sanitizeThemeConfig
 *
 * Recreates the theme configuration from scratch using the provided raw data
 * or defaults. Does NOT trust deep merges.
 */
export function sanitizeThemeConfig(raw: any): ThemeConfig {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_THEME_CONFIG;
  }

  // Defensively access nested objects, defaulting to empty objects if missing
  const header = raw.header || {};
  const cards = raw.cards || {};
  const global = raw.global || {};

  // Construct the Clean Object (Factory Pattern)
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
      socialLinks: sanitizeSocialLinks(header.socialLinks),
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
          : DEFAULT_THEME_CONFIG.cards.addButton.shape) as 'circle' | 'rounded' | 'square',
      },
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
