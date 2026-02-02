import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/utils/supabase/server';
import { DesignConfig } from '@/lib/types/design-system';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Initialize Supabase Admin Client
    const supabase = await createAdminClient();

    // Fetch Profile Data
    const { data: profile } = await supabase
      .from('profiles')
      .select('shop_name, avatar_url, design_config, theme_config, design_bg_color, design_title_text, design_title_color')
      .eq('slug', slug)
      .single();

    if (!profile) {
      return new Response('Store not found', { status: 404 });
    }

    // Resolve Design Configuration
    // Prioritize modern design_config, fall back to legacy fields
    const config = (profile.design_config || profile.theme_config) as unknown as DesignConfig;

    // Background
    const backgroundColor =
      config?.colors?.background ||
      profile.design_bg_color ||
      '#ffffff';

    const backgroundImage = config?.backgroundImage ? `url(${config.backgroundImage})` : undefined;

    // Text Color
    const textColor =
      config?.profile?.titleStyle?.color ||
      config?.colors?.text ||
      profile.design_title_color ||
      '#000000';

    // Shop Name
    const shopName =
      config?.profile?.shopName ||
      profile.shop_name ||
      'Mi Tienda';

    // Avatar
    const avatarUrl =
      config?.profile?.avatarUrl ||
      profile.avatar_url;

    // Font family (using system-ui for simplicity as "simple image" request)
    // We could load fonts, but starting simple ensures reliability.

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
            backgroundColor: backgroundColor,
            backgroundImage: backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: textColor,
            fontFamily: 'sans-serif',
          }}
        >
          {/* Avatar */}
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={shopName}
              style={{
                width: 180,
                height: 180,
                borderRadius: config?.profile?.avatarShape === 'square' ? '20px' : '50%',
                objectFit: 'cover',
                marginBottom: 40,
                border: config?.profile?.avatarBorderColor ? `4px solid ${config.profile.avatarBorderColor}` : 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            />
          )}

          {/* Shop Name */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '0 40px',
              lineHeight: 1.2,
              display: 'flex', // Important for text handling in satori
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '90%',
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
