"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";

interface CourseCardProps {
  imageUrl: string;
  title: string;
  description: string;
  detailed_description: string;
  Link: string;
  id: string;
  autoOpen?: boolean;
}

export function CourseCard({
  imageUrl,
  title,
  description,
  detailed_description,
  Link,
  id,
  autoOpen,
}: CourseCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const sp = useSearchParams();

  // Parse possible playlist: split on newlines/commas and trim. Support optional label before a pipe.
  type VideoEntry = { label: string; url: string };
  const videoEntries = useMemo<VideoEntry[]>(() => {
    if (!Link) return [];
    const raw = Link.split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return raw.map((item, idx) => {
      const parts = item.split("|");
      if (parts.length >= 2) {
        const label = parts[0].trim();
        const url = parts.slice(1).join("|").trim();
        return { label: label || `Video ${idx + 1}`, url };
      }
      return { label: `Video ${idx + 1}`, url: item };
    });
  }, [Link]);

  const toEmbed = (raw: string) => {
    if (!raw) return { type: "none" as const };
    const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i.exec(raw);
    if (yt && yt[1]) {
      return { type: "youtube" as const, src: `https://www.youtube.com/embed/${yt[1]}` };
    }
    const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/i.exec(raw);
    if (vimeo && vimeo[1]) {
      return { type: "vimeo" as const, src: `https://player.vimeo.com/video/${vimeo[1]}` };
    }
    return { type: "file" as const, src: raw };
  };

  // Best-effort thumbnail for playlist preview
  const getThumb = (raw: string): string => {
    const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i.exec(raw);
    if (yt && yt[1]) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
    // Generic placeholder
    return "/placeholder.svg";
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = videoEntries[currentIndex]?.url || "";
  const embed = useMemo(() => toEmbed(current), [current]);
  const [paying, setPaying] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [priceLoading, setPriceLoading] = useState<boolean>(true);
  const [basePriceCents, setBasePriceCents] = useState<number | null>(null);
  const [discountPriceCents, setDiscountPriceCents] = useState<number | null>(null);
  const [remainingDiscounted, setRemainingDiscounted] = useState<number>(0);
  const [discountActive, setDiscountActive] = useState<boolean>(false);
  const formatINR = (cents: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(cents / 100);

  // If redirected back with a successful purchase, auto-open videos after confirming access
  useEffect(() => {
    // If URL contains paid=1 for this course, optimistically set access so the button shows 'Watch Videos'
    try {
      const paid = sp?.get('paid') === '1';
      const courseIdFromUrl = sp?.get('course_id');
      if (paid && courseIdFromUrl === id) {
        setHasAccess(true);
      }
    } catch {}

    // Fetch pricing from backend (DB-based) and check access on mount
    (async () => {
      try {
        setPriceLoading(true);
        const priceRes = await fetch(`/api/course-pricing?course_id=${encodeURIComponent(id)}`);
        const priceJson = await priceRes.json();
        if (priceRes.ok) {
          setBasePriceCents(priceJson.base_price_cents);
          setDiscountPriceCents(priceJson.discounted_price_cents);
          setRemainingDiscounted(priceJson.remaining_discounted);
          setDiscountActive(Boolean(priceJson.is_discount_active));
        }
        const res = await fetch(`/api/access?course_id=${encodeURIComponent(id)}`);
        const json = await res.json();
        if (res.ok && json?.hasAccess) setHasAccess(true);
      } catch {}
      finally { setPriceLoading(false); }
    })();

    if (!autoOpen) return;
    (async () => {
      try {
        const accessRes = await fetch(`/api/access?course_id=${encodeURIComponent(id)}`);
        const accessJson = await accessRes.json();
        if (accessRes.ok && accessJson?.hasAccess) {
          setCurrentIndex(0);
          setVideoOpen(true);
          setHasAccess(true);
        }
      } catch {
        // ignore
      }
    })();
  }, [autoOpen, id, sp]);

  return (
    <>
      <Card className="flex flex-col overflow-hidden border border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:shadow-xl transition-all duration-300 rounded-xl max-w-[680px] w-full mx-auto">
        {/* Upper: Thumbnail */}
        <div className="w-full">
          <AspectRatio ratio={21 / 9}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Overlay gradient + title */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex">
              <span className="truncate max-w-full text-white/95 text-sm sm:text-base font-semibold drop-shadow-md bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                {title}
              </span>
            </div>
          </AspectRatio>
        </div>

        {/* Lower: Content */}
        <CardContent className="flex-1 p-3 sm:p-4 flex flex-col gap-3">
          <div>
            <p className="text-[13px] sm:text-sm text-muted-foreground mb-1.5 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Price + Buttons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr] items-stretch gap-2">
            {!hasAccess && (
              <div className="w-full flex items-center justify-between rounded-lg border p-2 bg-background/50 text-xs sm:text-sm">
                <div className="flex items-baseline gap-2">
                  {priceLoading ? (
                    <span className="text-muted-foreground">Loading price…</span>
                  ) : (
                    <>
                      {discountActive && discountPriceCents != null ? (
                        <>
                          <span className="text-muted-foreground line-through">
                            {basePriceCents != null ? formatINR(basePriceCents) : ''}
                          </span>
                          <span className="font-semibold text-foreground">
                            {formatINR(discountPriceCents)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {basePriceCents != null ? formatINR(basePriceCents) : ''}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {discountActive && remainingDiscounted > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-600/15 text-emerald-600 border border-emerald-600/30 whitespace-nowrap">
                    {remainingDiscounted} seats left
                  </span>
                )}
              </div>
            )}
            <Button
              onClick={() => setDetailsOpen(true)}
              variant="outline"
              className="flex-1 sm:flex-none sm:w-full h-9 px-3 text-sm rounded-lg"
            >
              View Details
            </Button>
            <Button
              onClick={async () => {
                try {
                  setPaying(true);
                  // 1) Check if user already has access
                  const accessRes = await fetch(`/api/access?course_id=${encodeURIComponent(id)}`);
                  const accessJson = await accessRes.json();
                  if (accessRes.ok && accessJson?.hasAccess) {
                    setCurrentIndex(0);
                    setVideoOpen(true);
                    setHasAccess(true);
                    return;
                  }

                  // 2) If not, create a checkout session and redirect
                  const checkoutRes = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ course_id: id, title, amount: 0 }),
                  });
                  const json = await checkoutRes.json();
                  if (!checkoutRes.ok) throw new Error(json?.error || 'Failed to start checkout');
                  if (json?.url) {
                    window.location.href = json.url;
                  }
                } catch (e: any) {
                  alert(e?.message || 'Unable to proceed');
                } finally {
                  setPaying(false);
                }
              }}
              disabled={paying}
              variant="default"
              className="flex-1 sm:flex-none sm:w-full h-9 px-3 text-sm rounded-lg"
            >
              {paying ? 'Processing…' : hasAccess ? 'Watch Videos' : 'Pay Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full">
          <div className="flex justify-between items-center p-3">
            <DialogTitle className="text-2xl font-semibold">
              {title}
            </DialogTitle>
            {/* <button onClick={() => setDetailsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={24} />
            </button> */}
          </div>

          {/* Course Details */}
          <div className="flex flex-col p-4 space-y-4">
            <div className="max-h-[70vh] overflow-y-auto px-1">
              {detailed_description
                .split(/\n{2,}/)
                .filter((p) => p.trim().length > 0)
                .map((para, idx) => (
                  <p
                    key={idx}
                    className="text-gray-700 dark:text-gray-200 text-left break-words whitespace-pre-line leading-7 mb-4"
                  >
                    {para.trim()}
                  </p>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Watch Videos Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl w-full">
          <div className="flex justify-between items-center p-3">
            <DialogTitle className="text-2xl font-semibold">{title} — Videos</DialogTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
            {/* Player */}
            <div className="md:col-span-3">
              {embed.type !== "none" && (
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg ring-1 ring-border">
                  {embed.type === "youtube" || embed.type === "vimeo" ? (
                    <iframe
                      src={embed.src}
                      title={`${title} video ${currentIndex + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video className="w-full h-full" controls src={embed.src} />
                  )}
                </div>
              )}
              {/* Prev / Next */}
              {videoEntries.length > 1 && (
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((i) => (i - 1 + videoEntries.length) % videoEntries.length)}
                  >
                    Prev
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {videoEntries.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((i) => (i + 1) % videoEntries.length)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Playlist */}
            <div className="md:col-span-1 max-h-[60vh] overflow-auto border rounded-md p-2 space-y-2 bg-background/40">
              {videoEntries.length === 0 && (
                <p className="text-sm text-muted-foreground">No videos provided.</p>
              )}
              {videoEntries.map((v: VideoEntry, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full text-left text-sm p-2 rounded-md border transition-colors flex items-center gap-3 hover:bg-secondary/60 ${
                    idx === currentIndex ? "bg-secondary ring-1 ring-primary" : ""
                  }`}
                >
                  <img
                    src={getThumb(v.url)}
                    alt={v.label}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <span className="line-clamp-2 text-left">{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share functionality removed */}
    </>
  );
}
