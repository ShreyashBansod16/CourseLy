"use client";
import { CourseCard } from "@/components/course-card"

const courses = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=200&width=300",
    title: "Introduction to React",
    description: "Learn the basics of React and build your first application.",
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=200&width=300",
    title: "Advanced JavaScript",
    description: "Deep dive into advanced JavaScript concepts and patterns.",
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=200&width=300",
    title: "CSS Mastery",
    description: "Master CSS and create beautiful, responsive layouts.",
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg?height=200&width=300",
    title: "HTML Mastery",
    description: "Master CSS and create beautiful, responsive layouts.",
  },
  {
    id: 5,
    imageUrl: "/placeholder.svg?height=200&width=300",
    title: "JS Mastery",
    description: "Master CSS and create beautiful, responsive layouts.",
  },
  {
    id: 6,
    imageUrl: "/placeholder.svg?height=200&width=300",
    title: "Tailwind Mastery",
    description: "Master CSS and create beautiful, responsive layouts.",
  }
]

export function CourseGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
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
  )
}

