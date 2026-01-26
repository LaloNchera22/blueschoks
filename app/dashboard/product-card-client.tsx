"use client"

import { useState, useEffect, useTransition, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Edit, Play, Grid, Square, Video, ChevronLeft, ChevronRight, RefreshCw, Image as ImageIcon } from "lucide-react"
import { deleteProduct, toggleStock } from "./actions"
import { formatCurrency } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any
}

type ViewMode = 'cover' | 'carousel' | 'collage'

export default function ProductCardClient({ product }: ProductCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cover')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingStock, setIsTogglingStock] = useState(false)

  // Lógica de "Imagen Inteligente" robusta
  const mainImage = useMemo(() => {
    // 1. Prioridad: image_url
    if (product.image_url && typeof product.image_url === 'string' && product.image_url.length > 5) {
        return product.image_url;
    }
    // 2. Prioridad: images[0]
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
    }
    // 3. Fallback a media (legacy) si existe
    if (product.media && Array.isArray(product.media) && product.media.length > 0) {
        return product.media[0];
    }
    return null;
  }, [product.image_url, product.images, product.media]);

  const mediaList = useMemo(() => {
    const list: string[] = [];

    // Start with mainImage if it exists
    if (mainImage) {
        list.push(mainImage);
    }

    // Collect all other potential images
    const candidates = [
        ...(Array.isArray(product.images) ? product.images : []),
        ...(Array.isArray(product.media) ? product.media : []),
        ...(product.image_url ? [product.image_url] : [])
    ];

    // Add unique ones
    candidates.forEach((url) => {
        if (typeof url === 'string' && url.length > 5 && !list.includes(url)) {
            list.push(url);
        }
    });

    return list;
  }, [mainImage, product.images, product.media, product.image_url]);

  const hasMedia = mediaList.length > 0

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (viewMode === 'carousel' && isPlaying && hasMedia && mediaList.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % mediaList.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [viewMode, isPlaying, hasMedia, mediaList.length])

  useEffect(() => {
    if (viewMode === 'carousel') {
      setCurrentSlide(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [viewMode])

  const handleDelete = async () => {
    setIsDeleting(true)
    startTransition(async () => {
      try {
        await deleteProduct(product.id)
        toast.success("Producto eliminado correctamente")
      } catch (error) {
        console.error(error)
        toast.error("Error al eliminar el producto")
      } finally {
        setIsDeleting(false)
      }
    })
  }

  const handleToggleStock = async () => {
    setIsTogglingStock(true)
    startTransition(async () => {
        try {
           await toggleStock(product.id)
           toast.success("Estado actualizado")
        } catch (error) {
           console.error("Error toggling stock", error)
           toast.error("Error al actualizar estado")
        } finally {
           setIsTogglingStock(false)
        }
    })
  }

  const isVideo = (url: string) => url?.includes('.mp4') || url?.includes('.webm') || url?.includes('.mov');

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % mediaList.length)
    setIsPlaying(false)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1))
    setIsPlaying(false)
  }

  return (
    <div className="group bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full relative">

      {/* Media Section */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        <Link href={`/dashboard/product/edit/${product.id}`} className="block w-full h-full">
            {hasMedia ? (
                <>
                    {viewMode === 'collage' && (
                        <div className="w-full h-full grid grid-cols-2 gap-0.5 overflow-y-auto bg-background p-0.5 absolute inset-0 z-10">
                        {mediaList.map((url: string, idx: number) => (
                            <div key={idx} className="relative aspect-square bg-muted overflow-hidden cursor-pointer hover:opacity-90" onClick={(e) => { e.preventDefault(); setViewMode('carousel'); setCurrentSlide(idx); }}>
                                {isVideo(url) ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black text-white relative">
                                        <video src={url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                        <Video size={16} className="relative z-10" />
                                    </div>
                                ) : (
                                    <Image
                                      src={url}
                                      alt="Collage"
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                )}
                            </div>
                        ))}
                        </div>
                    )}
                    {viewMode !== 'collage' && (
                        <div className="w-full h-full relative group/media">
                            {(() => {
                                const indexToShow = viewMode === 'cover' ? 0 : currentSlide;
                                const url = mediaList[indexToShow] || mediaList[0];
                                if (isVideo(url)) {
                                    return <video key={url} src={url} className="w-full h-full object-cover" autoPlay={viewMode === 'carousel'} muted loop />
                                }
                                return (
                                  <Image
                                    key={url}
                                    src={url}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                )
                            })()}

                            {/* Carousel Controls */}
                            {viewMode === 'carousel' && mediaList.length > 1 && (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-between px-2 z-20 pointer-events-none">
                                        <button onClick={prevSlide} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 pointer-events-auto transition-transform active:scale-95 shadow-lg backdrop-blur-sm h-8 w-8 flex items-center justify-center">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button onClick={nextSlide} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 pointer-events-auto transition-transform active:scale-95 shadow-lg backdrop-blur-sm h-8 w-8 flex items-center justify-center">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                                        {mediaList.map((_: string, idx: number) => (
                                            <div key={idx} className={`transition-all duration-300 rounded-full shadow-sm ${idx === currentSlide ? 'bg-white w-2 h-2 scale-110' : 'bg-white/50 w-1.5 h-1.5'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            ) : (
                // Fallback: Contenedor gris neutro con icono
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 gap-2">
                    <div className="p-4 bg-white rounded-full shadow-sm border border-slate-200">
                        <ImageIcon size={28} className="text-slate-300" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Sin imagen</span>
                </div>
            )}
        </Link>

        {/* Status Badge (Overlay) */}
        <div className="absolute top-3 left-3 z-20">
             <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${product.stock > 0 ? 'bg-green-500/90 text-white' : 'bg-slate-500/90 text-white'}`}>
                {product.stock > 0 ? 'Disponible' : 'Agotado'}
             </div>
        </div>

        {/* View Mode Switcher (Overlay, only show if multiple media) */}
        {mediaList.length > 1 && (
             <div className="absolute top-3 right-3 z-20 flex gap-1 bg-black/30 backdrop-blur-sm p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.preventDefault(); setViewMode('cover'); }}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'cover' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                    title="Portada"
                >
                    <Square size={12} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); setViewMode('carousel'); }}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'carousel' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                    title="Carrusel"
                >
                    <Play size={12} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); setViewMode('collage'); }}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'collage' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                    title="Collage"
                >
                    <Grid size={12} />
                </button>
             </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/dashboard/product/edit/${product.id}`} className="hover:underline decoration-1 underline-offset-4 decoration-muted-foreground/50">
              <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1" title={product.name}>
                  {product.name}
              </h3>
            </Link>
            <span className="font-medium text-sm text-foreground whitespace-nowrap">
                {formatCurrency(product.price)}
            </span>
          </div>

          {/* Controls */}
          <div className="mt-auto flex items-center justify-between gap-4 pt-2 border-t border-border/40">

              {/* Toggle Switch */}
              <div className="flex items-center gap-2">
                  <Switch
                      checked={product.stock > 0}
                      onCheckedChange={handleToggleStock}
                      disabled={isTogglingStock || isPending}
                      className="scale-90 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-200"
                  />
                  <span className={`text-xs font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                      {product.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link href={`/dashboard/product/edit/${product.id}`}>
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50">
                        <Edit size={18} />
                    </Button>
                </Link>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50">
                            {isDeleting ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                         </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás segura de eliminar este producto?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción eliminará permanentemente el producto &quot;{product.name}&quot;. No se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
          </div>
      </div>
    </div>
  )
}
