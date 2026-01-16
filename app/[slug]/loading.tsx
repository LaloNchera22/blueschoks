import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-6">
      {/* HEADER SKELETON */}
      <div className="w-full max-w-md flex flex-col items-center mb-8 gap-4">
        <Skeleton className="w-24 h-24 rounded-full shadow-lg" /> {/* Avatar */}
        <div className="space-y-2 flex flex-col items-center w-full">
          <Skeleton className="h-8 w-48 rounded-md" /> {/* Title */}
          <Skeleton className="h-4 w-64 rounded-md" /> {/* Bio */}
        </div>
        <div className="flex gap-3 mt-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* PRODUCTS SKELETON */}
      <div className="w-full max-w-md flex flex-col gap-4 pb-20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-0 overflow-hidden shadow-sm border border-gray-100 h-32 flex">
             <Skeleton className="w-1/3 h-full" /> {/* Image */}
             <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
