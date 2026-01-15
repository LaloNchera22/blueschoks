import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import EditProductForm from "./edit-form"
import { getUser } from "@/utils/user-data"

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

  return <EditProductForm product={product} />
}
