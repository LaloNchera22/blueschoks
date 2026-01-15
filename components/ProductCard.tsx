'use client'

import { Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/app/actions" 
import { useState } from "react"
import Image from "next/image"

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    setIsDeleting(true)
    await deleteProduct(product.id)
    setIsDeleting(false)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card">
      
      {/* IMAGEN PRINCIPAL */}
      <div className="aspect-square relative bg-muted/20 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url} 
            alt={product.name}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin Foto
          </div>
        )}
        
        {/* PRECIO FLOTANTE */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          ${product.price}
        </div>
      </div>

      {/* CONTENIDO */}
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-foreground truncate leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {product.description || "Sin descripción"}
        </p>
      </CardContent>

      {/* ACCIONES (Footer) */}
      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs font-semibold hover:bg-primary hover:text-white transition-colors border-dashed"
        >
          <Edit className="w-3 h-3 mr-2" />
          Editar
        </Button>
        
        <Button 
          variant="destructive" 
          size="icon" 
          disabled={isDeleting}
          onClick={handleDelete}
          className="h-9 w-9 shrink-0"
        >
          {isDeleting ? (
            <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}