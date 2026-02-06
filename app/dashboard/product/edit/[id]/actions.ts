'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export type State = {
  status: 'success' | 'error' | null
  message: string | null
}

export async function updateProduct(productId: string, prevState: State, formData: FormData): Promise<State> {
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

    // Archivos nuevos
    const newFiles = formData.getAll("newMedia") as File[]
    const validNewFiles = newFiles.filter(f => f.size > 0)

    // URLs existentes que se mantienen
    const keptMedia = formData.getAll("keptMedia") as string[]

    if (!name || !priceRaw) return { status: 'error', message: "Faltan datos." }

    const totalFiles = validNewFiles.length + keptMedia.length
    if (!isPro && totalFiles > 3) {
      return { status: 'error', message: "Límite gratuito excedido (3 archivos)." }
    }

    // Subir Archivos Nuevos
    const uploadPromises = validNewFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${index}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error } = await supabase.storage.from('product-media').upload(fileName, file)
      if (error) return null

      const { data } = supabase.storage.from('product-media').getPublicUrl(fileName)
      return data.publicUrl
    })

    const results = await Promise.all(uploadPromises)
    const uploadedUrls = results.filter((url): url is string => url !== null)

    // Combinar URLs existentes con las nuevas
    const finalMedia = [...keptMedia, ...uploadedUrls]

    // Actualizar en DB
    const { error: dbError } = await supabase
        .from("products")
        .update({
            name,
            price: parseFloat(priceRaw),
            description,
            images: finalMedia,
            image_url: finalMedia[0] || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .eq('user_id', user.id)

    if (dbError) throw dbError

    // Marcar éxito
    shouldRedirect = true

  } catch (error) {
    console.error(error)
    return { status: 'error', message: "Error al actualizar." }
  }

  // REDIRECCIÓN SEGURA
  if (shouldRedirect) {
    revalidatePath("/dashboard")
    redirect("/dashboard")
  }

  return { status: 'error', message: "Error desconocido." }
}
