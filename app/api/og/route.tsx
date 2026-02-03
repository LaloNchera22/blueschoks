import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/utils/supabase/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    // Initialize Supabase Admin Client
    const supabase = await createAdminClient();

    // 1. Fetch Profile Data by username
    // We select theme_config specifically as requested
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, shop_name, avatar_url, theme_config')
      .eq('username', username)
      .single();

    if (!profile) {
      return new Response('Profile not found', { status: 404 });
    }

    // 2. Extract Data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeConfig = (profile as any).theme_config || {};

    // Colores dinámicos
    const primaryColor = themeConfig.primaryColor || themeConfig.colors?.primary || '#1a1a1a';
    const bgColor = themeConfig.colors?.background || primaryColor;
    const textColor = themeConfig.colors?.text || 'white';

    // Configuración de Avatar (Forma)
    const avatarShape = themeConfig.profile?.avatarShape || 'circle';
    const borderRadius = avatarShape === 'circle' ? '50%' : '32px';

    // Shop Name
    const shopName = profile.shop_name || 'Mi Tienda';

    // Avatar
    const avatarUrl = profile.avatar_url;

    // Estilos comunes para la imagen
    const imageStyle = {
      borderRadius: borderRadius,
      width: '250px',
      height: '250px',
      marginBottom: '40px',
      objectFit: 'cover' as const,
      border: '8px solid rgba(255,255,255,0.2)',
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            fontFamily: 'sans-serif',
          }}
        >
          {/* 1. FOTO / AVATAR */}
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={shopName}
              style={imageStyle}
            />
          ) : (
            <div
              style={{
                ...imageStyle,
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: textColor,
                fontSize: 100,
                fontWeight: 'bold',
              }}
            >
              {shopName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* 2. TÍTULO */}
          <div
            style={{
              fontSize: 70,
              color: textColor,
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 4px 12px rgba(0,0,0,0.4)', // Soft shadow to ensure readability on any bg
              padding: '0 40px',
              lineHeight: 1.1,
            }}
          >
            {shopName}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('OG Generation Error:', e);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
