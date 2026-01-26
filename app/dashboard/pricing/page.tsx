import { getProfile } from "@/utils/user-data"
import PricingClient from "./pricing-client"

const PLANS = {
  monthly: {
    priceId: 'price_1StqsN4Z7AzNdq844cERPeZ8',
    mode: 'subscription' // Es recurrente
  },
  yearly: {
    priceId: 'price_1Stqss4Z7AzNdq84MiRge2uN',
    mode: 'subscription' // Es recurrente
  },
  lifetime: {
    priceId: 'price_1StqtO4Z7AzNdq849UhNQXYs',
    mode: 'payment' // IMPORTANTE: Es pago único (One-off), no suscripción
  }
}

export default async function PricingPage() {
  const profile = await getProfile()

  return (
    <PricingClient
      isPro={profile?.is_pro ?? false}
      subscriptionEnd={profile?.subscription_end_date ?? null}
      plans={PLANS}
    />
  )
}
