import { createClient } from "@/utils/supabase/server"
import ProductForm from "./product-form"
import { redirect } from "next/navigation"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile?.is_pro || false

  return <ProductForm isPro={isPro} />
}
