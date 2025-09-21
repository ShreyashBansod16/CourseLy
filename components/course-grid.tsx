"use client";
import { useEffect, useState } from "react";
import { useCourses } from "@/app/context/CourseContext";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export function CourseGrid() {
  const { courses, loading, Finalcourses, setFinalcourses, refreshCources } =
    useCourses();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [autoOpenId, setAutoOpenId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearch(query);
    if (!query.trim()) {
      setFinalcourses(courses);
      return;
    }
    const filtered = courses.filter((course: any) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFinalcourses(filtered);
  };

  // Detect successful payment redirect and trigger auto-open
  useEffect(() => {
    const paid = searchParams.get("paid");
    const cid = searchParams.get("course_id");
    const sid = searchParams.get("session_id");
    if (paid === "1" && cid) {
      (async () => {
        try {
          // If Stripe webhook didn't run locally, confirm manually using session_id
          if (sid) {
            await fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`);
          }
        } catch {
          // ignore confirm failure; access check will handle
        } finally {
          setAutoOpenId(cid);
          // Clean URL to prevent repeated auto-open on refresh
          const url = new URL(window.location.href);
          url.searchParams.delete("paid");
          url.searchParams.delete("course_id");
          url.searchParams.delete("session_id");
          router.replace(url.pathname + (url.search ? url.search : ""));
        }
      })();
    }
  }, [searchParams, router]);

  if (loading)
    return (
      <p className="flex flex-col justify-center content-center text-center text-lg text-gray-600 dark:text-gray-300">
        Loading courses...
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md text-black 
                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          <Button onClick={refreshCources} className="py-2 px-4">
            Refresh Courses
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Finalcourses.length > 0 ? (
          Finalcourses.map((course: any) => (
            <CourseCard
              key={course.id}
              imageUrl={course.thumbnail_link}
              title={course.title}
              description={course.description}
              detailed_description={course.detailed_description}
              Link={course.video_link}
              id={course.id}
              autoOpen={autoOpenId === course.id}
            />
          ))
        ) : (
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            No courses found.
          </p>
        )}
      </div>
    </div>
  );
}
