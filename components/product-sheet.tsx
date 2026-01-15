"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Plus, X, Loader2, Image as ImageIcon, Trash2, UploadCloud, Video, ArrowLeft } from "lucide-react"
import { createProduct } from "@/app/dashboard/products/actions"
import Image from "next/image"

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  media?: string[];
  image_url?: string;
  [key: string]: unknown;
}

export default function ProductSheet({ isPro = false, productToEdit, trigger }: { isPro?: boolean, productToEdit?: Product, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previews, setPreviews] = useState<{url: string, type: string}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formDataState, setFormDataState] = useState({
    name: "",
    price: "",
    description: ""
  })

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormDataState({
          name: productToEdit.name || "",
          price: productToEdit.price?.toString() || "",
          description: productToEdit.description || ""
        })
        const media = productToEdit.media || (productToEdit.image_url ? [productToEdit.image_url] : [])
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviews(media.map((url: string) => ({ url, type: 'image' })))
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormDataState({ name: "", price: "", description: "" })
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviews([])
      }
    }
  }, [isOpen, productToEdit])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!isPro && (previews.length + files.length) > 3) {
      alert("⚠️ Plan Gratuito: Máximo 3 archivos.")
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
      setIsOpen(false)
      setPreviews([])
      setFormDataState({ name: "", price: "", description: "" })
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger ? trigger : (
            <button className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95">
              <Plus size={18} strokeWidth={3} />
              <span>Nuevo Producto</span>
            </button>
        )}
      </SheetTrigger>
      
      {/* CAMBIO 1: h-[100dvh] asegura el alto total del viewport dinámico. 
          p-0 para quitar padding nativo y controlarlo dentro.
      */}
      <SheetContent side="right" className="w-full sm:max-w-4xl sm:w-[900px] p-0 bg-slate-50/50 border-l border-slate-200 flex flex-col h-[100dvh] outline-none">
        
        <form action={handleSubmit} className="flex flex-col h-full overflow-hidden">
            
            {/* HEADER: shrink-0 evita que se aplaste */}
            <SheetHeader className="px-6 py-4 border-b border-slate-200 bg-white flex flex-row items-center justify-between space-y-0 shrink-0">
                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden shrink-0 text-slate-500">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <SheetTitle className="text-lg font-black text-slate-900 tracking-tight">
                            {productToEdit ? "Editar Producto" : "Nuevo Producto"}
                        </SheetTitle>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isPro && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isLimitReached ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {usageCount} / 3 Free
                        </span>
                    )}
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 hidden md:flex rounded-full hover:bg-slate-100 h-8 w-8">
                            <X size={18} />
                        </Button>
                    </SheetClose>
                </div>
            </SheetHeader>

            {/* CONTENIDO PRINCIPAL: flex-1 y overflow-hidden para que NO crezca más allá de la pantalla */}
            <div className="flex-1 p-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                    
                    {/* COLUMNA IZQUIERDA: overflow-y-auto por si hay muchas imágenes, pero contenido contenido */}
                    <div className="md:col-span-5 flex flex-col gap-3 h-full overflow-y-auto pr-1">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 shrink-0">
                            <ImageIcon size={14} /> Multimedia
                        </Label>

                        <div className="grid grid-cols-2 gap-3 auto-rows-min">
                             {/* Botón Upload */}
                             {(!isLimitReached || isPro) && (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all group w-full"
                                >
                                    <input ref={fileInputRef} type="file" name="files" multiple accept={isPro ? "image/*,video/*" : "image/*"} className="hidden" onChange={handleFiles} />
                                    <div className="bg-slate-50 p-2 rounded-full mb-1 group-hover:scale-110 transition-transform group-hover:bg-blue-100">
                                        <UploadCloud className="text-slate-400 group-hover:text-blue-600" size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600">Subir</span>
                                </div>
                            )}

                             {/* Previews */}
                            {previews.map((file, i) => (
                                <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm group w-full">
                                    {file.type.startsWith('video') ? (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white"><Video size={20} className="opacity-80"/></div>
                                    ) : (
                                        <Image
                                            src={file.url}
                                            alt={`Preview ${i}`}
                                            fill
                                            className="w-full h-full object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => removeFile(i)} 
                                        className="absolute top-1 right-1 bg-white/90 backdrop-blur text-slate-500 hover:text-red-500 p-1 rounded-full shadow-sm transition-colors border border-slate-100 z-10"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: h-full y flex-col es la CLAVE */}
                    <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 h-full overflow-hidden">
                        
                        <div className="space-y-1.5 shrink-0">
                            <Label className="text-xs font-bold text-slate-700">Nombre</Label>
                            <Input name="name" required placeholder="Ej. Camiseta Premium" defaultValue={formDataState.name} className="h-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-100 rounded-lg font-bold text-slate-900 text-sm" />
                        </div>

                        <div className="space-y-1.5 shrink-0">
                            <Label className="text-xs font-bold text-slate-700">Precio</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                <Input name="price" type="number" step="0.01" required placeholder="0.00" defaultValue={formDataState.price} className="pl-7 h-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-100 rounded-lg font-bold text-base text-slate-900" />
                            </div>
                        </div>

                        {/* DESCRIPCIÓN: flex-1 para ocupar TODO el espacio restante y h-full en el textarea */}
                        <div className="space-y-1.5 flex flex-col flex-1 min-h-0">
                            <Label className="text-xs font-bold text-slate-700">Descripción</Label>
                            <Textarea 
                                name="description" 
                                placeholder="Detalles del producto..." 
                                defaultValue={formDataState.description} 
                                className="flex-1 w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-100 rounded-lg p-3 text-sm text-slate-700 resize-none leading-relaxed h-full" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER: shrink-0 para que siempre se vea abajo */}
            <SheetFooter className="px-6 py-4 border-t border-slate-200 bg-white shrink-0 flex-row gap-3 justify-end sm:justify-end">
                <SheetClose asChild>
                    <Button variant="outline" type="button" className="flex-1 sm:flex-none border-slate-200 font-bold text-slate-700 h-10">Cancelar</Button>
                </SheetClose>
                <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none bg-slate-900 hover:bg-black text-white font-bold shadow-md active:scale-95 transition-all px-8 h-10">
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (productToEdit ? "Guardar" : "Publicar")}
                </Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}