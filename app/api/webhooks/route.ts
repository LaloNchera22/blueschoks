import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_secret_for_build';

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  const stripe = new Stripe(stripeSecretKey)
  const body = await request.text()

  const headersList = await headers()
  const signature = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
       throw new Error("Faltan credenciales del Webhook")
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    console.error(`❌ Error de Webhook: ${message}`)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const customerId = session.customer as string 

    if (userId && customerId) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
            is_pro: true, 
            stripe_customer_id: customerId 
        })
        .eq('id', userId)

      if (error) {
        console.error('❌ Error actualizando Supabase:', error)
        return NextResponse.json({ error: 'Error DB' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
