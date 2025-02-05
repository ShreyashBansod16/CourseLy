"use client";
import { useCourses } from "@/app/context/CourseContext";
import { CourseCard } from "@/components/course-card";
import { useEffect, useState } from "react";

export function CourseGrid() {
  const { courses, loading, refreshCources } = useCourses();
  const [Finalcourses, setFinalcourses] = useState<any>([]);
  console.log(courses)

  useEffect(() => {
    setFinalcourses(courses);
  }, [courses]);

  if (loading)
    return (
      <p className="flex flex-col justify-center content-center text-center text-lg text-gray-600 dark:text-gray-300">
        Loading courses...
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Finalcourses.map((course: any) => (
          <CourseCard
            key={course.id}
            imageUrl={course.imageUrl}
            title={course.title}
            description={course.description}
            onView={() => console.log(`View course: ${course.title}`)}
            onBuy={() => console.log(`Buy course: ${course.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
