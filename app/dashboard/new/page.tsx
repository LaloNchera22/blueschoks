'use client'

import { createProduct, State } from "./actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, PackagePlus, AlertCircle, Image as ImageIcon, X, Video, Crown, UploadCloud } from "lucide-react"
import Image from "next/image"

const initialState: State = { status: null, message: null }

export default function NewProductPage() {
  const [state, dispatch] = useActionState(createProduct, initialState)
  
  // ESTADOS PARA LA INTERFAZ
  const [isPro, setIsPro] = useState(false)
  const [previews, setPreviews] = useState<{ url: string, type: 'image' | 'video' }[]>([])
  const [files, setFiles] = useState<File[]>([]) 

  // 1. Consultar si es PRO al cargar
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
  }, [])

  // 2. Manejar selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      
      const totalFiles = files.length + newFiles.length
      
      if (!isPro && totalFiles > 3) {
        alert("El plan gratuito permite máximo 3 archivos.")
        return
      }

      const newPreviews = newFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image' as 'image' | 'video'
      }))

      setFiles([...files, ...newFiles])
      setPreviews([...previews, ...newPreviews])
    }
  }

  // 3. Eliminar archivo de la lista
  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    
    const newPreviews = [...previews]
    newPreviews.splice(index, 1)

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-[100dvh] bg-white md:relative md:h-auto md:block md:p-10 md:max-w-5xl md:mx-auto md:pb-24 md:bg-transparent md:z-auto">
      
      {/* HEADER FIXED MOBILE */}
      <div className="flex-none flex items-center gap-4 p-4 border-b border-slate-100 md:border-none md:p-0 md:mb-8 bg-white z-10">
        <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 shadow-sm transition-all">
            <ArrowLeft size={18} />
        </Link>
        <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Nuevo Producto</h1>
            <p className="text-xs md:text-base text-slate-500">Agrega fotos, videos y detalles.</p>
        </div>
      </div>

      {/* CONTENT SCROLLABLE MOBILE */}
      <div className="flex-1 overflow-y-auto md:overflow-visible md:bg-white md:rounded-2xl md:border md:border-slate-200 md:shadow-sm">
        <div className="hidden md:flex bg-slate-50/50 px-8 py-4 border-b border-slate-100 items-center gap-2 text-sm font-semibold text-slate-600">
            <PackagePlus size={16} /> Información del Producto
        </div>

        <div className="p-4 md:p-8">
            <form action={dispatch} className="flex flex-col min-h-full md:block space-y-4 md:space-y-8 max-w-3xl">
                
                {/* SECCIÓN MULTIMEDIA */}
                <div className="space-y-2 md:space-y-4">
                    <div className="flex justify-between items-end">
                        <Label className="text-sm md:text-base font-bold text-slate-900">Multimedia</Label>
                        <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-md border ${isPro ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                           {isPro ? <span className="flex items-center gap-1"><Crown size={10} /> Ilimitado (PRO)</span> : `Plan Free: ${files.length}/3 archivos`}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4">
                        {previews.map((media, index) => (
                            <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
                                {media.type === 'video' ? (
                                    <video src={media.url} className="w-full h-full object-cover" controls={false} muted />
                                ) : (
                                    <Image
                                        src={media.url}
                                        alt="Preview"
                                        fill
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 33vw, 25vw"
                                    />
                                )}
                                <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-md backdrop-blur-sm">
                                    {media.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {(!isPro && files.length >= 3) ? null : (
                            <label className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 hover:bg-slate-50 transition-all group text-slate-400 hover:text-slate-900 h-24 w-24 md:h-auto md:w-auto">
                                <UploadCloud size={20} className="mb-1 md:mb-2 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] md:text-xs font-bold">Agregar</span>
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
                    name="media" 
                    multiple 
                    className="hidden" 
                    ref={input => {
                        if (input && files.length > 0) {
                            const dataTransfer = new DataTransfer();
                            files.forEach(file => dataTransfer.items.add(file));
                            input.files = dataTransfer.files;
                        }
                    }} 
                />

                <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="name" className="text-sm md:text-base font-bold text-slate-900">Nombre del Producto</Label>
                    <Input id="name" name="name" placeholder="Ej. Tenis Deportivos" required className="h-10 md:h-12 bg-white border-slate-200" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2 md:space-y-3">
                        <Label htmlFor="price" className="text-sm md:text-base font-bold text-slate-900">Precio</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required className="pl-8 h-10 md:h-12" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="description" className="text-sm md:text-base font-bold text-slate-900">Descripción</Label>
                    <textarea id="description" name="description" rows={4} className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-slate-900" placeholder="Detalles..." />
                </div>

                {state.status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2">
                    <AlertCircle size={20} /> <span className="font-medium">{state.message}</span>
                  </div>
                )}

                {/* --- BOTONES SEPARADOS --- */}
                <div className="flex-none sticky bottom-0 bg-white p-4 border-t border-slate-100 flex items-center justify-between z-20 md:static md:p-0 md:border-t md:bg-transparent md:mt-8 md:pt-6">
                    <Link 
                        href="/dashboard" 
                        className="text-slate-500 font-bold text-sm hover:text-slate-900 px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-slate-50 transition-all"
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
          font-black text-sm md:text-base tracking-wide
          h-10 md:h-12 px-6 md:px-10 rounded-xl
          shadow-xl shadow-slate-900/20 
          transition-all duration-200
          hover:scale-[1.02] hover:shadow-slate-900/30
          active:scale-[0.98] active:shadow-sm
          disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
        "
    >
        {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
              Guardando...
            </>
        ) : (
            <>
              Guardar
            </>
        )}
    </Button>
  )
}
