'use client';
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface FormData {
  title: string;
  description: string;
  price: string;
  detailed_description: string;
  thumbnail_link: string;
  video_link?: string;
  resource_link?: string;
}

export default function AddCourseForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    detailed_description: "",
    thumbnail_link: "",
    video_link: "",
    resource_link: ""
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailUpload = async () => {
    const Preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const ImageUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    if (!thumbnailFile) {
      setErrorMessage("Please choose an image file first.");
      return;
    }
    if (!Preset || !ImageUrl) {
      setErrorMessage("Image upload is not configured. Please set NEXT_PUBLIC_CLOUDINARY_URL and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your env and restart the server.");
      return;
    }
    setUploadingThumbnail(true);
    setErrorMessage("");
    const uploadData = new FormData();
    uploadData.append("file", thumbnailFile);
    uploadData.append("upload_preset", `${Preset}`);

    try {
      const response = await axios.post(`${ImageUrl}`, uploadData);
      setFormData((prev) => ({ ...prev, thumbnail_link: response.data.secure_url }));
      setUploadingThumbnail(false);
    } catch (error) {
      console.error("Error uploading image", error);
      setUploadingThumbnail(false);
      setErrorMessage("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    try {
      await axios.post("/api/courses/postCourse", formData);
      router.push("/courses/allcourses");
    } catch (error) {
      console.error("Error submitting form", error);
      setErrorMessage("Error submitting form. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-2xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input name="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} required />
            </div>

            <div>
              <Label>Price</Label>
              <Input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>

            <div>
              <Label>Detailed Description</Label>
              <Textarea name="detailed_description" value={formData.detailed_description} onChange={handleInputChange} required />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setThumbnailFile(f);
                    setThumbnailPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
                <Button
                  type="button"
                  onClick={handleThumbnailUpload}
                  disabled={uploadingThumbnail || !!formData.thumbnail_link || !thumbnailFile}
                  className="mt-0"
                >
                  {uploadingThumbnail ? "Uploading..." : !!formData.thumbnail_link ? "Uploaded" : "Upload"}
                </Button>
              </div>
              {(thumbnailPreview || formData.thumbnail_link) && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview || formData.thumbnail_link}
                    alt="Selected thumbnail preview"
                    className="w-28 h-16 object-cover rounded border"
                  />
                  <span className="text-xs text-muted-foreground break-all">
                    {thumbnailFile?.name || formData.thumbnail_link}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Label>Video Link(s)</Label>
              <Textarea
                name="video_link"
                value={formData.video_link}
                onChange={handleInputChange}
                required
                placeholder={`Paste one or more video URLs (YouTube/Vimeo/embed or direct mp4/webm).\nSeparate multiple links with new lines or commas.`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Example (playlist): one item per line. You can add an optional label before a pipe.
                <br />
                Intro | https://youtu.be/abc123
                <br />
                Module 1 | https://player.vimeo.com/video/987654
                <br />
                Or unlabeled: https://cdn.example.com/lesson1.mp4
              </p>
            </div>

            <div>
              <Label>Resource Link (Optional)</Label>
              <Input name="resource_link" value={formData.resource_link} onChange={handleInputChange} />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
