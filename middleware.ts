import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verificamos sesión sin bloquear la ejecución si no es necesario
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // --- REGLAS DE TRÁFICO ---

  // 1. Proteger Dashboard: Si va a /dashboard y NO está logueado -> Login
  if (url.pathname.startsWith('/dashboard') && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Redirigir Usuarios Logueados: Si va a /login y SÍ está logueado -> Dashboard
  if (url.pathname.startsWith('/login') && user) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 3. Tiendas ([slug]) son públicas: Pasan directo (NextResponse.next())

  return response
}

export const config = {
  // Aplicar a todo excepto archivos estáticos e imágenes (ahorra recursos)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}