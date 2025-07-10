import { Suspense } from "react";
import { FieldSearch } from "@/components/field-search";
import { FieldList } from "@/components/field-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function FieldsPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Browse All Fields</h1>

      <FieldSearch />

      <Suspense fallback={<FieldListSkeleton />}>
        <FieldList />
      </Suspense>
    </div>
  );
}

function FieldListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
