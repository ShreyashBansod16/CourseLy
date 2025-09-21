"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { Copy, X } from "lucide-react";

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
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const fullUrl = `${url?.replace(/\/$/, "")}${pathName}`;

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

  // If redirected back with a successful purchase, auto-open videos after confirming access
  useEffect(() => {
    if (!autoOpen) return;
    (async () => {
      try {
        const accessRes = await fetch(`/api/access?course_id=${encodeURIComponent(id)}`);
        const accessJson = await accessRes.json();
        if (accessRes.ok && accessJson?.hasAccess) {
          setCurrentIndex(0);
          setVideoOpen(true);
        }
      } catch {
        // ignore
      }
    })();
  }, [autoOpen, id]);

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${fullUrl}/${id}`);
      alert("URL copied to clipboard! ✅");
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <>
      <Card className="flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border">
        {/* Image Section */}
        <div className="w-full sm:w-1/3">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </AspectRatio>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {title.toUpperCase()}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShareOpen(true)}
              variant="outline"
              className="flex-1 sm:flex-none sm:w-32 hover:bg-secondary/80"
            >
              Share Course
            </Button>
            <Button
              onClick={() => setDetailsOpen(true)}
              className="flex-1 sm:flex-none sm:w-32 hover:bg-primary/90"
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
                    return;
                  }

                  // 2) If not, create a checkout session and redirect
                  const priceCents = 9900; // $99.00 — adjust as needed or pull from data
                  const checkoutRes = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ course_id: id, title, amount: priceCents }),
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
              variant="secondary"
              className="flex-1 sm:flex-none sm:w-36"
            >
              {paying ? 'Processing…' : 'Watch Videos'}
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

      {/* Share Course Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md md:max-w-lg w-full">
          <div className="flex justify-between items-center p-3">
            <DialogTitle className="text-xl font-semibold">
              Share Course
            </DialogTitle>
            {/* <button onClick={() => setShareOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={24} />
            </button> */}
          </div>

          {/* Share URL Section */}
          {/* Share URL Section */}
<div className="flex items-center w-full px-4 py-2 border rounded-md bg-muted text-sm">
  <div
    className="w-full overflow-auto break-all whitespace-normal p-2 rounded-md bg-background text-foreground text-sm select-all"
  >
    {`${fullUrl}/${id}`}
  </div>
  <button
    onClick={copyToClipboard}
    className="ml-2 text-primary hover:text-primary/80 flex-shrink-0"
  >
    <Copy size={20} />
  </button>
</div>

        </DialogContent>
      </Dialog>
    </>
  );
}
