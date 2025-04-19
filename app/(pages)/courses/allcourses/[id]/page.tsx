"use client"
import { useCourses } from "@/app/context/CourseContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SharedCoursePage() {
    const courseId = useParams().id;
    const { Finalcourses } = useCourses();
    const [isLoading, setIsLoading] = useState(true);
    const displayCourse = Finalcourses.find((course: any) => course.id === courseId);

    useEffect(() => {
        // Simulate loading delay or wait for data to be available
        if (displayCourse) {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000); // Fallback in case course isn't found
            return () => clearTimeout(timer);
        }
    }, [displayCourse]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background text-foreground">
                <div className="animate-pulse flex flex-col items-center space-y-4 w-full max-w-2xl">
                    <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-full p-6 border rounded-lg shadow-md space-y-4 bg-card border-border">
                        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex space-x-4 justify-evenly">
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!displayCourse) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background text-foreground">
                <div className="mt-4 p-6 border rounded-lg shadow-md w-full max-w-2xl bg-card text-card-foreground border-border text-center">
                    <h2 className="text-2xl font-semibold mb-3">Course Not Found</h2>
                    <p className="text-muted-foreground">The requested course could not be loaded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background text-foreground">
            <h1 className="text-4xl font-bold mb-4">{displayCourse.title}</h1>
            <div className="mt-4 p-6 border rounded-lg shadow-md w-full max-w-2xl bg-card text-card-foreground border-border">
                <p className="text-muted-foreground mb-4 text-center">{displayCourse.description}</p>
                <p className="text-muted-foreground mb-4">{displayCourse.detailed_description}</p>
                <p className="text-primary font-medium mb-4">Price: ${displayCourse.price}</p>
                <img 
                    src={displayCourse.thumbnail_link} 
                    alt="Course Thumbnail" 
                    className="w-full h-auto rounded-lg mb-4 border border-border" 
                />
                <div className="flex space-x-4 mb-4 justify-evenly">
                    <a 
                        href={displayCourse.video_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                        Watch Video
                    </a>
                    <a 
                        href={displayCourse.resource_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                        View Resources
                    </a>
                </div>
                <p className="text-muted-foreground text-sm font-bold text-center">
                    Created At: {new Date(displayCourse.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}