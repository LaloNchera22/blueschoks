import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/utils/supabase/server';
import { loadGoogleFont } from '@/lib/og-utils';

export const runtime = 'edge';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, avatar_url, theme_config, is_pro')
    .eq('username', slug)
    .single();

  const defaultImage = (
    <div
      style={{
        fontSize: 60,
        background: 'black',
        color: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      BlueShocks
    </div>
  );

  // Fallback for non-existent profile or non-pro users (Free version)
  if (!profile || !profile.is_pro) {
    return new ImageResponse(defaultImage, {
      width: 1200,
      height: 630,
    });
  }

  try {
    // Extract config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeConfig = (profile.theme_config as any) || {};

    // Colores dinámicos
    const primaryColor = themeConfig.primaryColor || themeConfig.colors?.primary || '#1a1a1a';
    const bgColor = themeConfig.colors?.background || primaryColor;
    const textColor = themeConfig.colors?.text || 'white';

    // Configuración de Avatar (Forma)
    const avatarShape = themeConfig.profile?.avatarShape || 'circle';
    const borderRadius = avatarShape === 'circle' ? '50%' : '32px';

    const avatarUrl = profile.avatar_url;
    const shopName = profile.shop_name || 'Mi Tienda';

    // Fonts
    const fontName = themeConfig.fonts?.heading || themeConfig.font || 'Inter';
    const fontData = await loadGoogleFont(fontName);

    // 1. Define un estilo base para la imagen para asegurar que ocupe espacio
    const imageStyle = {
      width: '250px',
      height: '250px',
      borderRadius: borderRadius,
      objectFit: 'cover' as const,
      marginBottom: '50px', // Separación con el título
      border: '8px solid rgba(255,255,255,0.2)', // Marco estético
    };

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', // FOTO ARRIBA, TEXTO ABAJO
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            fontFamily: fontName,
          }}
        >
          {/* 2. Renderizado condicional de la imagen */}
          {avatarUrl ? (
            // Si hay avatar, intentamos cargarlo (requiere el fix de next.config.js)
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} style={imageStyle} alt="Avatar" />
          ) : (
            // FALLBACK: Si no hay avatar, mostramos un círculo placeholder
            <div
              style={{
                ...imageStyle,
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Puedes poner una inicial o icono aquí */}
              <span style={{ fontSize: 100, color: textColor }}>{shopName.charAt(0)}</span>
            </div>
          )}

          {/* 3. El Título */}
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: textColor,
              textAlign: 'center',
              margin: 0,
              padding: '0 40px',
            }}
          >
            {shopName}
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData
          ? [
              {
                name: fontName,
                data: fontData,
                style: 'normal',
                weight: 700,
              },
            ]
          : undefined,
      }
    );
  } catch (e) {
    console.error('Error generating OG image:', e);
    return new ImageResponse(defaultImage, {
      width: 1200,
      height: 630,
    });
  }
}
