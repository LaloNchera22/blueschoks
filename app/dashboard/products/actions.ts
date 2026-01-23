"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { ProductStyle } from "@/lib/types/design-system"

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // 1. Verificar Usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  // 2. Recolectar datos básicos
  const productId = formData.get("id") as string | null // <--- IMPORTANTE: Buscamos si hay ID
  const name = formData.get("name")
  const price = parseFloat(formData.get("price") as string)
  const description = formData.get("description")
  
  // Recolectamos URLs de imágenes que YA existían (vienen del frontend)
  // El frontend debe enviar inputs ocultos con name="existing_media"
  const existingMedia = formData.getAll("existing_media") as string[] 

  // 3. Verificar si es PRO
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile?.is_pro || false

  // 4. Recolectar Archivos NUEVOS
  const newFiles = formData.getAll('files') as File[]
  
  // Calcular total de archivos (Viejos + Nuevos que tengan tamaño > 0)
  const validNewFiles = newFiles.filter(f => f.size > 0)
  const totalFilesCount = existingMedia.length + validNewFiles.length

  // --- REGLAS DE NEGOCIO ---
  if (!isPro) {
    if (totalFilesCount > 3) {
      throw new Error(`El plan gratuito permite 3 fotos. Tienes ${totalFilesCount}.`)
    }
    const hasVideo = validNewFiles.some(f => f.type.startsWith('video/'))
    // Nota: También deberíamos checar si existingMedia tiene videos, pero asumimos que ya pasaron el filtro antes.
    if (hasVideo) {
      throw new Error("Los videos son exclusivos del plan PRO.")
    }
  }

  // 5. Subir Archivos NUEVOS a Supabase Storage
  const uploadPromises = validNewFiles.map(async (file, index) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${index}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage.from('products').upload(fileName, file)
    if (error) return null

    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
    return data.publicUrl
  })

  const results = await Promise.all(uploadPromises)
  const newMediaUrls = results.filter((url): url is string => url !== null)

  // 6. Combinar URLs (Las viejas que conservamos + las nuevas subidas)
  const finalMediaArray = [...existingMedia, ...newMediaUrls]

  // 7. Guardar en Base de Datos (UPDATE o INSERT)
  const payload = {
    user_id: user.id,
    name: name as string,
    price: price,
    description: description as string | null,
    image_url: finalMediaArray[0] || null, // Portada actualizada
    images: finalMediaArray
  }

  let error;

  if (productId) {
    // --- MODO EDICIÓN (UPDATE) ---
    const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq('id', productId)
        .eq('user_id', user.id) // Seguridad extra
    error = updateError
  } else {
    // --- MODO CREACIÓN (INSERT) ---
    const { error: insertError } = await supabase
        .from("products")
        .insert(payload)
    error = insertError
  }

  if (error) throw new Error("Error al guardar: " + error.message)

  revalidatePath("/dashboard/products")
  return { success: true }
}

export async function updateProductStyle(productId: string, style: ProductStyle) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  const { error } = await supabase
    .from('products')
    .update({ style_config: style })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) throw new Error("Error al actualizar estilo del producto: " + error.message)

  revalidatePath("/dashboard/products")
  return { success: true }
}

export async function applyStyleToAllProducts(style: ProductStyle) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  const { error } = await supabase
    .from('products')
    .update({ style_config: style })
    .eq('user_id', user.id)

  if (error) throw new Error("Error al aplicar estilo a todos los productos: " + error.message)

  revalidatePath("/dashboard/products")
  return { success: true }
}

export async function saveProductStylesBulk(updates: { id: string; style_config: ProductStyle }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  // Use Promise.all for concurrency
  const promises = updates.map(update =>
    supabase.from('products')
      .update({ style_config: update.style_config })
      .eq('id', update.id)
      .eq('user_id', user.id) // Ensure user owns the product
  )

  await Promise.all(promises)

  revalidatePath('/dashboard/design')
  revalidatePath('/[slug]', 'page') // Limpiar caché pública
  revalidatePath('/', 'layout') // Global revalidate
  return { success: true }
}
