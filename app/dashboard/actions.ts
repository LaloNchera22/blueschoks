'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  // 1. Verificar quién quiere borrar
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) return { error: "No autorizado" }

  // 2. Borrar el producto (SOLO si le pertenece al usuario)
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id) // Seguridad crítica: Evita borrar productos de otros

  if (deleteError) {
    console.error("Error al borrar:", deleteError)
    throw new Error("No se pudo eliminar el producto")
  }

  // 3. Actualizar la pantalla
  revalidatePath('/dashboard')
}

export async function toggleStock(productId: string) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    console.error("Auth error in toggleStock:", error)
    return { error: "No autorizado" }
  }

  console.log(`toggleStock called for productId: ${productId} by user: ${user.id}`)

  // Obtenemos el producto actual para ver su stock
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !product) {
      console.error('Error fetching product in toggleStock:', fetchError)
      throw new Error("No se pudo obtener el producto")
  }

  // Si stock > 0, lo ponemos en 0. Si es 0, lo ponemos en 1.
  const newStock = product.stock > 0 ? 0 : 1

  const { error: updateError } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (updateError) {
      throw new Error("No se pudo actualizar el stock")
  }

  revalidatePath('/dashboard')
}
