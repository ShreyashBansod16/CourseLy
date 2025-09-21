import { CourseGrid } from "@/components/course-grid";
import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading courses…</div>}>
      <CourseGrid />
    </Suspense>
  );
}

export default page;
