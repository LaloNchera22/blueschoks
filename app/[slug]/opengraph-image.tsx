import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/utils/supabase/server';

export const runtime = 'edge';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_name, avatar_url, theme_config')
    .eq('username', slug)
    .single();

  if (!profile) {
    return new ImageResponse(
      (
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
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Extract config
  const themeConfig = (profile.theme_config as any) || {};

  // Color de fondo dinámico (default a gris oscuro si falla, como pide el usuario)
  const primaryColor =
    themeConfig.primaryColor ||
    themeConfig.colors?.primary ||
    '#1a1a1a';

  const avatarUrl = profile.avatar_url;
  const shopName = profile.shop_name || 'Mi Tienda';

  // 1. Define un estilo base para la imagen para asegurar que ocupe espacio
  const imageStyle = {
      width: '250px',
      height: '250px',
      borderRadius: '50%',
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
          backgroundColor: primaryColor,
        }}
      >
        {/* 2. Renderizado condicional de la imagen */}
        {avatarUrl ? (
            // Si hay avatar, intentamos cargarlo (requiere el fix de next.config.js)
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} style={imageStyle} alt="Avatar" />
        ) : (
            // FALLBACK: Si no hay avatar, mostramos un círculo placeholder
            <div style={{ ...imageStyle, backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {/* Puedes poner una inicial o icono aquí */}
               <span style={{ fontSize: 100, color: 'white' }}>{shopName.charAt(0)}</span>
            </div>
        )}

        {/* 3. El Título */}
        <h1 style={{ fontSize: 80, fontWeight: 900, color: 'white', textAlign: 'center', margin: 0, padding: '0 40px' }}>
            {shopName}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
