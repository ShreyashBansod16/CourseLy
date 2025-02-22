"use client";
import { useState } from "react";
import { useCourses } from "@/app/context/CourseContext";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

export function CourseGrid() {
  const { courses, loading, Finalcourses, setFinalcourses, refreshCources } =
    useCourses();
  const [search, setSearch] = useState("");

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
