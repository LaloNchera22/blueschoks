import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get('title') || 'Mi Tienda';
    const avatar = searchParams.get('avatar');
    // Default to a dark green if no background is provided, as requested ("elegante")
    const bg = searchParams.get('bg') || '#1a472a';

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
            backgroundColor: bg,
            fontFamily: 'sans-serif',
          }}
        >
          {/* Avatar */}
          {avatar && (
            <img
              src={avatar}
              alt="Profile"
              style={{
                width: 250,
                height: 250,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: 20,
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }}
            />
          )}

          {/* Shop Name */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              padding: '0 40px',
              maxWidth: '90%',
              display: 'flex',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              marginBottom: 40, // Space between title and footer
              textShadow: '0 2px 10px rgba(0,0,0,0.3)', // Ensure readability
            }}
          >
            {title}
          </div>

          {/* Footer / Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            BlueShocks
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
