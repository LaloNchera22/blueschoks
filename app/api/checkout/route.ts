// app/api/checkout/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

// CORRECCIÓN AQUÍ:
// Si te marca error de versión, simplemente quita la línea de apiVersion 
// o pon la fecha exacta que te sugiere el error (ej: '2024-12-18.acacia')

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  const stripe = new Stripe(stripeSecretKey, {
    typescript: true, // Esto ayuda a que no se queje tanto
    // apiVersion: '2024-12-18.acacia', <--- PUEDES COMENTAR ESTO SI MOLESTA
  })

  const supabase = await createClient()

  // 1. Verificamos quién es el usuario
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 2. Buscamos su email (o username)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: profile } = await supabase
    .from('profiles')
    .select('username') 
    .eq('id', user.id)
    .single()

  try {
    const body = await req.json().catch(() => ({})); // Handle empty body safely
    const priceId = body.priceId || process.env.STRIPE_PRICE_ID || 'price_dummy_for_build';

    const lifetimePriceId = process.env.STRIPE_PRICE_ID_PRO_LIFETIME;
    let mode: Stripe.Checkout.SessionCreateParams.Mode = 'subscription';

    if (lifetimePriceId && priceId === lifetimePriceId) {
      mode = 'payment';
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 3. Creamos la sesión de pago
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Asegúrate de tener esto en tu .env.local
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
      customer_email: user.email, 
      metadata: {
        userId: user.id, 
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error: unknown) {
    console.error('STRIPE ERROR:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido de Stripe' },
      { status: 500 }
    );
  }
}
