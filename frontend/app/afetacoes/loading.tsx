import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-10 w-full mb-6" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
