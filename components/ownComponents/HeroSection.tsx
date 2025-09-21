"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Code, Paintbrush, Rocket, Sparkles, Award, Clock, Users, Pointer, Star, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HERO, HOME_FEATURED_COURSES, HOME_METRICS } from "@/config/home";
import ReviewsCarousel from "@/components/reviews-carousel";
import { useSession } from "next-auth/react";

export default function HomeSections() {
  // helpers to map config icon keys to actual icons
  const courseIcon = (key: "code" | "paintbrush" | "rocket") => {
    const common = "h-6 w-6";
    switch (key) {
      case "code":
        return <Code className={common} />;
      case "paintbrush":
        return <Paintbrush className={common} />;
      case "rocket":
        return <Rocket className={common} />;
    }
  };

  const metricIcon = (key: "award" | "clock" | "users" | "sparkles") => {
    const common = "h-5 w-5";
    switch (key) {
      case "award":
        return <Award className={common} />;
      case "clock":
        return <Clock className={common} />;
      case "users":
        return <Users className={common} />;
      case "sparkles":
        return <Sparkles className={common} />;
    }
  };
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [mounted, setMounted] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");
  useEffect(() => setMounted(true), []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative px-4 py-24 sm:px-6 md:py-32 overflow-hidden"
      >
        {/* Decorative background: radial glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        {/* Decorative background: animated gradient blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-primary/30 via-fuchsia-400/20 to-blue-400/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-400/20 via-emerald-300/20 to-primary/30 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        {/* Subtle grid overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" aria-hidden>
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="mx-auto max-w-6xl text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/20 px-4 py-2 text-sm text-primary backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Trending Learning Platform 2025</span>
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {HERO.titlePrefix}
            <span className="ml-2 bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
              {HERO.titleGradient}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            {HERO.subtitle.replace("250,000+", "")}<span className="font-semibold text-primary">250,000+</span> {HERO.subtitle.split("250,000+")[1] ?? "learners worldwide"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button 
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden group px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={()=>router.push(HERO.ctaHref)}
            >
              <span className="relative z-10">{HERO.ctaText}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

          </motion.div>

          <div className="my-16 h-px w-full bg-border/50" />
          
          {/* Enhanced Achievements */}
          <motion.div 
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {HOME_METRICS.map((item, index) => (
              <div 
                key={item.title}
                className="rounded-xl border p-4 backdrop-blur-sm bg-background/60 hover:bg-accent/20 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary">{metricIcon(item.icon)}</span>
                  <div>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          {/* CTA banner */}
          <div className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-blue-500/10 to-emerald-400/10 px-6 py-6 sm:px-8">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Ready to start your next skill?</h3>
                  <p className="text-sm text-muted-foreground">Dive into curated courses and resources crafted by experts.</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={()=>router.push('/courses/allcourses')}>Browse Courses</Button>
                  <Button variant="outline" onClick={()=>router.push('/resources/allresource')}>Explore Resources</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Animated Featured Courses (only for logged-in users) */}
      {mounted && (isLoggedIn ? (
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Featured Courses
          </motion.h2>
          
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {HOME_FEATURED_COURSES.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20">
                  <Card className="group relative overflow-hidden h-full rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 transition-all hover:shadow-xl hover:-translate-y-0.5">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <span className="rounded-xl bg-primary/10 p-3 text-primary shadow-inner">
                            {courseIcon(course.icon)}
                          </span>
                          <div className="text-left">
                            <CardTitle className="tracking-tight">{course.title}</CardTitle>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="rounded-full border px-2 py-1">{course.lessons} lessons</span>
                              <span className="rounded-full border px-2 py-1">👨🎓 {course.students}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      ) : (
        <section className="px-4 py-20 sm:px-6 md:py-28 bg-gradient-to-b from-background to-accent/5">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background/80 to-accent/20 p-10 sm:p-12 text-center backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  Access Required
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Please log in to view courses and resources</h2>
                <p className="max-w-2xl text-muted-foreground text-base sm:text-lg">
                  Create an account or sign in to unlock the full catalog and start learning.
                </p>
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" onClick={() => router.push("/user/login")} className="w-full sm:w-auto shadow-md hover:shadow-lg">
                    Login
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => router.push("/user/signup")} className="w-full sm:w-auto">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Glowing Resources Section (only for logged-in users) */}
      {mounted && isLoggedIn && (
      <section className="px-4 py-16 sm:px-6 md:py-24 bg-accent/10">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Learning Resources
          </motion.h2>
          
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {["eBooks", "Templates", "Quizzes", "Webinars"].map((resource, index) => (
              <motion.div
                key={resource}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20">
                  <div className="relative rounded-2xl border bg-background/60 p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{resource}</h3>
                    <p className="mt-2 text-muted-foreground">
                      Free {resource.toLowerCase()} to boost your learning
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Community Reviews */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <ReviewsCarousel />
        </div>
      </section>
    </div>
  );
}