'use client'

import { updateProduct, State } from "./actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, PackagePlus, AlertCircle, Image as ImageIcon, X, Video, Crown, UploadCloud } from "lucide-react"

export default function EditProductForm({ product }: { product: any }) {
  const updateProductWithId = updateProduct.bind(null, product.id)
  const [state, dispatch] = useActionState(updateProductWithId, { status: null, message: null })

  // ESTADOS PARA LA INTERFAZ
  const [isPro, setIsPro] = useState(false)
  const [previews, setPreviews] = useState<{ url: string, type: 'image' | 'video', isExisting: boolean }[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])

  // 1. Consultar si es PRO al cargar y cargar previews
  useEffect(() => {
    const checkPlan = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single()
        setIsPro(data?.is_pro || false)
      }
    }
    checkPlan()

    const rawMedia = Array.isArray(product.media) && product.media.length > 0
    ? product.media
    : (product.image_url ? [product.image_url] : [])

    const mediaList: string[] = rawMedia.filter((url: any) => typeof url === 'string' && url.length > 5)

    const existingPreviews = mediaList.map((url) => ({
        url,
        type: url.includes('.mp4') || url.includes('.webm') ? 'video' : 'image', // check simple
        isExisting: true
    }))
    // @ts-ignore
    setPreviews(existingPreviews)
  }, [product])

  // 2. Manejar selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incomingFiles = Array.from(e.target.files)

      const totalFiles = previews.length + incomingFiles.length

      if (!isPro && totalFiles > 3) {
        alert("El plan gratuito permite máximo 3 archivos.")
        return
      }

      const newPreviewsToAdd = incomingFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image' as 'image' | 'video',
        isExisting: false
      }))

      setNewFiles([...newFiles, ...incomingFiles])
      setPreviews([...previews, ...newPreviewsToAdd])
    }
  }

  // 3. Eliminar archivo de la lista
  const removeFile = (index: number) => {
    const itemToRemove = previews[index]
    const newPreviews = [...previews]
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)

    if (!itemToRemove.isExisting) {
        // Si es nuevo, hay que quitarlo también de newFiles.
        // Como newFiles no tiene los existing, necesitamos calcular el índice en newFiles.
        // Una forma segura es reconstruir newFiles a partir de los previews restantes que no son existing.
        // Pero no tenemos el objeto File en previews.
        // Vamos a asumir que el orden relativo de los nuevos en previews es el mismo que en newFiles.
        // Contamos cuántos 'new' hay antes del que estamos borrando.
        let newIndex = 0;
        for (let i = 0; i < index; i++) {
            if (!previews[i].isExisting) newIndex++;
        }

        const updatedFiles = [...newFiles]
        updatedFiles.splice(newIndex, 1)
        setNewFiles(updatedFiles)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24">

      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 shadow-sm transition-all">
            <ArrowLeft size={18} />
        </Link>
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editar Producto</h1>
            <p className="text-slate-500">Actualiza la información de tu producto.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <PackagePlus size={16} /> Información del Producto
        </div>

        <div className="p-8">
            <form action={dispatch} className="space-y-8 max-w-3xl">

                {/* SECCIÓN MULTIMEDIA */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <Label className="text-base font-bold text-slate-900">Multimedia</Label>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md border ${isPro ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                           {isPro ? <span className="flex items-center gap-1"><Crown size={10} /> Ilimitado (PRO)</span> : `Plan Free: ${previews.length}/3 archivos`}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {previews.map((media, index) => (
                            <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                                {media.type === 'video' ? (
                                    <video src={media.url} className="w-full h-full object-cover" controls={false} muted />
                                ) : (
                                    <img src={media.url} alt="Preview" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-md backdrop-blur-sm">
                                    {media.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {(!isPro && previews.length >= 3) ? null : (
                            <label className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 hover:bg-slate-50 transition-all group text-slate-400 hover:text-slate-900">
                                <UploadCloud size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Agregar</span>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* INPUTS OCULTOS (Truco para enviar archivos) */}
                <input
                    type="file"
                    name="newMedia"
                    multiple
                    className="hidden"
                    ref={input => {
                        if (input && newFiles.length > 0) {
                            const dataTransfer = new DataTransfer();
                            newFiles.forEach(file => dataTransfer.items.add(file));
                            input.files = dataTransfer.files;
                        }
                    }}
                />

                {/* INPUTS OCULTOS PARA MEDIOS EXISTENTES */}
                {previews.filter(p => p.isExisting).map((p, i) => (
                    <input key={i} type="hidden" name="keptMedia" value={p.url} />
                ))}

                <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-bold text-slate-900">Nombre del Producto</Label>
                    <Input id="name" name="name" defaultValue={product.name} placeholder="Ej. Tenis Deportivos" required className="h-12 bg-white border-slate-200" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="price" className="text-base font-bold text-slate-900">Precio</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} placeholder="0.00" required className="pl-8 h-12" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-bold text-slate-900">Descripción</Label>
                    <textarea id="description" name="description" defaultValue={product.description} rows={4} className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-slate-900" placeholder="Detalles..." />
                </div>

                {state.status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2">
                    <AlertCircle size={20} /> <span className="font-medium">{state.message}</span>
                  </div>
                )}

                {/* --- BOTONES SEPARADOS --- */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-8">
                    <Link
                        href="/dashboard"
                        className="text-slate-500 font-bold text-sm hover:text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Cancelar
                    </Link>
                    <SubmitButton />
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
        type="submit"
        disabled={pending}
        className="
          bg-slate-900 hover:bg-slate-800 text-white
          font-black text-base tracking-wide
          h-12 px-10 rounded-xl
          shadow-xl shadow-slate-900/20
          transition-all duration-200
          hover:scale-[1.02] hover:shadow-slate-900/30
          active:scale-[0.98] active:shadow-sm
          disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
        "
    >
        {pending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Guardando...
            </>
        ) : (
            <>
              Guardar Cambios
            </>
        )}
    </Button>
  )
}
