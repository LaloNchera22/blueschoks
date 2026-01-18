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
    };
    cards: {
      background: string;
      border: boolean;
      productName: {
        fontFamily: string;
        color: string;
      };
      productPrice: {
        fontFamily: string;
        color: string;
        weight: string; // 'normal', 'bold', 'black'
      };
      button: {
        bg: string;
        text: string;
      };
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
      bio: { fontFamily: 'Roboto', color: '#666666', fontSize: 'sm' }
    },
    cards: {
      background: '#ffffff',
      border: true,
      productName: { fontFamily: 'Inter', color: '#000000' },
      productPrice: { fontFamily: 'Inter', color: '#000000', weight: 'bold' },
      button: { bg: '#000000', text: '#ffffff' }
    },
    global: {
      backgroundType: 'solid',
      backgroundValue: '#f3f4f6'
    }
  };
