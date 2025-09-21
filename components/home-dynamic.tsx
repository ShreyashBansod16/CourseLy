import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Server component: fetch latest courses and resources
export default async function HomeDynamic() {
  // fetch top 3 latest courses
  const { data: courses } = await supabaseAdmin
    .from("courses")
    .select("id, title, description, thumbnail_link, created_at, video_link")
    .order("created_at", { ascending: false })
    .limit(3);

  // fetch top 4 latest resources
  const { data: resources } = await supabaseAdmin
    .from("resources")
    .select("id, title, description, pdf_url, created_at")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <section className="px-4 py-12 sm:px-6">
      {/* Latest Courses */}
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Courses</h2>
          <Link href="/courses/allcourses" className="text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(courses || []).map((c) => (
            <div key={c.id} className="rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.thumbnail_link || "/placeholder.svg"}
                alt={c.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="pt-1">
                  <Link
                    href="/courses/allcourses"
                    className="text-sm text-primary hover:underline"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {courses?.length === 0 && (
            <p className="text-muted-foreground">No courses yet.</p>
          )}
        </div>
      </div>

      {/* Latest Resources */}
      <div className="mx-auto max-w-6xl mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Resources</h2>
          <Link href="/resources/allresource" className="text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {(resources || []).map((r) => (
            <div key={r.id} className="rounded-xl border p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold line-clamp-1">{r.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{r.description}</p>
              <div className="pt-2">
                <a
                  href={r.pdf_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View PDF
                </a>
              </div>
            </div>
          ))}
          {resources?.length === 0 && (
            <p className="text-muted-foreground">No resources yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
