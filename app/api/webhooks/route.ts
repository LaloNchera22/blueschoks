import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_secret_for_build';

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  const stripe = new Stripe(stripeSecretKey)
  const body = await request.text()

  // --- CORRECCIÓN AQUÍ ---
  // 1. Primero esperamos a obtener los headers
  const headersList = await headers()
  // 2. Luego leemos la firma
  const signature = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    // Verificar firma de seguridad
    if (!signature || !webhookSecret) {
       throw new Error("Faltan credenciales del Webhook")
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    console.error(`❌ Error de Webhook: ${message}`)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Manejar el evento "Pago Exitoso"
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const customerId = session.customer as string 

    if (userId && customerId) {
      console.log(`✅ Pago recibido! User: ${userId} | Customer: ${customerId}`)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'

      // Conexión "ADMIN" a Supabase
      const supabaseAdmin = createClient(
        supabaseUrl,
        supabaseKey
      )

      // Actualizamos el perfil
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