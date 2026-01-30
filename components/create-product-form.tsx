"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Image as ImageIcon, Trash2, UploadCloud, Video, ArrowLeft, Lock, Star } from "lucide-react"
import { createProduct } from "@/app/dashboard/products/actions"
import Image from "next/image"
import Link from "next/link"

export default function CreateProductForm({ isPro = false, productCount = 0 }: { isPro?: boolean, productCount?: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previews, setPreviews] = useState<{url: string, type: string}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isProductLimitReached = !isPro && productCount >= 3;

  if (isProductLimitReached) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Has alcanzado tu límite</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          El plan gratuito permite hasta 3 productos activos. Has usado {productCount} de 3.
          <br />Actualiza a PRO para publicar productos ilimitados.
        </p>
        <div className="flex flex-col gap-3">
            <Link href="/dashboard/settings" className="w-full">
                <Button className="w-full h-12 bg-black hover:bg-slate-800 text-white font-bold rounded-xl text-lg shadow-lg shadow-slate-900/10 transition-all active:scale-95">
                    <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                    Obtener Plan PRO
                </Button>
            </Link>
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="w-full font-bold text-slate-500"
            >
                Volver
            </Button>
        </div>
      </div>
    )
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validación Plan
    if (!isPro && (previews.length + files.length) > 3) {
      alert("⚠️ Plan Gratuito: Máximo 3 fotos. Actualiza a PRO para ilimitadas.")
      return
    }

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type
    }))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeFile = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await createProduct(formData)
      // Redirigir al dashboard al terminar
      router.push("/dashboard/products")
      router.refresh()
    } catch (error: unknown) {
        if (error instanceof Error) {
            alert("Error: " + error.message)
        } else {
            alert("Error desconocido")
        }
    }
    setIsLoading(false)
  }

  const usageCount = previews.length
  const isLimitReached = !isPro && usageCount >= 3

  return (
    <div className="max-w-5xl mx-auto">
      <form action={handleSubmit}>

        {/* --- HEADER DE LA PÁGINA --- */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="h-10 w-10 p-0 rounded-full hover:bg-slate-100 text-slate-500"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Producto</h1>
                    <p className="text-sm text-slate-500 font-medium">Rellena la información para publicar.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="hidden sm:flex border-slate-200 text-slate-700 font-bold"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-black text-white px-6 font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Publicar Producto"}
                </Button>
            </div>
        </div>

        {/* --- TARJETA PRINCIPAL (LAYOUT 2 COLUMNAS) --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

                {/* COLUMNA IZQUIERDA: MULTIMEDIA (5/12) */}
                <div className="lg:col-span-5 p-8 bg-slate-50/50">
                    <div className="space-y-4 sticky top-8">
                        <div className="flex justify-between items-end">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon size={14} /> Multimedia
                            </Label>
                            {!isPro && (
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isLimitReached ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {usageCount} / 3 Free
                                </span>
                            )}
                        </div>

                        {/* Grid de Fotos Grande */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Botón Upload Grande */}
                            {(!isLimitReached || isPro) && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
                                >
                                    <input ref={fileInputRef} type="file" name="files" multiple accept={isPro ? "image/*,video/*" : "image/*"} className="hidden" onChange={handleFiles} />
                                    <div className="bg-slate-50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform group-hover:bg-blue-100">
                                        <UploadCloud className="text-slate-400 group-hover:text-blue-600" size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Subir Archivos</span>
                                </div>
                            )}

                            {/* Previews */}
                            {previews.map((file, i) => (
                                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
                                    {file.type.startsWith('video') ? (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white"><Video size={32} className="opacity-80"/></div>
                                    ) : (
                                        <Image
                                            src={file.url}
                                            alt={`Preview ${i}`}
                                            fill
                                            className="w-full h-full object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    )}
                                    {/* Botón Borrar siempre visible y elegante */}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute top-2 right-2 bg-white/90 backdrop-blur text-slate-500 hover:text-red-500 p-1.5 rounded-full shadow-sm transition-colors border border-slate-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    {i === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                                            Portada
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                           💡 <strong>Tip:</strong> La primera imagen será la portada de tu producto. Usa fotos cuadradas o verticales para mejores resultados.
                        </p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: DETALLES (7/12) */}
                <div className="lg:col-span-7 p-8 bg-white">
                    <div className="space-y-8 max-w-lg">

                        {/* Nombre */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Nombre del Producto</Label>
                            <Input
                                name="name" required placeholder="Ej. Hoodie Oversize Essential"
                                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-xl font-bold text-lg text-slate-900 placeholder:text-slate-400 transition-all"
                            />
                        </div>

                        {/* Precio */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Precio</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
                                <Input
                                    name="price" type="number" step="0.01" required placeholder="0.00"
                                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-xl font-bold text-xl text-slate-900 placeholder:text-slate-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Descripción</Label>
                            <Textarea
                                name="description" placeholder="Describe los detalles, materiales, tallas y cuidados..."
                                className="min-h-[200px] bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 rounded-xl p-4 text-base text-slate-700 placeholder:text-slate-400 leading-relaxed resize-none transition-all"
                            />
                        </div>

                        {/* Extra info (puedes agregar más campos aquí luego) */}
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                El producto se publicará inmediatamente en tu tienda.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
      </form>
    </div>
  )
}