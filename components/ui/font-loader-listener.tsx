'use client';

import { useEffect } from 'react';
import { DesignConfig } from '@/lib/types/design-system';
import { Database } from '@/utils/supabase/types';
import { getUsedFonts, loadGoogleFont } from '@/utils/font-loader';

type Product = Database['public']['Tables']['products']['Row'];

interface FontLoaderListenerProps {
  config: DesignConfig;
  products: Product[];
}

export function FontLoaderListener({ config, products }: FontLoaderListenerProps) {
  useEffect(() => {
    const fonts = getUsedFonts(config, products);
    fonts.forEach(font => loadGoogleFont(font));
  }, [config, products]);

  return null;
}
