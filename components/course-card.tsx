"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  imageUrl: string;
  title: string;
  description: string;
  onView: () => void;
  onBuy: () => void;
}

export function CourseCard({ imageUrl, title, description, onView, onBuy }: CourseCardProps) {
  return (
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
          <h3 className="text-xl font-semibold text-foreground mb-3">{title.toUpperCase()}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onView}
            variant="outline"
            className="flex-1 sm:flex-none sm:w-32 hover:bg-secondary/80"
          >
            View Course
          </Button>
          <Button
            onClick={onBuy}
            className="flex-1 sm:flex-none sm:w-32 hover:bg-primary/90"
          >
            Buy Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}