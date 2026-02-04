import { DesignConfig, LinkItem, CheckoutConfig, CardStyle, TextStyle } from '@/lib/types/design-system';

export const DEFAULT_DESIGN: DesignConfig = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#000000',
    cardBackground: '#f3f4f6',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  profile: {
    displayName: '',
    bio: '',
    avatarUrl: '',
    shopName: '',
    avatarShape: 'circle',
    avatarBorderColor: undefined, // Default to no border or handle null as no border
  },
  socialLinks: [],
  socialStyle: {
    buttonColor: undefined,
    iconColor: undefined,
    textColor: undefined,
    font: undefined,
  },
  checkout: {
    whatsappNumber: '',
    currency: 'MXN',
    showQuantitySelector: true,
    cartButtonText: 'Enviar Pedido',
    buttonStyle: 'floating',
  },
  cardStyle: {
    borderRadius: 12,
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
    priceColor: '#000000',
    titleColor: '#000000',
    shadow: true,
    opacity: 1,
  },
};

export function sanitizeDesign(raw: any, profileFallback?: any): DesignConfig {
  // 1. HARD RESET: If raw is not an object, return default.
  if (!raw || typeof raw !== 'object') {
    return applyProfileFallbacks(DEFAULT_DESIGN, profileFallback);
  }

  // 2. CRITICAL CHECK: socialLinks must be an Array.
  // If not, we consider the data corrupt and reset to default to avoid crashes.
  if (!Array.isArray(raw.socialLinks)) {
    console.warn('DesignSanitizer: socialLinks is not an array. Resetting to default.');
    return applyProfileFallbacks(DEFAULT_DESIGN, profileFallback);
  }

  // 3. Structure seems okay, but we still reconstruct it to ensure no extra garbage
  // and type safety. We map existing fields if they exist, or default if missing.
  const clean: DesignConfig = {
    colors: {
      background: typeof raw.colors?.background === 'string' ? raw.colors.background : DEFAULT_DESIGN.colors.background,
      text: typeof raw.colors?.text === 'string' ? raw.colors.text : DEFAULT_DESIGN.colors.text,
      primary: typeof raw.colors?.primary === 'string' ? raw.colors.primary : DEFAULT_DESIGN.colors.primary,
      cardBackground: typeof raw.colors?.cardBackground === 'string' ? raw.colors.cardBackground : DEFAULT_DESIGN.colors.cardBackground,
    },
    fonts: {
      heading: typeof raw.fonts?.heading === 'string' ? raw.fonts.heading : DEFAULT_DESIGN.fonts.heading,
      body: typeof raw.fonts?.body === 'string' ? raw.fonts.body : DEFAULT_DESIGN.fonts.body,
    },
    profile: {
      displayName: typeof raw.profile?.displayName === 'string' ? raw.profile.displayName : (profileFallback?.shop_name || DEFAULT_DESIGN.profile.displayName),
      bio: typeof raw.profile?.bio === 'string' ? raw.profile.bio : DEFAULT_DESIGN.profile.bio,
      avatarUrl: typeof raw.profile?.avatarUrl === 'string' ? raw.profile.avatarUrl : (profileFallback?.avatar_url || DEFAULT_DESIGN.profile.avatarUrl),
      shopName: typeof raw.profile?.shopName === 'string' ? raw.profile.shopName : (profileFallback?.shop_name || DEFAULT_DESIGN.profile.shopName),
      avatarShape: ['circle', 'rounded', 'square', 'none'].includes(raw.profile?.avatarShape) ? raw.profile.avatarShape : DEFAULT_DESIGN.profile.avatarShape,
      avatarBorderColor: typeof raw.profile?.avatarBorderColor === 'string' ? raw.profile.avatarBorderColor : DEFAULT_DESIGN.profile.avatarBorderColor,
      titleStyle: sanitizeTextStyle(raw.profile?.titleStyle),
      bioStyle: sanitizeTextStyle(raw.profile?.bioStyle),
    },
    socialLinks: raw.socialLinks.map((link: any): LinkItem => ({
      id: typeof link.id === 'string' ? link.id : Math.random().toString(36).substr(2, 9),
      platform: ['instagram', 'tiktok', 'twitter', 'facebook', 'website', 'whatsapp', 'onlyfans', 'telegram', 'email', 'other'].includes(link.platform) ? link.platform : 'website',
      url: typeof link.url === 'string' ? link.url : '',
      label: typeof link.label === 'string' ? link.label : '',
      active: typeof link.active === 'boolean' ? link.active : true,
      color: typeof link.color === 'string' ? link.color : undefined,
    })),
    socialStyle: {
      buttonColor: typeof raw.socialStyle?.buttonColor === 'string' ? raw.socialStyle.buttonColor : DEFAULT_DESIGN.socialStyle?.buttonColor,
      iconColor: typeof raw.socialStyle?.iconColor === 'string' ? raw.socialStyle.iconColor : DEFAULT_DESIGN.socialStyle?.iconColor,
      textColor: typeof raw.socialStyle?.textColor === 'string' ? raw.socialStyle.textColor : DEFAULT_DESIGN.socialStyle?.textColor,
      font: typeof raw.socialStyle?.font === 'string' ? raw.socialStyle.font : DEFAULT_DESIGN.socialStyle?.font,
    },
    checkout: {
      whatsappNumber: typeof raw.checkout?.whatsappNumber === 'string' ? raw.checkout.whatsappNumber : DEFAULT_DESIGN.checkout.whatsappNumber,
      currency: typeof raw.checkout?.currency === 'string' ? raw.checkout.currency : DEFAULT_DESIGN.checkout.currency,
      showQuantitySelector: typeof raw.checkout?.showQuantitySelector === 'boolean' ? raw.checkout.showQuantitySelector : DEFAULT_DESIGN.checkout.showQuantitySelector,
      cartButtonText: typeof raw.checkout?.cartButtonText === 'string' ? raw.checkout.cartButtonText : DEFAULT_DESIGN.checkout.cartButtonText,
      buttonStyle: (['floating', 'fixed'].includes(raw.checkout?.buttonStyle)) ? raw.checkout.buttonStyle : DEFAULT_DESIGN.checkout.buttonStyle,
    },
    cardStyle: {
      borderRadius: typeof raw.cardStyle?.borderRadius === 'number' ? raw.cardStyle.borderRadius : DEFAULT_DESIGN.cardStyle.borderRadius,
      buttonColor: typeof raw.cardStyle?.buttonColor === 'string' ? raw.cardStyle.buttonColor : DEFAULT_DESIGN.cardStyle.buttonColor,
      buttonTextColor: typeof raw.cardStyle?.buttonTextColor === 'string' ? raw.cardStyle.buttonTextColor : DEFAULT_DESIGN.cardStyle.buttonTextColor,
      priceColor: typeof raw.cardStyle?.priceColor === 'string' ? raw.cardStyle.priceColor : DEFAULT_DESIGN.cardStyle.priceColor,
      titleColor: typeof raw.cardStyle?.titleColor === 'string' ? raw.cardStyle.titleColor : DEFAULT_DESIGN.cardStyle.titleColor,
      shadow: typeof raw.cardStyle?.shadow === 'boolean' ? raw.cardStyle.shadow : DEFAULT_DESIGN.cardStyle.shadow,
      opacity: typeof raw.cardStyle?.opacity === 'number' ? raw.cardStyle.opacity : DEFAULT_DESIGN.cardStyle.opacity,
    }
  };

  return clean;
}

function applyProfileFallbacks(config: DesignConfig, profile: any): DesignConfig {
  if (!profile) return config;

  return {
    ...config,
    profile: {
      ...config.profile,
      displayName: config.profile.displayName || profile.shop_name || '',
      shopName: config.profile.shopName || profile.shop_name || '',
      avatarUrl: config.profile.avatarUrl || profile.avatar_url || '',
    }
  };
}

function sanitizeTextStyle(raw: any): TextStyle | undefined {
  if (!raw || typeof raw !== 'object') return undefined;

  return {
    fontFamily: typeof raw.fontFamily === 'string' ? raw.fontFamily : undefined,
    bold: typeof raw.bold === 'boolean' ? raw.bold : undefined,
    italic: typeof raw.italic === 'boolean' ? raw.italic : undefined,
    align: ['left', 'center', 'right'].includes(raw.align) ? raw.align : undefined,
    color: typeof raw.color === 'string' ? raw.color : undefined,
    size: typeof raw.size === 'number' ? raw.size : undefined,
  };
}
