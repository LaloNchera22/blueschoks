import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4">
      {/* HEADER SKELETON (Perfil) */}
      <div className="w-full max-w-md flex flex-col items-center mb-8 gap-4">
        <Skeleton className="w-24 h-24 rounded-full shadow-lg" /> {/* Avatar */}
        <div className="space-y-2 flex flex-col items-center w-full">
          <Skeleton className="h-6 w-32 rounded-full" /> {/* Title */}
          <Skeleton className="h-4 w-48 rounded-md" /> {/* Bio */}
        </div>
        <div className="flex gap-3 mt-2">
            <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* PRODUCTS SKELETON (Grid 2 Columnas estilo Instagram) */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 pb-20">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col">
             {/* Imagen Cuadrada */}
             <Skeleton className="w-full aspect-square rounded-xl mb-3" />
             
             {/* Info abajo */}
             <div className="mt-auto space-y-2">
                <Skeleton className="h-3 w-3/4 rounded" />
                <div className="flex justify-between items-center">
                   <Skeleton className="h-4 w-12 rounded" />
                   <Skeleton className="w-6 h-6 rounded-md" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}