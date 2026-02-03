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

  // Prioritize theme_config.primaryColor (as per user instruction),
  // fallback to theme_config.colors?.primary or black.
  const primaryColor =
    themeConfig.primaryColor ||
    themeConfig.colors?.primary ||
    '#000000';

  const avatarUrl = profile.avatar_url;
  const shopName = profile.shop_name || 'Mi Tienda';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: primaryColor,
          color: 'white',
        }}
      >
        {/* 1. LA FOTO (Arriba) */}
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Store Avatar"
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              marginBottom: 40,
              objectFit: 'cover',
            }}
          />
        )}

        {/* 2. EL TÍTULO (Abajo) */}
        <h1
          style={{
            fontSize: 60,
            margin: 0,
            textAlign: 'center',
            padding: '0 40px',
            lineHeight: 1.2,
          }}
        >
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
