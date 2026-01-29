'use client'

import { useState, useRef, useEffect } from 'react'
import { addProduct } from '@/app/actions' 
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Props {
  isPro?: boolean
}

export default function AddProductModal({ isPro = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // ESTADO PARA ACUMULAR LAS FOTOS (Array de Archivos)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) 
  const [previews, setPreviews] = useState<string[]>([]) 
  const previewsRef = useRef<string[]>([])

  // Sincronizar ref con state para limpieza al desmontar
  useEffect(() => {
    previewsRef.current = previews
  }, [previews])

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      previewsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- 1. FUNCIÓN PARA AGREGAR FOTOS (SIN REEMPLAZAR) ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    // Convertimos los nuevos archivos a Array
    let newFiles = Array.from(e.target.files)

    // RESTRICCIÓN FREE: Si la suma total supera 3
    if (!isPro && (selectedFiles.length + newFiles.length) > 3) {
      alert("⚠️ PLAN GRATUITO: Máximo 3 fotos en total.\n\nMejora a PRO para subir ilimitadas.")
      // Calculamos cuántas caben
      const slotsLeft = 3 - selectedFiles.length
      if (slotsLeft <= 0) return // No caben más
      newFiles = newFiles.slice(0, slotsLeft) // Tomamos solo las que caben
    }

    // ACUMULAMOS: Las viejas + Las nuevas
    const combinedFiles = [...selectedFiles, ...newFiles]
    setSelectedFiles(combinedFiles)

    // GENERAMOS PREVIEWS SOLO PARA LAS NUEVAS
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])

    // LIMPIAMOS EL INPUT (Para que el usuario pueda seleccionar la misma foto si se equivocó)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // --- 2. FUNCIÓN PARA QUITAR UNA FOTO INDIVIDUAL ---
  const removeImage = (indexToRemove: number) => {
    // Revocar la URL específica
    URL.revokeObjectURL(previews[indexToRemove])

    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove)
    setSelectedFiles(updatedFiles)
    
    // Actualizamos previews filtrando
    setPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // --- 3. ENVÍO DEL FORMULARIO ---
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (selectedFiles.length === 0) {
      alert("Debes subir al menos una imagen.")
      return
    }

    setLoading(true)
    
    const formData = new FormData(event.currentTarget)
    
    // TRUCO IMPORTANTE:
    // El input file original solo tiene la "última selección" o está vacío.
    // Borramos lo que tenga y agregamos MANUALMENTE nuestra lista acumulada.
    formData.delete('image') 
    selectedFiles.forEach(file => {
      formData.append('image', file)
    })
    
    const result = await addProduct(formData)
    
    setLoading(false)
    
    if (result?.success) {
      setIsOpen(false)
      // Revocar todas las URLs antes de limpiar el estado
      previews.forEach(url => URL.revokeObjectURL(url))
      setSelectedFiles([]) // Limpiar memoria
      setPreviews([])
      router.refresh() 
    } else {
      alert(result?.error || 'Ocurrió un error')
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#1a1a8e] text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#2a2a9e] transition shadow-lg flex items-center gap-2"
      >
        <span>+ Nuevo Producto</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:p-4">
          <div className="bg-white w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex-none flex items-center justify-between p-4 border-b bg-white">
                <h2 className="text-xl font-black text-[#1a1a8e] uppercase tracking-tight">
                  Subir Producto
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-red-500 font-bold p-2"
                >
                  ✕
                </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

               {/* Body - Scrollable */}
               <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 <p className="text-xs font-bold text-gray-400 mb-2 uppercase">
                   {isPro
                     ? '📸 Fotos Ilimitadas habilitadas'
                     : `📸 Plan Gratuito: ${selectedFiles.length}/3 fotos`
                   }
                 </p>

                 {/* ÁREA DE IMÁGENES */}
                 <div className="space-y-2">
                    {/* PREVISUALIZACIÓN (GRID CON BOTÓN DE BORRAR) */}
                    {previews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {previews.map((src, idx) => (
                          <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 group">
                            <Image
                                src={src}
                                alt="Preview"
                                fill
                                className="object-cover w-full h-full"
                                sizes="(max-width: 768px) 33vw, 20vw"
                            />
                            {/* Botón X para borrar foto individual */}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition shadow-md z-10"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* BOTÓN DE SUBIDA */}
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#1a1a8e]/50 transition cursor-pointer relative group">
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="image_input_dummy" // Nombre dummy, no lo usamos para enviar
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="space-y-1 pointer-events-none">
                        <span className="text-2xl">📸</span>
                        <p className="text-xs font-bold text-gray-500 uppercase">
                          {previews.length > 0 ? '+ Agregar más fotos' : 'Toca para subir fotos'}
                        </p>
                      </div>
                    </div>
                 </div>

                 {/* INPUTS DE TEXTO */}
                 <input
                   name="name"
                   placeholder="Nombre del producto"
                   required
                   className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1a8e] font-bold"
                 />

                 <div className="relative">
                   <span className="absolute left-4 top-2 text-gray-400 font-bold">$</span>
                   <input
                     name="price"
                     type="number"
                     placeholder="0.00"
                     step="0.01"
                     required
                     className="w-full p-2 pl-8 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1a8e] font-bold"
                   />
                 </div>

                 <textarea
                   name="description"
                   placeholder="Descripción breve..."
                   rows={3}
                   className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1a8e] font-medium text-sm"
                 />
               </div>

               {/* Footer - Fixed Bottom within Flex */}
               <div className="flex-none p-4 border-t bg-white">
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full bg-[#1a1a8e] text-white font-black py-4 rounded-xl hover:bg-[#2a2a9e] transition uppercase tracking-widest disabled:opacity-50"
                 >
                   {loading ? 'Subiendo...' : 'Publicar Producto'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}