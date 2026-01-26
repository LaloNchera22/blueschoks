'use server'

import { createClient } from '../utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface ProfileQueryData {
  is_pro: boolean
  username: string | null
}

// --- ACTUALIZACIÓN DE PERFIL (CORREGIDO) ---
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // CAMBIO 1: Usamos 'any' o tipos flexibles para permitir null (importante para borrar datos)
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  const shopName = formData.get('shopName') as string | null
  const username = formData.get('username') as string | null
  const rawWhatsapp = formData.get('whatsapp') as string | null
  const instagram = formData.get('instagram') as string | null
  const tiktok = formData.get('tiktok') as string | null

  // Validación: Shop Name
  if (shopName !== null && shopName.trim().length > 0) {
    updates.shop_name = shopName.trim()
  }

  // Validación: Username / Slug
  if (username !== null && username.trim().length > 0) {
    updates.username = username.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
  }

  // Validación CRÍTICA: WhatsApp
  // Si envían texto vacío, lo guardamos como NULL para evitar error de "duplicate key" en strings vacíos
  if (rawWhatsapp !== null) {
    const cleanPhone = rawWhatsapp.replace(/\D/g, '')
    updates.whatsapp = cleanPhone.length > 0 ? cleanPhone : null
  }

  // Redes Sociales (Opcionales)
  if (instagram !== null) updates.instagram_url = instagram.trim() || null
  if (tiktok !== null) updates.tiktok_url = tiktok.trim() || null

  // Si solo está el 'updated_at', no hay nada que guardar
  if (Object.keys(updates).length <= 1) {
      // Retornamos success falso pero sin error agresivo
      return { success: 'No hubo cambios para guardar.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    // Código de error Postgres para 'unique violation' (ej: username o teléfono repetido)
    if (error.code === '23505') return { error: 'Ese link o teléfono ya está registrado por otro usuario.' }
    return { error: 'Error al guardar: ' + error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  
  // Revalidar rutas públicas
  if (updates.username) {
      revalidatePath(`/${updates.username}`)
  } else {
      // Intentar revalidar el actual si no cambió el slug
      try {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        if (currentProfile?.username) revalidatePath(`/${currentProfile.username}`)
      } catch (e) {
          console.log("No se pudo revalidar path antiguo")
      }
  }

  return { success: '¡Datos actualizados correctamente!' }
}

// --- GESTIÓN DE PRODUCTOS ---
export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // Verificamos si es PRO
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, username')
    .eq('id', user.id)
    .returns<ProfileQueryData[]>()
    .maybeSingle()
  
  const isPro = profile?.is_pro || false

  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  
  const rawImages = formData.getAll('image').filter((item): item is File => item instanceof File)

  if (!name || !price || rawImages.length === 0) {
    return { error: 'Faltan datos obligatorios (mínimo 1 imagen)' }
  }

  const imagesToProcess = isPro ? rawImages : rawImages.slice(0, 3)
  const uploadedUrls: string[] = []

  // Subida de imágenes
  const uploadPromises = imagesToProcess
    .filter(imageFile => imageFile.size > 0 && imageFile.type.startsWith('image/'))
    .map(async (imageFile, index) => {
      if (imageFile.size > 5 * 1024 * 1024) { // Subido a 5MB por seguridad
        throw new Error('Imagen muy pesada (>5MB)');
      }

      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}-${index}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

      if (error) {
        throw new Error('Error subiendo imagen: ' + error.message);
      }

      return supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
    });

  try {
    const resolvedUrls = await Promise.all(uploadPromises);
    uploadedUrls.push(...resolvedUrls);
  } catch (error: any) {
    return { error: error.message || 'Error al subir imágenes.' };
  }

  const { error: dbError } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      name,
      price: parseFloat(price),
      description,
      image_url: uploadedUrls[0], 
      images: uploadedUrls        
    })

  if (dbError) {
    console.error(dbError)
    return { error: 'Error base de datos: ' + dbError.message }
  }

  revalidatePath('/dashboard')
  if (profile?.username) revalidatePath(`/${profile.username}`)

  return { success: 'Producto agregado exitosamente' }
}

// --- BORRAR PRODUCTO ---
export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) return { error: 'No se pudo eliminar el producto' }

  revalidatePath('/dashboard')
  return { success: 'Producto eliminado' }
}

// --- ACTUALIZAR CAMPO INDIVIDUAL (Optimizado) ---
export async function updateField(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const fieldName = formData.get('fieldName') as string
  const rawValue = formData.get('value') as string

  // Mapeo seguro
  const dbColumnMap: Record<string, string> = {
    shopName: 'shop_name',
    username: 'username',
    whatsapp: 'whatsapp',
    instagram: 'instagram_url', // Agregado por si acaso
    tiktok: 'tiktok_url'
  }

  if (!dbColumnMap[fieldName]) return { error: 'Campo no válido' }

  let finalValue: string | null = rawValue;

  // Lógica específica por campo
  if (fieldName === 'username') {
      finalValue = rawValue.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
      if (!finalValue) return { error: 'El link no puede estar vacío' }
  }
  
  if (fieldName === 'whatsapp') {
      const clean = rawValue.replace(/\D/g, '')
      finalValue = clean.length > 0 ? clean : null
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
        [dbColumnMap[fieldName]]: finalValue,
        updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'Este dato ya está en uso por otra cuenta.' }
    return { error: 'Error al actualizar.' }
  }

  revalidatePath('/dashboard/settings')
  if (fieldName === 'username') revalidatePath(`/${finalValue}`)

  return { success: 'Actualizado correctamente' }
}