import { DesignConfig, ProductStyle } from '@/lib/types/design-system';
import { Database } from '@/utils/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

export const GOOGLE_FONTS_LIST = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway", "Merriweather",
  "Nunito", "Playfair Display", "Rubik", "Poppins", "Lobster", "Pacifico", "Dancing Script",
  "Abril Fatface", "Bebas Neue", "Anton", "Gloria Hallelujah", "Indie Flower", "Titan One",
  "Inter", "Roboto Condensed", "Slabo 27px", "Source Sans Pro", "PT Sans", "Noto Sans",
  "Ubuntu", "Roboto Slab", "PT Serif", "Arimo", "Bitter", "Muli", "Dosis", "Josefin Sans",
  "Oxygen", "Cabin", "Inconsolata", "Fira Sans", "Crimson Text", "Asap", "Quicksand",
  "Karla", "Hind", "Barlow", "Maven Pro", "Vollkorn", "Bree Serif", "Comfortaa", "Exo 2",
  "Righteous", "Fredoka One", "Permanent Marker", "Shadows Into Light", "Amatic SC",
  "Cinzel", "Courgette", "Great Vibes", "Sacramento", "Satisfy", "Yellowtail"
];

export const loadGoogleFont = (fontName: string) => {
  if (!fontName) return;
  // Normalize font name for ID (remove spaces)
  const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;

  // Check if already exists
  if (document.getElementById(linkId)) return;

  // Create link
  const link = document.createElement('link');
  link.id = linkId;
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const getUsedFonts = (config: DesignConfig, products: Product[]): string[] => {
  const fonts = new Set<string>();

  // Global fonts
  if (config.fonts?.body) fonts.add(config.fonts.body);
  if (config.fonts?.heading) fonts.add(config.fonts.heading);

  // Profile fonts
  if (config.profile?.titleStyle?.fontFamily) fonts.add(config.profile.titleStyle.fontFamily);
  if (config.profile?.bioStyle?.fontFamily) fonts.add(config.profile.bioStyle.fontFamily);

  // Product specific fonts
  products.forEach(p => {
    const style = p.style_config as ProductStyle | undefined;
    if (style?.titleFont) fonts.add(style.titleFont);
    if (style?.priceFont) fonts.add(style.priceFont);
  });

  return Array.from(fonts);
};
