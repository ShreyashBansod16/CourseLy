// Central place to update homepage content
// Edit the values below; no code changes needed elsewhere

export const HERO = {
  badge: "Trending Learning Platform 2025",
  titlePrefix: "Master New Skills with",
  titleGradient: "Expert Courses",
  subtitle: "Join 250,000+ learners worldwide",
  ctaText: "Start Learning Free",
  ctaHref: "/courses/allcourses",
  searchPlaceholder: "View all courses...",
};

export type HomeMetric = {
  icon: "award" | "clock" | "users" | "sparkles";
  title: string;
  value: string;
};

export const HOME_METRICS: HomeMetric[] = [
  { icon: "award", title: "Expert Tutors", value: "200+" },
  { icon: "clock", title: "Hours Content", value: "10k+" },
  { icon: "users", title: "Students", value: "250k+" },
  { icon: "sparkles", title: "Courses", value: "5k+" },
];

export type FeaturedCourse = {
  title: string;
  lessons: number;
  students: string; // e.g., "1.2k"
  icon: "code" | "paintbrush" | "rocket";
};

export const HOME_FEATURED_COURSES: FeaturedCourse[] = [
  { title: "Web Development", lessons: 42, students: "1.2k", icon: "code" },
  { title: "UI/UX Design", lessons: 35, students: "890", icon: "paintbrush" },
  { title: "Career Boost", lessons: 28, students: "2.1k", icon: "rocket" },
];
