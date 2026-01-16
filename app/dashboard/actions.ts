'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidateTag, revalidatePath } from "next/cache"
import { z } from "zod"

// Schemas
const ActionSchema = z.object({
  productId: z.string().uuid(),
})

export async function deleteProduct(productId: string) {
  // 1. Validation
  const result = ActionSchema.safeParse({ productId })
  if (!result.success) {
    return { error: "Invalid product ID" }
  }

  const supabase = await createClient()

  // 2. Auth & Ownership
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) return { error: "No autorizado" }

  // 3. Delete
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id)

  if (deleteError) {
    console.error("Error al borrar:", deleteError)
    throw new Error("No se pudo eliminar el producto")
  }

  // 4. Revalidate
  // Invalidate the cache for this user's products in the public shop
  // Next 16.1.1 workaround: pass undefined as second argument if required by type def
  // @ts-expect-error - revalidateTag in this canary version might require 2 args
  revalidateTag(`products:${user.id}`)

  // Also revalidate the dashboard view
  revalidatePath('/dashboard')
}

export async function toggleStock(productId: string) {
  const result = ActionSchema.safeParse({ productId })
  if (!result.success) {
    throw new Error("Invalid Product ID")
  }

  const supabase = await createClient()

  // 1. Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // 2. Fetch current stock
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !product) {
      console.error('toggleStock Error (Fetch):', fetchError)
      throw new Error(`No se pudo obtener el producto: ${fetchError?.message || 'Producto no encontrado'}`)
  }

  // 3. Toggle Stock (0 <-> 1)
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

  // 4. Revalidate
  // This tag invalidates the specific query in the public shop
  // @ts-expect-error - revalidateTag in this canary version might require 2 args
  revalidateTag(`products:${user.id}`)

  // Dashboard needs a refresh too
  revalidatePath('/dashboard')
}
