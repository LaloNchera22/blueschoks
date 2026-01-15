import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import EditProductForm from "./edit-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect("/login")

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!product) notFound()

  return <EditProductForm product={product} />
}
