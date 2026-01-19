import { ThemeConfig } from "@/lib/types/theme-config";

export const DEFAULT_THEME: ThemeConfig = {
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
    // Legacy fallback
    productName: { fontFamily: 'Inter', color: '#000000' },
    button: { bg: '#000000', text: '#ffffff' }
  },
  global: {
    backgroundType: 'solid',
    backgroundValue: '#f3f4f6'
  }
};
