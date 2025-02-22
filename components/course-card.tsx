"use client";

import { useState } from "react";
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
}

export function CourseCard({
  imageUrl,
  title,
  description,
  detailed_description,
  Link,
  id,
}: CourseCardProps) {
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const fullUrl = `${url?.replace(/\/$/, "")}${pathName}`;

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
          <div className="flex flex-col items-center p-4 space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-center px-4">
              {detailed_description}
            </p>

            <Button
              onClick={() => router.push(Link)}
              className="w-40 hover:bg-primary/90"
            >
              Go To Course
            </Button>
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
