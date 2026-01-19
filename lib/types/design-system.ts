export interface LinkItem {
  id: string;
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'website' | 'whatsapp' | 'other';
  url: string;
  label: string;
  active: boolean;
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
}
