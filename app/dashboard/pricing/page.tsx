import { getProfile } from "@/utils/user-data"
import PricingClient from "./pricing-client"

export default async function PricingPage() {
  const profile = await getProfile()

  return (
    <PricingClient
      isPro={profile?.is_pro ?? false}
      subscriptionEnd={profile?.subscription_end_date ?? null}
    />
  )
}
