export interface LinkItem {
  id: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'website' | 'whatsapp' | 'other';
  url: string;
  label: string;
  active: boolean;
}

export interface CheckoutConfig {
  whatsappNumber: string; // Number orders are sent to
  currency: string; // e.g. "MXN", "USD"
  showQuantitySelector: boolean; // Toggle for (- 1 +) in card
  cartButtonText: string; // e.g. "Enviar Pedido"
  buttonStyle: 'floating' | 'fixed'; // Cart button style
}

export interface DesignConfig {
  colors: {
    background: string;
    text: string;
    primary: string;
    cardBackground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  profile: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    shopName?: string;
  };
  socialLinks: LinkItem[];
  checkout: CheckoutConfig;
}
