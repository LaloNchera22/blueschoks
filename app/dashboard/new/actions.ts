'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export type State = {
  status: 'success' | 'error' | null
  message: string | null
}

export async function createProduct(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient()
  let shouldRedirect = false

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { status: 'error', message: "No autorizado." }

    // Verificar Plan
    const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single()
    const isPro = profile?.is_pro || false

    const name = formData.get("name") as string
    const priceRaw = formData.get("price") as string
    const description = formData.get("description") as string
    const files = formData.getAll("media") as File[]

    if (!name || !priceRaw) return { status: 'error', message: "Faltan datos." }

    // Validar Límite Free
    const validFiles = files.filter(f => f.size > 0)
    if (!isPro && validFiles.length > 3) {
      return { status: 'error', message: "Límite gratuito excedido (3 archivos)." }
    }

    // Subir Archivos
    const uploadedUrls: string[] = []
    
    for (const file of validFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error } = await supabase.storage.from('product-media').upload(fileName, file)
      if (error) continue 

      const { data } = supabase.storage.from('product-media').getPublicUrl(fileName)
      uploadedUrls.push(data.publicUrl)
    }

    // Guardar en DB
    const { error: dbError } = await supabase.from("products").insert({
        name,
        price: parseFloat(priceRaw),
        description,
        user_id: user.id,
        media: uploadedUrls,
        image_url: uploadedUrls[0] || null
    })

    if (dbError) throw dbError

    // Marcar éxito
    shouldRedirect = true

  } catch (error) {
    console.error(error)
    return { status: 'error', message: "Error al guardar. Intenta con archivos más ligeros." }
  }

  // REDIRECCIÓN SEGURA (Fuera del catch)
  if (shouldRedirect) {
    revalidatePath("/dashboard")
    redirect("/dashboard")
  }

  return { status: 'error', message: "Error desconocido." }
}