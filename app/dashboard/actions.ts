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
  // Validación básica del input
  if (!productId) {
    throw new Error("Product ID is required")
  }

  const supabase = await createClient()

  // 1. Verificar autenticación
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    console.error("Auth error in toggleStock:", error)
    throw new Error("No autorizado: Sesión inválida")
  }

  console.log(`toggleStock: Processing for productId: ${productId} | User: ${user.id}`)

  // 2. Obtener producto (Validando propiedad con user_id)
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !product) {
      // Log detallado del error de Supabase para debugging
      console.error('toggleStock Error (Fetch):', fetchError)
      // Lanzamos error con detalle (opcionalmente podrías ocultarlo en prod, pero útil ahora)
      throw new Error(`No se pudo obtener el producto: ${fetchError?.message || 'Producto no encontrado'}`)
  }

  // 3. Lógica de Toggle:
  // - Si tiene stock (>0) -> Se apaga (0) = Oculto
  // - Si no tiene stock (0) -> Se enciende (1) = Visible
  const newStock = product.stock > 0 ? 0 : 1

  const { error: updateError } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (updateError) {
      console.error('toggleStock Error (Update):', updateError)
      throw new Error("No se pudo actualizar el estado del producto")
  }

  // 4. Revalidar dashboard para feedback inmediato
  revalidatePath('/dashboard')
}
