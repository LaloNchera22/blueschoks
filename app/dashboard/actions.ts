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