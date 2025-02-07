"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/db";

// Define Courses Type 
interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  detailed_description: string;
  thumbnail_link: string;
  video_link: string;
  resource_link: string;
  created_at: string;
}

// Define Context Type
interface ResourceContextType {
  courses: Course[]; 
  loading: boolean;
  refreshCources: () => Promise<void>;
  Finalcourses: any;
  setFinalcourses: any;

}

// Create Context with Default Values
const CourseContext = createContext<ResourceContextType>({
  courses: [],
  loading: true,
  refreshCources: async () => {},
  Finalcourses: [],
  setFinalcourses: () => {},
});

// Provider Component
export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [Finalcourses, setFinalcourses] = useState<any>([]);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resources:", error.message);
    } else {
      setCourses(data || []);
    }
    setFinalcourses(data || []);
    setLoading(false);
  };

  // Function to manually refresh courses
  const refreshCources = async () => {
    await fetchCourses();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ courses, loading, refreshCources, Finalcourses, setFinalcourses }}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use resources
export const useCourses = () => useContext(CourseContext);
