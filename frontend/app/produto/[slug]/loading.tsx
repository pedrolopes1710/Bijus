import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Skeleton className="aspect-square rounded-lg" />

          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-3/4" />
            </div>

            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-20 w-full" />

            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>

            <div className="border-t pt-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
