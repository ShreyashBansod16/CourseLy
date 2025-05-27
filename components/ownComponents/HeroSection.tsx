"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Code, Paintbrush, Rocket, Sparkles, Award, Clock, Users, Pointer } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeSections() {
  const featuredCourses = [
    { title: "Web Development", lessons: 42, icon: <Code className="h-6 w-6" />, students: "1.2k" },
    { title: "UI/UX Design", lessons: 35, icon: <Paintbrush className="h-6 w-6" />, students: "890" },
    { title: "Career Boost", lessons: 28, icon: <Rocket className="h-6 w-6" />, students: "2.1k" },
  ];
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative px-4 py-24 sm:px-6 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary"
            >
              <Sparkles className="h-4 w-4" />
              Trending Learning Platform 2025
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            Master New Skills with
            <span className="ml-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Expert Courses
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Join <span className="font-semibold text-primary">250,000+</span> learners worldwide
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto relative overflow-hidden group"
              onClick={()=>router.push('/courses/allcourses')}
            >
              <span className="relative z-10">Start Learning Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            
            <div className="relative w-full sm:w-96">
              <Input
                type="search" 
                readOnly
                placeholder="View all courses..."
                className="h-12 w-full pl-12 pr-4 backdrop-blur-sm bg-background/50"
              />
              <BookOpen className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
            </div>
          </motion.div>

          {/* Floating Achievements */}
          <motion.div 
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { icon: <Award />, title: "Expert Tutors", value: "200+" },
              { icon: <Clock />, title: "Hours Content", value: "10k+" },
              { icon: <Users />, title: "Students", value: "250k+" },
              { icon: <Sparkles />, title: "Courses", value: "5k+" },
            ].map((item, index) => (
              <div 
                key={item.title}
                className="rounded-xl border p-4 backdrop-blur-sm bg-background/50 hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary">{item.icon}</span>
                  <div>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Animated Featured Courses */}
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
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden hover:border-primary/20 hover:bg-accent/10 transition-all h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <span className="rounded-lg bg-primary/10 p-2 text-primary">
                        {course.icon}
                      </span>
                      <div className="text-left">
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-4">
                          <span>{course.lessons} lessons</span>
                          <span className="flex items-center gap-1">
                            👨🎓 {course.students}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Glowing Resources Section */}
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg border bg-background p-6 transition-all hover:border-primary/20 hover:bg-accent/10 group"
              >
                <div className="absolute -inset-1 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{resource}</h3>
                <p className="mt-2 text-muted-foreground">
                  Free {resource.toLowerCase()} to boost your learning
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Testimonials */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border p-8 md:p-12 bg-gradient-to-br from-primary/5 to-primary/10"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  What Our Users Say
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Join thousands of satisfied learners who transformed their careers
                </p>
              </div>
              <div className="space-y-8">
                {[
                  {
                    text: "The courses here completely changed my career trajectory. Best investment ever!",
                    author: "Abusha Ansari",
                    role: "Senior Developer"
                  },
                  {
                    text: "Incredible quality of content and support. 10/10 recommended!",
                    author: "Daksh Mehta",
                    role: "UX Designer"
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="rounded-xl bg-background p-6 shadow-sm"
                  >
                    <p className="text-lg font-medium">"{testimonial.text}"</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}