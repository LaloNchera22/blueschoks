import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationControlsProps) {
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  // Helper to build the URL for a specific page
  const createPageUrl = (page: number) => {
    // If baseUrl already has query params, append with &
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}page=${page}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        asChild={hasPrev}
      >
        {hasPrev ? (
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </span>
        )}
      </Button>

      <span className="text-sm font-medium text-slate-600">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        asChild={hasNext}
      >
        {hasNext ? (
          <Link href={createPageUrl(currentPage + 1)}>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        ) : (
          <span>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </span>
        )}
      </Button>
    </div>
  )
}
