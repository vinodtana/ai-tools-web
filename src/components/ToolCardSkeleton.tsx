import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ToolCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          {/* Title Skeleton */}
          <Skeleton className="h-7 w-3/4 mb-2" />
          
          {/* Tagline Skeleton */}
          <Skeleton className="h-4 w-1/2 mb-4" />
          
          {/* Description Skeleton (3 lines) */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
};

export default ToolCardSkeleton;
