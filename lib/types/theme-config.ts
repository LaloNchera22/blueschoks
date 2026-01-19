export interface SocialLink {
  id: string;
  platform: 'whatsapp' | 'telegram' | 'instagram' | 'x' | 'facebook' | 'threads' | 'tiktok' | 'youtube' | 'linkedin' | 'website' | 'email';
  url: string;
  style: {
    backgroundColor: string;
    iconColor: string;
    borderRadius: 'full' | 'lg' | 'md' | 'none';
  }
}

export interface ThemeConfig {
    header: {
      title: {
        fontFamily: string;
        color: string;
        fontSize: string; // 'sm', 'base', 'lg', 'xl', '2xl', etc.
        bold: boolean;
      };
      subtitle: {
        fontFamily: string;
        color: string;
        fontSize: string;
        bold: boolean;
      };
      bio: {
        fontFamily: string;
        color: string;
        fontSize: string;
      };
      socialLinks: SocialLink[];
    };
    cards: {
      background: string;
      border: boolean;
      productTitle: {
        color: string;
        fontFamily: string;
        fontWeight: string; // 'normal', 'bold', 'black'
      };
      productPrice: {
        color: string;
        fontFamily: string;
      };
      quantitySelector: {
        bgColor: string;
        textColor: string;
        borderColor: string;
      };
      addButton: {
        bgColor: string;
        iconColor: string;
        shape: 'circle' | 'rounded' | 'square';
      };
      // Legacy fallback (optional, keeping to avoid breaking if referenced elsewhere briefly)
      productName?: { fontFamily: string; color: string };
      button?: { bg: string; text: string };
    };
    global: {
      backgroundType: 'solid' | 'image' | 'gradient';
      backgroundValue: string; // Hex color or URL
    };
  }

  export const DEFAULT_THEME_CONFIG: ThemeConfig = {
    header: {
      title: { fontFamily: 'Inter', color: '#000000', fontSize: '2xl', bold: true },
      subtitle: { fontFamily: 'Inter', color: '#666666', fontSize: 'lg', bold: false },
      bio: { fontFamily: 'Roboto', color: '#666666', fontSize: 'sm' },
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
        shape: 'circle'
      },
      // Keep legacy for safety during migration
      productName: { fontFamily: 'Inter', color: '#000000' },
      button: { bg: '#000000', text: '#ffffff' }
    },
    global: {
      backgroundType: 'solid',
      backgroundValue: '#f3f4f6'
    }
  };
