"use client"

import { useState, useEffect, useTransition } from "react"
import Image from "next/image"
import { Trash2, Edit, Play, Grid, Image as ImageIcon, ShoppingBag, Video, ChevronLeft, ChevronRight, Square, AlertCircle } from "lucide-react"
import { deleteProduct } from "./actions"

interface ProductCardProps {
  product: any
}

type ViewMode = 'cover' | 'carousel' | 'collage'

export default function ProductCard({ product }: ProductCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cover')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false) // Empezamos pausado para evitar conflictos iniciales
  
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  // 1. LIMPIEZA DE DATOS (Filtrar URLs malas)
  const rawMedia = Array.isArray(product.media) && product.media.length > 0 
    ? product.media 
    : (product.image_url ? [product.image_url] : [])
  
  const mediaList: string[] = rawMedia.filter((url: any) => typeof url === 'string' && url.length > 5)
  const hasMedia = mediaList.length > 0

  // 2. AUTO-PLAY (Solo si el modo es carousel y está playing)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (viewMode === 'carousel' && isPlaying && hasMedia && mediaList.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % mediaList.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [viewMode, isPlaying, hasMedia, mediaList.length])

  // Resetear slide al cambiar de modo
  useEffect(() => {
    if (viewMode === 'carousel') {
      setCurrentSlide(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [viewMode])

  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás segura de eliminar este producto?")
    if (confirm) {
      setIsDeleting(true)
      startTransition(async () => {
        await deleteProduct(product.id)
        setIsDeleting(false)
      })
    }
  }

  const isVideo = (url: string) => url?.includes('.mp4') || url?.includes('.webm') || url?.includes('.mov');

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % mediaList.length)
    setIsPlaying(false) // Pausa al interactuar
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1))
    setIsPlaying(false)
  }

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col w-full">
      
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white z-10">
         <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <button 
                onClick={() => setViewMode('cover')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'cover' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                title="Portada"
            >
                <Square size={14} />
            </button>
            <button 
                onClick={() => setViewMode('carousel')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'carousel' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                title="Carrusel"
            >
                <Play size={14} />
            </button>
            <button 
                onClick={() => setViewMode('collage')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'collage' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                title="Collage"
            >
                <Grid size={14} />
            </button>
         </div>
         
         <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
            {mediaList.length} archivo{mediaList.length !== 1 && 's'}
         </span>
      </div>

      {/* ÁREA VISUAL (Altura Fija 256px) */}
      <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
        
        {/* --- LÓGICA DE VISUALIZACIÓN --- */}
        {hasMedia ? (
            <>
                {/* 1. MODO COLLAGE */}
                {viewMode === 'collage' && (
                    <div className="w-full h-full grid grid-cols-2 gap-0.5 overflow-y-auto bg-white p-0.5 absolute inset-0 z-10">
                    {mediaList.map((url, idx) => (
                        <div key={idx} className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer hover:opacity-90" onClick={() => {setViewMode('carousel'); setCurrentSlide(idx);}}>
                            {isVideo(url) ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white relative">
                                    <video src={url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                    <Video size={16} className="relative z-10" />
                                </div>
                            ) : (
                                <Image src={url} alt="Collage" fill className="object-cover" />
                            )}
                        </div>
                    ))}
                    </div>
                )}

                {/* 2. MODO CARRUSEL & PORTADA (Comparten la vista principal) */}
                {viewMode !== 'collage' && (
                    <div className="w-full h-full relative group/media">
                        {/* IMAGEN/VIDEO DE FONDO */}
                        {(() => {
                            // Si es portada, forzamos índice 0. Si es carrusel, usamos currentSlide.
                            const indexToShow = viewMode === 'cover' ? 0 : currentSlide;
                            const url = mediaList[indexToShow] || mediaList[0]; // Fallback

                            if (isVideo(url)) {
                                return (
                                    <video 
                                        key={url} // Key para forzar recarga si cambia
                                        src={url} 
                                        className="w-full h-full object-cover" 
                                        autoPlay={viewMode === 'carousel'} 
                                        muted 
                                        loop 
                                    />
                                )
                            }
                            return (
                                <Image 
                                    key={url}
                                    src={url} 
                                    alt="Product" 
                                    fill 
                                    className="object-cover transition-all duration-500" 
                                />
                            )
                        })()}

                        {/* CONTROLES CARRUSEL (Solo si viewMode === 'carousel') */}
                        {viewMode === 'carousel' && mediaList.length > 1 && (
                            <>
                                {/* Flechas */}
                                <div className="absolute inset-0 flex items-center justify-between px-2 z-20 pointer-events-none">
                                    <button onClick={prevSlide} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 pointer-events-auto transition-transform active:scale-95 shadow-lg backdrop-blur-sm">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={nextSlide} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 pointer-events-auto transition-transform active:scale-95 shadow-lg backdrop-blur-sm">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* Puntos */}
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                                    {mediaList.map((_, idx) => (
                                        <div key={idx} className={`transition-all duration-300 rounded-full shadow-sm ${idx === currentSlide ? 'bg-white w-2 h-2 scale-110' : 'bg-white/50 w-1.5 h-1.5'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </>
        ) : (
            // ESTADO SIN FOTOS
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 gap-2">
                <div className="p-3 bg-white rounded-full shadow-sm">
                    <AlertCircle size={24} className="text-slate-300" />
                </div>
                <span className="text-xs font-medium">Sin imagen</span>
            </div>
        )}
      </div>
      
      {/* INFO */}
      <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-bold text-slate-900 truncate text-lg" title={product.name}>
                  {product.name}
              </h3>
              <span className="font-black text-sm bg-slate-900 text-white px-2 py-1 rounded-lg">
                  ${product.price}
              </span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed">
              {product.description || "Sin descripción."}
          </p>
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
              <button className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                  <Edit size={14} /> Editar
              </button>
              
              <button 
                onClick={handleDelete}
                disabled={isDeleting || isPending}
                className="text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                 {isDeleting ? "..." : <Trash2 size={14} />}
                 Eliminar
              </button>
          </div>
      </div>
    </div>
  )
}