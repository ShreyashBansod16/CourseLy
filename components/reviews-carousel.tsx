"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Star, Quote } from "lucide-react";
import { useSession } from "next-auth/react";

export type Review = {
  id: string;
  course_id: string | null;
  user_name: string | null;
  rating: number;
  comment: string;
  created_at: string;
};

export default function ReviewsCarousel({ courseId }: { courseId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const pausedRef = useRef<boolean>(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const qs = courseId ? `?course_id=${encodeURIComponent(courseId)}` : "";
      const res = await fetch(`/api/reviews${qs}`);
      const json = await res.json();
      if (res.ok) setReviews(json.reviews || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  // Auto-scroll horizontally with requestAnimationFrame for smooth motion
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return; // Respect users who prefer reduced motion

    let last = performance.now();
    const speed = 40; // px per second (tweak for taste)

    const step = (now: number) => {
      if (pausedRef.current) {
        last = now;
      } else {
        const dt = (now - last) / 1000;
        const max = el.scrollWidth - el.clientWidth;
        const next = el.scrollLeft + speed * dt;
        el.scrollLeft = next >= max - 1 ? 0 : next; // loop seamlessly
        last = now;
      }
      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);

    const onEnter = () => { pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    };
  }, [reviews.length]);

  // Submit review dialog
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const submitReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId || null,
          user_email: (session as any)?.user?.email,
          user_name: (session as any)?.user?.name || (session as any)?.user?.email,
          rating,
          comment,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to submit review");
      setComment("");
      setRating(5);
      setOpen(false);
      fetchReviews();
    } catch (e: any) {
      alert(e?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Community Reviews</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">What learners say about us</p>
        </div>
        {isLoggedIn && (
          <Button onClick={() => setOpen(true)} className="hidden sm:inline-flex">Write a Review</Button>
        )}
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-3 sm:pb-4 -mx-3 sm:-mx-2 px-3 sm:px-2 scrollbar-thin scrollbar-thumb-muted-foreground/30"
        >
          {loading && (
            <div className="text-muted-foreground">Loading reviews...</div>
          )}
          {!loading && reviews.length === 0 && (
            <div className="w-full" aria-live="polite">
              <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-accent/20 p-6 sm:p-10 text-center">
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Quote className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-semibold">No reviews yet</h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md">Be the first to share your experience and help others choose better.</p>
                  <div className="mt-2">
                    {isLoggedIn ? (
                      <Button onClick={() => setOpen(true)}>Write a Review</Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const cb = encodeURIComponent(window.location.pathname + window.location.search);
                          window.location.href = `/user/login?callbackUrl=${cb}`;
                        }}
                      >
                        Login to write a review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {reviews.map((t, i) => (
            <div
              key={t.id}
              className="snap-center min-w-[240px] sm:min-w-[320px] md:min-w-[400px] rounded-2xl border bg-background p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Quote className="h-5 w-5" />
                <span className="text-sm font-medium">Review</span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed">{t.comment}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {(t.user_name || "U").split(" ").map((s)=>s[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold">{t.user_name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {stars.map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= t.rating ? "fill-yellow-500" : "opacity-30"}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog for writing a review */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="mt-2 flex gap-2">
                {stars.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`p-1 rounded ${s <= rating ? "text-yellow-500" : "text-muted-foreground"}`}
                    aria-label={`Set rating ${s}`}
                  >
                    <Star className={`h-6 w-6 ${s <= rating ? "fill-yellow-500" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comment</label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submitReview} disabled={submitting || !comment.trim()}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
