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
    // Use theme_config for primary color, default to black
    const themeConfig = (profile as any).theme_config || {};
    const bgColor = themeConfig.primaryColor || '#000000';

    // Shop Name
    const shopName = profile.shop_name || 'Mi Tienda';

    // Avatar
    const avatarUrl = profile.avatar_url;

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
            <img
              src={avatarUrl}
              alt={shopName}
              style={{
                borderRadius: '50%',
                width: '250px',
                height: '250px',
                marginBottom: '40px',
                objectFit: 'cover',
                border: '8px solid rgba(255,255,255,0.2)'
              }}
            />
          ) : (
            <div
              style={{
                borderRadius: '50%',
                width: '250px',
                height: '250px',
                marginBottom: '40px',
                border: '8px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
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
              color: 'white',
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
  } catch (e: any) {
    console.error('OG Generation Error:', e);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
