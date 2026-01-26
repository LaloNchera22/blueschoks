import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';
const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
})

export async function POST(req: Request) {
  const supabase = await createClient()

  // 1. Verificamos quién es el usuario
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { priceId, mode } = body;

    if (!priceId || !mode) {
        return NextResponse.json({ error: 'Missing priceId or mode' }, { status: 400 })
    }

    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 2. Creamos la sesión de pago
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard/pricing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error('Error Stripe:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
