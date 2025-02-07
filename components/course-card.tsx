// "use client";
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

interface CourseCardProps {
  imageUrl: string
  title: string
  description: string
  onView: () => void
  onBuy: () => void
}

export function CourseCard({ imageUrl, title, description, onView, onBuy }: CourseCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden">
      <div className="w-full sm:w-1/3">
        <AspectRatio ratio={4 / 3}>
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover"  />
        </AspectRatio>
      </div>
      <CardContent className="flex-1 p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onView} variant="outline" className="flex-1">
            View Course
          </Button>
          <Button onClick={onBuy} className="flex-1">
            Buy Course
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

