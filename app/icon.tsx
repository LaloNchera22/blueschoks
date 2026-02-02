import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 320,
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '20%',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          // Modified textShadow to include blur radius and use hex codes to be safer with satori parser
          // -20px 0 0 #00FFFF, 20px 0 0 #FF0000
          textShadow: '-20px 0 0 #00FFFF, 20px 0 0 #FF0000',
        }}
      >
        B
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
