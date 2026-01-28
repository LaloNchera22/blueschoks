import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  console.log('Iniciando checkout...')

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error('Falta STRIPE_SECRET_KEY en variables de entorno')
    }

    const stripe = new Stripe(stripeSecretKey, {
      typescript: true,
      // apiVersion: '2024-12-18.acacia', // Keeping this commented out as in original
    })

    const supabase = await createClient()

    // 1. Verificamos quién es el usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Error de autenticación o usuario no encontrado:', authError)
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Buscamos su email (o username)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    const body = await req.json().catch(() => ({})) // Handle empty body safely
    const priceId = body.priceId || process.env.STRIPE_PRICE_ID || 'price_dummy_for_build'

    const lifetimePriceId = process.env.STRIPE_PRICE_ID_PRO_LIFETIME
    let mode: Stripe.Checkout.SessionCreateParams.Mode = 'subscription'

    if (lifetimePriceId && priceId === lifetimePriceId) {
      mode = 'payment'
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

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

  } catch (error: any) {
    console.error('Error interno en Checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
