import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import EditProductForm from "./edit-form"
import { getUser, getProfile } from "@/utils/user-data"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!product) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile?.is_pro || false

  return <EditProductForm product={product} isPro={isPro} />
}
