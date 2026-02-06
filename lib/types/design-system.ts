export interface LinkItem {
  id: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'website' | 'whatsapp' | 'telegram' | 'onlyfans' | 'other';
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
  borderRadius: number | string;
  buttonColor: string;
  buttonTextColor: string;
  buttonIconColor?: string;
  priceColor: string;
  titleColor: string;
  titleFont?: string;
  priceFont?: string;
  shadow?: boolean;
  opacity?: number;
}

export interface ProductStyle {
  cardBackground?: string;
  descriptionBackground?: string;
  footerBackground?: string;
  titleFont?: string;
  priceFont?: string;
  titleColor?: string;
  priceColor?: string;
  cartBtnBackground?: string;
  cartBtnColor?: string;
  cartBtnIconColor?: string;
  borderColor?: string;
  imageShape?: 'square' | 'rounded';
}

export interface TextStyle {
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  uppercase?: boolean;
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

export interface SocialStyle {
  buttonColor?: string;
  iconColor?: string;
  textColor?: string;
  font?: string;
}

export interface DesignConfig {
  borderRadius?: string | number;
  backgroundImage?: string;
  backgroundOpacity?: number;
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
  socialStyle?: SocialStyle;
  checkout: CheckoutConfig;
  cardStyle: CardStyle;
}
