import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square overflow-hidden relative bg-gray-100">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-1/2 rounded" />
          <div className="flex items-center gap-2 min-h-[16px]">
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
