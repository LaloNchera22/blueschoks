import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
    const stripe = new Stripe(stripeSecretKey)
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature') as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event

    try {
      if (!signature || !webhookSecret) {
        throw new Error('Faltan credenciales del Webhook')
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      console.error(`❌ Error de firma Webhook: ${message}`)
      // Incluso si falla la firma, devolvemos 200 para evitar reintentos si es un error irrecuperable de configuración,
      // aunque normalmente aquí se devuelve 400.
      // Pero la instrucción dice "Devuelve siempre NextResponse.json({ received: true }) al final, incluso si hay error lógico".
      // Para errores de firma, suele ser mejor 400, pero seguiré la instrucción de "incluso si hay error lógico".
      // Sin embargo, si la firma falla, no es un error lógico, es de seguridad.
      // El usuario dijo: "incluso si hay error lógico (haz console.error)".
      // Voy a asumir que quiere que el flujo principal de "lógica de actualización" no falle.
      // Pero si falla la firma, no puedo confiar en el evento.
      // Voy a devolver 200 y loguear error para cumplir con "evitar que Stripe reintente infinitamente" si es lo que quiere.
      return NextResponse.json({ received: true })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const customerId = session.customer

      if (userId) {
        // Cliente Admin (Service Role) - Inicializado dentro de POST
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

        const updateData: { is_pro: boolean; stripe_customer_id?: string | null } = {
          is_pro: true
        }

        if (typeof customerId === 'string') {
          updateData.stripe_customer_id = customerId
        }
        // Si es null, lo ignoramos como pidió: "si es null ignóralo o guarda null".
        // Si quisiera guardar null explícitamente: updateData.stripe_customer_id = customerId;
        // Pero dijo "ignóralo o guarda null". Ignorarlo es más seguro para no borrar datos si ya existían.
        // Pero dado que es un checkout nuevo, probablemente queremos guardar lo que venga.
        // Dijo "Guárdalo en stripe_customer_id solo si existe, si es null ignóralo o guarda null."
        // Voy a optar por "solo si existe" (ignorar si es null) para no sobrescribir con null si por alguna razón extraña ya tuviera uno (ej. renovación).

        const { error } = await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .eq('id', userId)

        if (error) {
          console.error('❌ Error actualizando Supabase:', error)
        } else {
          console.log(`✅ Usuario ${userId} actualizado a PRO`)
        }
      } else {
        console.error('⚠️ Webhook recibido sin userId en metadata')
      }
    }

  } catch (error) {
    console.error('❌ Error general en Webhook:', error)
  }

  return NextResponse.json({ received: true })
}
