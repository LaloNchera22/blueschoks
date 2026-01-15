'use server'

import { createClient } from '../utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface ProfileQueryData {
  is_pro: boolean
  username: string | null
}

// --- ACTUALIZACIÓN DE PERFIL ---
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const updates: any = {
    updated_at: new Date().toISOString(),
  }

  const shopName = formData.get('shopName') as string | null
  const username = formData.get('username') as string | null
  const rawWhatsapp = formData.get('whatsapp') as string | null

  if (shopName !== null) updates.shop_name = shopName.trim()
  if (username !== null) updates.username = username.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
  if (rawWhatsapp !== null) updates.whatsapp = rawWhatsapp.replace(/\D/g, '')

  if (Object.keys(updates).length <= 1) return { error: 'No se detectaron datos para actualizar.' }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    // Código de error para 'duplicado'
    if (error.code === '23505') return { error: 'Ese link de tienda ya está en uso.' }
    return { error: 'Error al guardar los cambios.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  
  // Revalidar la ruta pública si cambió el username
  if (updates.username) {
      revalidatePath(`/${updates.username}`)
  } else {
      // Si no cambió, buscamos el actual para revalidarlo
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
      
      if (currentProfile?.username) revalidatePath(`/${currentProfile.username}`)
  }

  return { success: '¡Datos actualizados correctamente!' }
}

// --- GESTIÓN DE PRODUCTOS (CORREGIDO PARA EVITAR ERRORES DE TIPO) ---
export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // CONSULTA SEGURA: Tipado manual para evitar 'any'
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, username')
    .eq('id', user.id)
    .returns<ProfileQueryData[]>()
    .maybeSingle()
  
  // Si no encuentra el perfil o la columna, asumimos que no es PRO
  const isPro = profile?.is_pro || false

  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  
  // OBTENER IMÁGENES: Filtramos para asegurar que sean archivos
  const rawImages = formData.getAll('image').filter((item): item is File => item instanceof File)

  if (!name || !price || rawImages.length === 0) {
    return { error: 'Faltan datos obligatorios (mínimo 1 imagen)' }
  }

  // APLICAR LÍMITE
  const imagesToProcess = isPro ? rawImages : rawImages.slice(0, 3)
  const uploadedUrls: string[] = []

  // SUBIDA EN PARALELO
  const uploadPromises = imagesToProcess
    .filter(imageFile => imageFile.size > 0 && imageFile.type.startsWith('image/'))
    .map(async (imageFile, index) => {
      if (imageFile.size > 4 * 1024 * 1024) {
        throw new Error('Una de las imágenes pesa más de 4MB');
      }

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${index}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

      if (error) {
        throw new Error('Error al subir una de las imágenes: ' + error.message);
      }

      return supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
    });

  try {
    const resolvedUrls = await Promise.all(uploadPromises);
    uploadedUrls.push(...resolvedUrls);
  } catch (error: any) {
    return { error: error.message };
  }

  // INSERTAR EN BASE DE DATOS
  // Usamos 'as any' en el insert para que no reclame por la columna 'images'
  const { error: dbError } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      name,
      price: parseFloat(price),
      description,
      image_url: uploadedUrls[0], // Foto principal
      images: uploadedUrls        // Array de fotos
    } as any)

  if (dbError) {
    console.error(dbError)
    return { error: 'Error al guardar el producto.' }
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

// --- ACTUALIZAR CAMPO INDIVIDUAL ---
export async function updateField(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const fieldName = formData.get('fieldName') as string
  const rawValue = formData.get('value') as string

  const dbColumnMap: Record<string, string> = {
    shopName: 'shop_name',
    username: 'username',
    whatsapp: 'whatsapp'
  }

  if (!dbColumnMap[fieldName]) return { error: 'Campo no válido' }

  let finalValue = rawValue;
  if (fieldName === 'username') finalValue = rawValue.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
  if (fieldName === 'whatsapp') finalValue = rawValue.replace(/\D/g, '')

  const { error } = await supabase
    .from('profiles')
    .update({ 
        [dbColumnMap[fieldName]]: finalValue,
        updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'Ese dato ya está registrado.' }
    return { error: 'Error al actualizar.' }
  }

  revalidatePath('/dashboard/settings')
  if (fieldName === 'username') revalidatePath(`/${finalValue}`)

  return { success: 'Actualizado correctamente' }
}