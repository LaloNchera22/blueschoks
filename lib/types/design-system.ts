export interface LinkItem {
  id: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'website' | 'whatsapp' | 'other';
  url: string;
  label: string;
  active: boolean;
  color?: string;
}

export interface CheckoutConfig {
  whatsappNumber: string; // Number orders are sent to
  currency: string; // e.g. "MXN", "USD"
  showQuantitySelector: boolean; // Toggle for (- 1 +) in card
  cartButtonText: string; // e.g. "Enviar Pedido"
  buttonStyle: 'floating' | 'fixed'; // Cart button style
}

export interface CardStyle {
  borderRadius: number;
  buttonColor: string;
  buttonTextColor: string;
  priceColor: string;
  titleColor: string;
}

export interface TextStyle {
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  color?: string;
  size?: number;
}

export interface ProfileConfig {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  shopName?: string;
  avatarShape?: 'circle' | 'rounded' | 'square' | 'none';
  avatarBorderColor?: string;
  titleStyle?: TextStyle;
  bioStyle?: TextStyle;
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
  profile: ProfileConfig;
  socialLinks: LinkItem[];
  checkout: CheckoutConfig;
  cardStyle: CardStyle;
}
